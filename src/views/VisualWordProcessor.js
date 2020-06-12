
import React, { Component } from 'react';
import { Button, ButtonToolbar, ButtonGroup, Modal, Form} from 'react-bootstrap';
import {faFont, faCode, faFileCode, faBold, faItalic, faAlignLeft, faAlignRight, faAlignJustify, faAlignCenter,
        faOutdent, faIndent, faUnderline, faStrikethrough, faListUl, faListOl, faRemoveFormat, faLink, faUnlink, faUndo, faRedo,
        faFillDrip, faHighlighter, faHeading} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Controlled  as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

export class VisualWordProcessor extends Component
{
    static defaultProps = {
        input: ""
    };

    constructor(props){
        super(props);

        this.applyFontTypeset = this.applyFontTypeset.bind(this);
        this.applyColorTypeset = this.applyColorTypeset.bind(this);
        this.removeColorTypeset = this.removeColorTypeset.bind(this);
        this.applyNumerationTypeset = this.applyNumerationTypeset.bind(this);
        this.applyAlignmentTypeset = this.applyAlignmentTypeset.bind(this);
        this.applyIndentTypeset = this.applyIndentTypeset.bind(this);

        this.onRemoveTypeset = this.onRemoveTypeset.bind(this);

        this.onOpenInputLink = this.onOpenInputLink.bind(this);
        this.onCloseInputLink = this.onCloseInputLink.bind(this);
        this.onRemoveLink = this.onRemoveLink.bind(this);

        this.onKeyUp = this.onKeyUp.bind(this);

        this.updateStatusBar = this.updateStatusBar.bind(this);

        this.updateHistory = this.updateHistory.bind(this);
        this.undoHistory = this.undoHistory.bind(this);
        this.redoHistory = this.redoHistory.bind(this);

        this.onShowCodeEditor = this.onShowCodeEditor.bind(this);
        this.onChangeCodeSource = this.onChangeCodeSource.bind(this);

        this.state = {statusBar: "", history: {undo: [], redo:[]}, showInputLink: false, showCodeEditor: false, codeSource: ""};

        this.editorRef = React.createRef();
    }

    componentDidMount(){
        //window.document.execCommand("defaultParagraphSeparator", false, "br");
    }

    componentWillUnmount(){
    }

    render(){
        let main = 
            <div style={{margin: "1rem", border: "1px solid #efefef"}}>
                <div style={{backgroundColor: "#fafafa", minHeight: 50, padding: ".5rem"}}>
                    <ButtonToolbar aria-label="Toolbar with Button groups">
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary"><FontAwesomeIcon icon={faFileCode}/></Button>
                            <Button  variant="secondary" onClick={this.onShowCodeEditor}><FontAwesomeIcon icon={faCode}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm">
                            <Button variant="secondary" onClick={() => this.applyFontTypeset("alpha-h3")}><FontAwesomeIcon icon={faHeading}/><sup>3</sup></Button>
                            <Button variant="secondary" onClick={() => this.applyFontTypeset("alpha-h4")}><FontAwesomeIcon icon={faHeading}/><sup>4</sup></Button>
                            <Button variant="secondary" onClick={() => this.applyFontTypeset("alpha-h5")}><FontAwesomeIcon icon={faHeading}/><sup>5</sup></Button>
                            <Button variant="secondary" onClick={() => this.applyFontTypeset("alpha-font-bold")}><FontAwesomeIcon icon={faBold}/></Button>
                            <Button variant="secondary" onClick={() => this.applyFontTypeset("alpha-font-italic")}><FontAwesomeIcon icon={faItalic}/></Button>
                            <Button variant="secondary" onClick={() => this.applyFontTypeset("alpha-text-underline")}><FontAwesomeIcon icon={faUnderline}/></Button>
                            <Button variant="secondary" onClick={() => this.applyFontTypeset("alpha-text-line-through")}><FontAwesomeIcon icon={faStrikethrough}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm">
                            <Button variant="secondary"><FontAwesomeIcon icon={faFillDrip}/> <input type="color" name="backgroundColor" onChange={this.applyColorTypeset}/></Button>
                            <Button variant="outline-secondary" onClick={() => this.removeColorTypeset('backgroundColor')}><FontAwesomeIcon icon={faRemoveFormat}/></Button>
                            <Button variant="secondary"><FontAwesomeIcon icon={faFont}/> <input type="color" name="color" onChange={this.applyColorTypeset}/></Button>
                            <Button variant="outline-secondary" onClick={() => this.removeColorTypeset('color')}><FontAwesomeIcon icon={faRemoveFormat}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={() => this.applyNumerationTypeset("ul")}><FontAwesomeIcon icon={faListUl}/></Button>
                            <Button  variant="secondary" onClick={() => this.applyNumerationTypeset("ol")}><FontAwesomeIcon icon={faListOl}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={() => this.applyAlignmentTypeset("left")}><FontAwesomeIcon icon={faAlignLeft}/></Button>
                            <Button  variant="secondary" onClick={() => this.applyAlignmentTypeset("center")}><FontAwesomeIcon icon={faAlignCenter}/></Button>
                            <Button  variant="secondary" onClick={() => this.applyAlignmentTypeset("right")}><FontAwesomeIcon icon={faAlignRight}/></Button>
                            <Button  variant="secondary" onClick={() => this.applyAlignmentTypeset("justify")}><FontAwesomeIcon icon={faAlignJustify}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={() => this.applyIndentTypeset("outdent")}><FontAwesomeIcon icon={faOutdent}/></Button>
                            <Button  variant="secondary" onClick={() => this.applyIndentTypeset("indent")}><FontAwesomeIcon icon={faIndent}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={this.onOpenInputLink}><FontAwesomeIcon icon={faLink}/></Button>
                            <Button  variant="secondary"  onClick={this.onRemoveLink}><FontAwesomeIcon icon={faUnlink}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={this.undoHistory} disabled={this.state.history.undo.length === 0}><FontAwesomeIcon icon={faUndo}/></Button>
                            <Button  variant="secondary" onClick={this.redoHistory}  disabled={this.state.history.redo.length === 0}><FontAwesomeIcon icon={faRedo}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={this.onRemoveTypeset}><FontAwesomeIcon icon={faRemoveFormat}/></Button>
                        </ButtonGroup>
                        
                    </ButtonToolbar>
                </div>
                
                <div style={{display: (this.state.showCodeEditor ? 'none' : 'block')}}>
                    <div ref={this.editorRef} contentEditable={true} style={{backgroundColor: "#FFF", minHeight: 300, padding: "1rem"}}
                        onKeyUp={this.onKeyUp} onClick={this.updateStatusBar} onChange={this.updateHistory}>
                    </div>

                    <div style={{minHeight: 30, backgroundColor: "#efefef", padding: ".5rem"}}>{this.state.statusBar.toString()}</div>
                </div>
                {this.state.showCodeEditor &&
                    <CodeMirror  value={this.state.codeSource}  options={{mode: 'xml', tabSize: 4, theme: 'material', lineNumbers: true, electricChars: true}} onBeforeChange={this.onChangeCodeSource}
                            />
                }

                {this.state.modalInputLink && <InputLink selection={this.getCurrentSelection()} onClose={this.onCloseInputLink}/>}
            </div>;
        
        /*<ButtonGroup className="mr-2 mb-2" size="sm" >
                            <Button variant="secondary" onClick={() => this.applyTypeset("hl")}><FontAwesomeIcon icon={faHighlighter}/></Button>
                        </ButtonGroup>*/
        return main;
    }

    getCurrentSelection(){
        let result = {};
        result.sel = window.getSelection ? window.getSelection() : document.selection;
        if(!result.sel){ return null; }

        if(result.sel.rangeCount === 0){ return null;}
        if(result.sel.extentOffset - result.sel.anchorOffset === 0){ return null;}

        result.range = result.sel.getRangeAt(0);
        result.node = (result.sel.anchorNode instanceof Element ? result.sel.anchorNode :  result.sel.anchorNode.parentElement);
        result.parentNode = (result.node === this.editorRef.current ? result.node : result.node.parentElement);

        return result;
    }

    isEditorRootNode(node){
        return (node === this.editorRef.current);
    }

    applyFontTypeset(option){
        let sel = this.getCurrentSelection();
        
        if(sel === null){ return; }

        if(this.isEditorRootNode(sel.node)){
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

        this.updateStatusBar();
        this.updateHistory();
    }

    removeColorTypeset(prop){
        let sel = this.getCurrentSelection();
        
        if(sel === null){ return; }

        sel.node.style[prop] = "";

        this.updateStatusBar();
        this.updateHistory();
    }

    applyColorTypeset(event){
        let sel = this.getCurrentSelection();
        
        if(sel === null){ return; }

        let prop = event.target.name;
        let color = event.target.value;

        if(this.isEditorRootNode(sel.node)){
            let newNode = document.createElement("span");
            newNode.appendChild(sel.range.extractContents());
            newNode.style[prop] = color
            sel.node.appendChild(newNode);
        }
        else{
            sel.node.style[prop] = color
        }

        this.updateStatusBar();
        this.updateHistory();
    }

    applyNumerationTypeset(option){
        let sel = this.getCurrentSelection();
        
        if(sel === null){ return; }

        let newNode = document.createElement(option);
        let li = document.createElement("li");
        newNode.appendChild(li);
        li.appendChild(sel.range.extractContents());
        sel.range.insertNode(newNode);

        this.updateStatusBar();
        this.updateHistory();
    }

    applyAlignmentTypeset(option){
        let sel = this.getCurrentSelection();
        
        if(sel === null){ return; }

        if(this.isEditorRootNode(sel.node)){
            let newNode = document.createElement("p");
            newNode.appendChild(sel.range.extractContents());
            newNode.style.textAlign = option;
            sel.node.appendChild(newNode);
        }
        else{
            console.log(sel.node)
            if((sel.node instanceof HTMLDivElement) || (sel.node instanceof HTMLParagraphElement)){
                sel.node.style.textAlign = option;
            }
            else if(!this.isEditorRootNode(sel.parentNode)){
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
       
        this.updateStatusBar();
        this.updateHistory();
    }

    applyIndentTypeset(option){
        let sel = this.getCurrentSelection();
        
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
       
        this.updateStatusBar();
        this.updateHistory();
    }

    onRemoveLink(){
        let sel = this.getCurrentSelection();
        
        if(sel === null){ return; }

        if(sel.node instanceof HTMLAnchorElement){
            sel.parentNode.insertAdjacentHTML("beforeend", sel.node.innerHTML);
            sel.node.remove();
        }
        
        this.updateStatusBar();
        this.updateHistory();
    }

    onRemoveTypeset(){
        let sel = this.getCurrentSelection();
        
        if(sel === null){ return; }

        sel.node.style.textAlign = "";
        sel.node.style.backgroundColor = "";
        sel.node.style.color = "";

        if(sel.node !== this.editorRef.current){
            sel.parentNode.insertAdjacentHTML("beforeend", sel.sel.toString());
            sel.node.remove();    
        }

        this.updateStatusBar();
        this.updateHistory();
    }

    onShowCodeEditor(){
        if(this.state.showCodeEditor){
            let parser = new DOMParser();
            let document = parser.parseFromString(this.state.codeSource, 'text/html');

            this.editorRef.current.innerHTML = document.body.innerHTML;
            console.log(this.editorRef.current.innerHTML, document.body.firstChild)
            this.setState({showCodeEditor: !this.state.showCodeEditor, codeSource: ""});
        }
        else{            
            this.setState({showCodeEditor: !this.state.showCodeEditor, codeSource: this.editorRef.current.innerHTML});
        }
    }

    onChangeCodeSource(editor, data, value){
        //console.log(editor, data, value);
        this.setState({codeSource: value});
    }

    onKeyUp(){
        this.updateStatusBar();
        this.updateHistory();
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

        console.log(history)
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
        let sel = window.getSelection ? window.getSelection() : document.selection;
        if(!sel){ return; }

        let node = (sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode.parentElement); 

        let result = [node.nodeName.toLowerCase()];
        while(node !== this.editorRef.current){
            node = node.parentElement;

            if(node !== null){ break;}

            result.push(node.nodeName.toLowerCase());
        }

        this.setState({statusBar: result.reverse().join(" / ")});
    }

    onOpenInputLink(){
        let sel = this.getCurrentSelection();

        if(sel === null || sel.node === null){ return; }

        this.setState({modalInputLink: true});
    }

    onCloseInputLink(){
        this.setState({modalInputLink: false});
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