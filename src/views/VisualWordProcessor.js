
import React, { Component } from 'react';
import { Button, ButtonToolbar, ButtonGroup, Modal, Form} from 'react-bootstrap';
import {faFont, faCode, faFileCode, faBold, faItalic, faAlignLeft, faAlignRight, faAlignJustify, faAlignCenter,
        faOutdent, faIndent, faUnderline, faStrikethrough, faListUl, faListOl, faRemoveFormat, faLink, faUnlink, faUndo, faRedo,
        faFillDrip, faHighlighter, faHeading} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Controlled  as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
var beautifyingHTML = require("pretty");

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

export class VisualWordProcessor extends Component
{
    static defaultProps = {
        input: "",
        onVisualBuilder: null
    };

    constructor(props){
        super(props);

        this.setCurrentSelection = this.setCurrentSelection.bind(this);
        this.onRefreshEditor = this.onRefreshEditor.bind(this);

        this.applyNumerationTypeset = this.applyNumerationTypeset.bind(this);
        this.applyIndentTypeset = this.applyIndentTypeset.bind(this);

        this.onRemoveTypeset = this.onRemoveTypeset.bind(this);

        this.onOpenInputLink = this.onOpenInputLink.bind(this);
        this.onCloseInputLink = this.onCloseInputLink.bind(this);
        this.onRemoveLink = this.onRemoveLink.bind(this);

        this.updateStatusBar = this.updateStatusBar.bind(this);

        this.updateHistory = this.updateHistory.bind(this);
        this.undoHistory = this.undoHistory.bind(this);
        this.redoHistory = this.redoHistory.bind(this);

        this.onShowCodeEditor = this.onShowCodeEditor.bind(this);
        this.onChangeCodeSource = this.onChangeCodeSource.bind(this);

        this.onHighlighter = this.onHighlighter.bind(this);

        this.state = {
            selection: null,
            statusBar: "",  
            history: {undo: [], redo:[]}, 
            showInputLink: false, 
            showCodeEditor: false, codeSource: "",
            highlighterOn: false
        };

        this.editorRef = React.createRef();
    }

    componentDidMount(){
        //window.document.execCommand("defaultParagraphSeparator", false, "br");
    }

    componentWillUnmount(){
    }

    render(){
        let main = 
            <div style={{margin: "1rem", border: "1px solid #efefef"}} className={(this.state.highlighterOn ? "cursor-highlighter" : "")}>
                <div style={{backgroundColor: "#fafafa", minHeight: 50, padding: ".5rem"}}>
                    <ButtonToolbar aria-label="Toolbar with Button groups">
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={this.props.onVisualBuilder}><FontAwesomeIcon icon={faFileCode} title="Éditeur visuel HTML"/></Button>
                            <Button  variant="secondary" onClick={this.onShowCodeEditor}><FontAwesomeIcon icon={faCode} title="Éditeur code HTML"/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm">
                            <BtnSetCssClass selection={this.state.selection} cssClass="alpha-h3" icon={faHeading} text={<sup>3</sup>} onClick={this.onRefreshEditor} title="h3"/>
                            <BtnSetCssClass selection={this.state.selection} cssClass="alpha-h4" icon={faHeading} text={<sup>4</sup>} onClick={this.onRefreshEditor} title="h4"/>
                            <BtnSetCssClass selection={this.state.selection} cssClass="alpha-h5" icon={faHeading} text={<sup>5</sup>} onClick={this.onRefreshEditor} title="h5"/>
                            <BtnSetCssClass selection={this.state.selection} cssClass="alpha-font-bold" icon={faBold} onClick={this.onRefreshEditor} title="Gras"/>
                            <BtnSetCssClass selection={this.state.selection} cssClass="alpha-font-italic" icon={faItalic} onClick={this.onRefreshEditor} title="Italique"/>
                            <BtnSetCssClass selection={this.state.selection} cssClass="alpha-text-underline" icon={faUnderline} onClick={this.onRefreshEditor} title="Souligné"/>
                            <BtnSetCssClass selection={this.state.selection} cssClass="alpha-text-line-through" icon={faStrikethrough} onClick={this.onRefreshEditor} title="Barré"/>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm">
                            <BtnSetCssProp selection={this.state.selection} cssProp="backgroundColor" icon={faFillDrip} defaultValue="#FFFFFF" onClick={this.onRefreshEditor}  title="Couleur d'arrière-plan"/>
                            <BtnUnsetCssProp selection={this.state.selection} cssProp="backgroundColor" icon={faRemoveFormat} defaultValue="#FFFFFF" onClick={this.onRefreshEditor}/>
                            <BtnSetCssProp selection={this.state.selection} cssProp="color" icon={faFont} defaultValue="#000000" onClick={this.onRefreshEditor} title="Couleur de la police"/>
                            <BtnUnsetCssProp selection={this.state.selection} cssProp="color" icon={faRemoveFormat} defaultValue="#000000" onClick={this.onRefreshEditor}/>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={() => this.applyNumerationTypeset("ul")}><FontAwesomeIcon icon={faListUl} title="Liste non numérotée"/></Button>
                            <Button  variant="secondary" onClick={() => this.applyNumerationTypeset("ol")}><FontAwesomeIcon icon={faListOl} title="Liste numérotée"/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <BtnAlignment selection={this.state.selection} cssProp="left" icon={faAlignLeft} onClick={this.onRefreshEditor}  title="Aligner à gauche"/>
                            <BtnAlignment selection={this.state.selection} cssProp="center" icon={faAlignCenter} onClick={this.onRefreshEditor} title="Centrer"/>
                            <BtnAlignment selection={this.state.selection} cssProp="right" icon={faAlignRight} onClick={this.onRefreshEditor} title="Aligner à droite"/>
                            <BtnAlignment selection={this.state.selection} cssProp="justify" icon={faAlignJustify} onClick={this.onRefreshEditor} title="Justifier"/>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={() => this.applyIndentTypeset("outdent")}  title="Désindenter"><FontAwesomeIcon icon={faOutdent}/></Button>
                            <Button  variant="secondary" onClick={() => this.applyIndentTypeset("indent")}  title="Indenter"><FontAwesomeIcon icon={faIndent}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={this.onOpenInputLink} title="Lien"><FontAwesomeIcon icon={faLink}/></Button>
                            <Button  variant="secondary" onClick={this.onRemoveLink} title="Supprimer le lien"><FontAwesomeIcon icon={faUnlink}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={this.undoHistory} disabled={this.state.history.undo.length === 0} title="Annuler"><FontAwesomeIcon icon={faUndo}/></Button>
                            <Button  variant="secondary" onClick={this.redoHistory}  disabled={this.state.history.redo.length === 0} title="Répéter"><FontAwesomeIcon icon={faRedo}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant={(this.state.highlighterOn ? 'warning' : "secondary")} onClick={this.onHighlighter} title="Outil de surlignage"><FontAwesomeIcon icon={faHighlighter}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={this.onRemoveTypeset} title="Supprimer la mise en forme"><FontAwesomeIcon icon={faRemoveFormat}/></Button>
                        </ButtonGroup>
                        
                    </ButtonToolbar>
                </div>
                
                <div style={{display: (this.state.showCodeEditor ? 'none' : 'block')}}>
                    <div ref={this.editorRef} contentEditable={true} style={{backgroundColor: "#FFF", minHeight: 300, padding: "1rem", resize: 'vertical', overflow: 'auto'}}
                        onKeyUp={this.onRefreshEditor} onClick={this.onRefreshEditor}>
                    </div>

                    <div style={{minHeight: 30, backgroundColor: "#efefef", padding: ".5rem"}}>{this.state.statusBar.toString()}</div>
                </div>
                {this.state.showCodeEditor &&
                    <CodeMirror  value={this.state.codeSource}  options={{mode: 'xml', tabSize: 4, theme: 'material', lineNumbers: true, electricChars: true}} 
                            onBeforeChange={this.onChangeCodeSource}/>
                }

                {this.state.modalInputLink && <InputLink selection={this.state.selection} onClose={this.onCloseInputLink}/>}
            </div>;
                
        return main;
    }

    onHighlighter(){
        this.setState({highlighterOn: !this.state.highlighterOn});
    }

    onUserHighlight(){
        if(this.state.highlighterOn){
            let sel = this.state.selection;

            if(sel === null){return;}

            if(sel.sel.extentOffset - sel.sel.anchorOffset > 0){
                //let search = sel.sel.anchorNode.textContent.substring(sel.sel.extentOffset, sel.sel.anchorOffset);
                let newNode = document.createElement("span");
                newNode.style.backgroundColor = "#ffc107";
                newNode.appendChild(sel.range.extractContents());
                //sel.node.appendChild(newNode);
                sel.range.insertNode(newNode);
            }
        }
    }

    onRefreshEditor(event){
        let type = (event ? event.type : "");

        switch(type){
            case "keyup":
                this.updateStatusBar();
                this.updateHistory();
                this.setCurrentSelection();
                break;
            case "click":
                this.setCurrentSelection();
                this.updateStatusBar();
                this.updateHistory();
                break;
            default:
                this.setCurrentSelection();
        }
        this.onUserHighlight();        
    }

    setCurrentSelection(){
        let result = {};
        result.sel = window.getSelection ? window.getSelection() : document.selection;
        if(!result.sel){ return null; }

        if(result.sel.rangeCount === 0){ return null;}
//        if(result.sel.extentOffset - result.sel.anchorOffset === 0){ return null;}

        result.range = result.sel.getRangeAt(0);
        result.node = (result.sel.anchorNode instanceof Element ? result.sel.anchorNode :  result.sel.anchorNode.parentElement);
        result.isNodeRoot = (result.node === this.editorRef.current);
        result.parentNode = (result.node === this.editorRef.current ? result.node : result.node.parentElement);
        result.isParentNodeRoot = (result.node === this.editorRef.current);

        this.setState({selection: result});
    }

    applyNumerationTypeset(option){
        let sel = this.state.selection;
        
        if(sel === null){ return; }

        let newNode = document.createElement(option);
        let li = document.createElement("li");
        newNode.appendChild(li);
        li.appendChild(sel.range.extractContents());
        sel.range.insertNode(newNode);
    }    

    applyIndentTypeset(option){
        let sel = this.state.selection;
        
        if(sel === null){ return; }

        if(option === "indent"){
            let newNode = document.createElement("div");
            newNode.appendChild(sel.range.extractContents());
            newNode.style.paddingLeft = "30px";
            newNode.setAttribute("data-indent", "1");
            sel.range.insertNode(newNode);
        }
        else{
            //let node = (sel.anchorNode instanceof Element ? sel.anchorNode :  sel.anchorNode.parentElement);
            if(sel.node.getAttribute("data-indent") === "1"){
                sel.parentNode.insertAdjacentHTML("beforeend", sel.node.innerHTML);
                sel.node.remove();
            } 
        }
    }

    onRemoveLink(){
        let sel = this.state.selection;
        
        if(sel === null){ return; }

        if(sel.node instanceof HTMLAnchorElement){
            sel.parentNode.insertAdjacentHTML("beforeend", sel.node.innerHTML);
            sel.node.remove();
        }
    }

    onRemoveTypeset(){
        let sel = this.state.selection;
        
        if(sel === null){ return; }

        sel.node.style.textAlign = "";
        sel.node.style.backgroundColor = "";
        sel.node.style.color = "";

        if(!sel.isNodeRoot){
            sel.parentNode.insertAdjacentHTML("beforeend", sel.node.innerHTML);
            sel.node.remove();    
        }
    }

    onShowCodeEditor(){
        if(this.state.showCodeEditor){
            let parser = new DOMParser();
            let document = parser.parseFromString(this.state.codeSource, 'text/html');

            this.editorRef.current.innerHTML = document.body.innerHTML;
            this.setState({showCodeEditor: !this.state.showCodeEditor, codeSource: ""});
        }
        else{            
            let codeSource = this.editorRef.current.innerHTML;
            codeSource = beautifyingHTML(codeSource, {ocd: true});
            this.setState({showCodeEditor: !this.state.showCodeEditor, codeSource: codeSource});
        }
    }

    onChangeCodeSource(editor, data, value){
        this.setState({codeSource: value});
    }
  
    updateHistory(){
        let history = this.state.history;
        
        if(history.undo.length === 0){
            history.undo.push("");
        }
        else if(history.undo.length > 15){
            history.undo.unshift();
        }
        else if(history.undo[history.undo.length - 1] !== this.editorRef.current.innerHTML){
            history.undo.push(this.state.codeSource);
        }

        this.setState({history: history, codeSource: this.editorRef.current.innerHTML});
    }

    undoHistory(){
        let history = this.state.history;
        let content = history.undo.pop() || "";
        
        if(content !== null){
            history.redo.push(this.editorRef.current.innerHTML);

            this.editorRef.current.innerHTML = content;
            if(history.redo.length > 15){
                history.redo.unshift();
            }
        }
        this.setState({history: history, codeSource: this.editorRef.current.innerHTML});
    }

    redoHistory(){
        let history = this.state.history;
        let content = history.redo.pop() || "";
        
        if(content !== null){
            history.undo.push(this.editorRef.current.innerHTML);

            this.editorRef.current.innerHTML  = content;
            if(history.undo.length > 15){
                history.undo.unshift();
            }
        }
        this.setState({history: history, codeSource: this.editorRef.current.innerHTML});
    }

    updateStatusBar(){
        let sel = this.state.selection;
        if(sel === null){ return; }

        let node = sel.node;

        let result = [node.nodeName.toLowerCase()];
        while(node !== this.editorRef.current){
            node = node.parentElement;

            if(node === null){ break;}

            result.push(node.nodeName.toLowerCase());
        }

        this.setState({statusBar: result.reverse().join(" / ")});
    }

    onOpenInputLink(){
        let sel = this.state.selection;

        if(sel === null || sel.node === null){ return; }

        this.setState({modalInputLink: true});

        this.onRefreshEditor();
    }

    onCloseInputLink(){
        this.setState({modalInputLink: false});
    }
}

class BtnSetCssProp extends Component{
    static defaultProps = {
        selection: null,
        icon: null,
        cssProp: "",
        defaultValue: "",
        onClick: null,
        title: ""
    };

    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    render(){
        let value = this.props.defaultValue;
                
        if((this.props.selection !== null) && (this.props.selection.node !== null)){
            value = this.RGBToHex(this.props.selection.node.style[this.props.cssProp]);
        }

        let main = 
            <Button variant="secondary" title={this.props.title}>
                <FontAwesomeIcon icon={this.props.icon}/>{" "}
                <input type="color" onChange={this.onChange} value={value}/>
            </Button>;

        return main;
            
    }

    RGBToHex(rgb) {
        rgb = rgb || "rgb(0,0,0)";

        // Choose correct separator
        let sep = rgb.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        rgb = rgb.substr(4).split(")")[0].split(sep);
      
        
        // Convert %s to 0–255
        for (let R in rgb) {
            let r = rgb[R];
            if (r.indexOf("%") > -1)
            rgb[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
            /* Example:
            75% -> 191
            75/100 = 0.75, * 255 = 191.25 -> 191
            */
        }

        let r = (+rgb[0]).toString(16),
            g = (+rgb[1]).toString(16),
            b = (+rgb[2]).toString(16);
      
        if (r.length === 1)
          r = "0" + r;
        if (g.length === 1)
          g = "0" + g;
        if (b.length === 1)
          b = "0" + b;
      
        /*
            Now we can supply values like either of these:
            rgb(255,25,2)
            rgb(255 25 2)
            rgb(50%,30%,10%)
            rgb(50% 30% 10%)
        */
        return "#" + r + g + b;
    }
  
    onChange(event){
        let sel = this.props.selection;
        
        if(sel === null){ return; }

        let prop = this.props.cssProp;
        let color = event.target.value;

        if(sel.isNodeRoot){
            let newNode = document.createElement("span");
            newNode.appendChild(sel.range.extractContents());
            newNode.style[prop] = color
            sel.node.appendChild(newNode);
        }
        else{
            sel.node.style[prop] = color
        }

        if(this.props.onClick){
            this.props.onClick(event);
        }
    }
}

class BtnUnsetCssProp extends Component{
    static defaultProps = {
        selection: null,
        icon: null,
        cssProp: "",
        defaultValue: "",
        onClick: null,
        title: ""
    };

    constructor(props){
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    render(){
        return <Button variant="outline-secondary" onClick={this.onClick} title={this.props.title}><FontAwesomeIcon icon={this.props.icon}/></Button>;
    }

    onClick(event){
        let sel = this.props.selection;
        
        if(sel === null){ return; }

        sel.node.style[this.props.cssProp] = this.props.defaultValue;

        if(this.props.onClick){
            this.props.onClick(event);
        }
    }
}

class BtnSetCssClass extends Component{
    static defaultProps = {
        selection: null,
        icon: null,
        text: null,
        cssClass: "",
        onClick: null,
        title: ""
    };

    constructor(props){
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    render(){
        let sel = this.props.selection;
        let variant = "secondary";

        if((sel !== null) && (sel.node !== null)){
            variant = (sel.node.classList.contains(this.props.cssClass) ? "outline-secondary" : "secondary");
        }

        return <Button variant={variant} onClick={this.onClick} title={this.props.title}><FontAwesomeIcon icon={this.props.icon}/>{this.props.text}</Button>
    }

    onClick(event){
        let sel = this.props.selection;
        let option = this.props.cssClass;
        
        if(sel === null){ return; }
        
        if(sel.isNodeRoot){
            let newNode = document.createElement("span");
            newNode.classList.add(option);
            newNode.appendChild(sel.range.extractContents());
            sel.node.appendChild(newNode);
        }
        else{
            if(sel.node.classList.contains(option)){
                sel.node.classList.remove(option);
            }
            else{
                sel.node.classList.add(option);
            }
        }

        if(this.props.onClick){
            this.props.onClick(event);
        }
    }
}

class BtnAlignment extends Component{
    static defaultProps = {
        selection: null,
        icon: null,
        cssProp: "",
        onClick: null,
        title: ""
    };

    constructor(props){
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    render(){
        let sel = this.props.selection;
        let variant = "secondary";

        if((sel !== null) && (sel.node !== null)){
            variant = (sel.node.style.textAlign === this.props.cssProp ? "outline-secondary" : "secondary");
        }

        return <Button variant={variant} onClick={this.onClick} title={this.props.title}><FontAwesomeIcon icon={this.props.icon}/></Button>
    }

    onClick(event){
        let sel = this.props.selection;
        let option = this.props.cssProp;
        
        if(sel === null){ return; }

        if(sel.isNodeRoot){
            let newNode = document.createElement("p");
            newNode.appendChild(sel.range.extractContents());
            if(newNode.innerHTML.length > 0){
                newNode.style.textAlign = option;
                sel.node.appendChild(newNode);
            }
        }
        else{
            if((sel.node instanceof HTMLDivElement) || (sel.node instanceof HTMLParagraphElement)){
                sel.node.style.textAlign = option;
            }
            else if(!sel.isParentNodeRoot){
                sel.parentNode.style.textAlign = option;
            }
            else{
                let newNode = document.createElement("p");
                //newNode.appendChild(sel.range.extractContents());
                newNode.style.textAlign = option;
                newNode.appendChild(sel.node);
                sel.parentNode.appendChild(newNode);
            }
        }

        if(this.props.onClick){
            this.props.onClick(event);
        }
    }
}

class InputLink extends Component{
    static defaultProps = {
        selection: null,
        onClose: null
    };

    constructor(props){
        super(props);

        this.onSave = this.onSave.bind(this);
        this.onChange = this.onChange.bind(this);

        let url = (props.selection.node instanceof HTMLAnchorElement ? props.selection.node.getAttribute("href") : "");
        let target = (props.selection.node.getAttribute("target") === "_blank" ? true : false);
        this.state = {url: url, target: target, text: props.selection.sel.toString(), selection: props.selection };
    }

    render(){
        let main = 
            <Modal show={true} onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Créer lien</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formURL">
                            <Form.Label>Saisir l'URL</Form.Label>
                            <Form.Control name="url" type="text" value={this.state.url} placeholder="Saisir l'URL" onChange={this.onChange} />
                            <Form.Text className="text-muted">
                                {`Texte à afficher: ${this.state.text}`}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formTarget">
                            <Form.Check name="target" type="checkbox" checked={this.state.target} label="Ouvrir dans une nouvelle fenêtre" onChange={this.onChange}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
        
                <Modal.Footer>
                    <Button variant="primary" onClick={this.onSave} >Créer lien</Button>
                </Modal.Footer>
        </Modal>;

        return main;
    }

    onSave(){
        let sel = this.state.selection;
        let url = this.state.url;
        let target = (this.state.target ? '_blank' : '');

        if(sel.node instanceof HTMLAnchorElement){
            sel.node.href = url;
            sel.node.target = target;
        }
        else{
            let newNode = document.createElement("a");
            newNode.innerHTML = sel.range.extractContents().textContent;
            newNode.setAttribute("href", url);
            newNode.target = target;

            sel.range.insertNode(newNode);
        }

        this.props.onClose();
    }

    onChange(event){
        let data = this.state;
        if(event.target.type === "checkbox"){
            data[event.target.name] = event.target.checked;
        }
        else{
            data[event.target.name] = event.target.value;    
        }

        this.setState(data);
    }
}