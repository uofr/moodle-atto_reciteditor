
import React, { Component } from 'react';
import { Button, ButtonToolbar, ButtonGroup, Modal, Form, Dropdown, DropdownButton} from 'react-bootstrap';
import {faFont, faCode, faFileCode, faBold, faItalic, faAlignLeft, faAlignRight, faAlignJustify, faAlignCenter,
        faOutdent, faIndent, faUnderline, faStrikethrough, faListUl, faListOl, faRemoveFormat, faLink, faUnlink, faUndo, faRedo,
        faFillDrip, faHighlighter, faHeading } from '@fortawesome/free-solid-svg-icons';
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
        content: "",
        onVisualBuilder: null,
        onChange: null
    };

    static Assets = {
        highlighter: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC41ZYUyZQAAAYRJREFUOE+dkz1Lw1AUhpvvpCGKcQhIEOnk4KyD6FInJ4WuDoIudRbFD6qzu7iI9mc4O7sodlcEQbFgBXGw1ucmQWtrPpoXHs7Jzb3vPffcpJBDMpQMwyiFjzmlquq8JEnX0FAUpRwNDybLsqYxuCf9gg75ja7rk8HLjFLZfYmFL+Sdbhg7JVqQLk3TVgmP8McEXmVZXieqEK9arSbTk03SJvSaiGpOiEVIlMHEA+I79Jq0qeTS8zybPFFFJu4S36DPhA0uaPwYebwcxxmlsWek/1UijtOgZ1PkEsSL61wmtKDPBNpsskhMNqGxs7ANWzz2XnWTStaI6eKzn6D0KzinRxsMPYEwafFcJWqQrsjolvSTWOcYh+QfxDox9Zp/xK7iwxNNfsboTlTFMauu6w4FEzLIpJoyC/fZ/ZjFczBDT1bEu3BKulQMdqjgwTRNsdAJhwMl3063fN+3bNte4NorGI0zJI6Rld+fFROPivao6GhQaEMlsgmkwDCM5CD7TWZTofANbolfjJl6AqYAAAAASUVORK5CYII=",
        brand: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAAB0CAMAAABnsTYoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAABpvwJqvyp9vwRrwAZswAduwAhtwQhuwQtvwgtwwQ5wwQ1wwg5xww9ywxBywxJ0wxN0xBd1whR1xBZ2xBl2wRh3xRp4xR95wR56xR56xh97xyJ8xyV8wiR9xyV+yCZ/yTKBvz+HvSeAySiAySyCyi6Dyy+Eyi+EyzCFyzKGyzaIzDeJzTiJzTiKzTuMzj2MzkGGu2WTr3KVpkCOz0KQz0OR0ESQ0EaS0EeS0UmT0UqU0UyV0kyW0U2W0k6X01KZ01Oa01Oa1FWa1Fid1Vqd1lqe1Vue1l6g1l+h12Ki12Sj2Gak2Gqn2Wqn2muo2Wuo2m2o2m6q2nGq23Ks23St3Hau3Hev3Xiv3Xqw3Xux3n6y3n+03rugbPGgL/qiKvmiK/qjLPqjLfqjLvqkL/qnNfqoOPmqP8efXtqfSMOfYcKfZNegS9GgVdWgUNupX9eoYeGgQvqrQPqsQvquR/qvSPqvSfqwS/qzUfqzUvuzVPu1V/u2V/u2WPu4Xfu5X/u6YPu6Yvu+a/u+bPvEePvEefvGfPzEePzEeZacjJychZidjKGvroC034O24Ia34Ie44Ie44Ym64Yy74o284o+945C945C+45TA5JfB5ZfC5JjC5JrC5ZrE5ZvE5pzF5p/G56DH5qDG56HI56PJ6KTJ6KXK6KjM6arN6qzO6q/Q6q/Q67DQ6rLR67PS7LTT7LbU7LjV7brW7bzX7r3Y7r7Z77/a7/vHgPzIgvzJhPzJhfzKhfzKhvzKh/zLiPzLivzOj/zPk/zQk/zQlPzRlf3ZqP3brv3guf3iu/3hvP3ivMDa78Pb8MPc8Mbd8Mfe8Mje8cvg8szg8s7i89Ll89Lk9NTm89bm9Nno9dvq9d3q9t7s9v7kwP3nyf3oy/7r0v7s0/7t1v7t1/7w3eHt9+Pu+OTv+OXw+Obw+ejx+eny+erz+uz0+u71+/7y4/705fD2+/L3/PP4/PT5/Pb6/f/58v/68//89/j7/fr8/v/8+f/9/P/+/P3+/v7+/wAAAFY5PcMAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjVlhTJlAAAGpklEQVRoQ+2Zd3gURRiHb2MiERIDEj0NEVBaIBpOBSOgB4ooiVgIRTHqKdh7B+wtiiWKiBIQLKBobCiCimADGwlqJCgQxI5SFWJUojLnlN9e9mZ3Lsu5k3sen7z8wXxl92Vv2+zgCzfOOzdfOSbkLY1q3zwXnZ7SiPbts9DnMbG1V6HLc2JqR6PJe2Jp0aKDGNoz0aIDtfYcdGhBqb0VDXpQalHXhEo7HnVNqLQo60KhXYiyLhTasSjrQqFFVRvNWgqq2mjWUlDVhqQd1rdbFmWfveNl3/0PvvcC7DsGVm3fJMMb9rv7DOxeRYO2G7bxhD3viT1JMLVD0O8ZB10BgyPQdkezh+xxPhROCG02Wj2l1YVwOMC1XdCoJCUA2iPhilaXQmKHaQeiTc1AIqjrjIQ7dlFe0EyLphi8CO1JiN1yCCw2qNaPHjVt6oV1DmLXJF8MjQzVoiUGJwrrxkzErsgvLSsrvQ8aGV/YxemqEtrDEbqiVGzzATwSPhcH20HsYRpCd2wUG/3p/KXqRiv+4StSEboijW9Dcf5W9fVDXwxeYZuv27lHip87KZiDvr54CecmEfpc7O0xuvX8dghckiqkhJwnPGGES0Toa4G+GKQWDs3F0D0/Cs3mS4RH1qLLc4qE5v6LhKeptEbO0AceHJZnnC48jWkzggMC0bOMzB6B/ED3tojstM4NDgj26aK40BXaNRzzYZv7xG+09jQiw+hR+kmt6Ccbnitw2POhM2pQ37FySh6SVhRaEW1lz72Wx1WLaJjYwjjicxGbbBmZggo4ZiUq4NMACkZ6MbgsFLq6ZMIdv6KjouSuCRNKSqAls42uZdswJh35lhnPI7Sw3Pre8M9H1sIknKB2iMm4UKgEQwumlizH35Q1fEP/KoRR1DR4O65DLoqnRNGt1kIZ2y5N+v1MqszrbXfHfxYhp/JqHNog2+5JBDbME1+GWKaev9J2XrudXbC5COjVNqOgd4/ehTPrEG8S13O7HYhtPMvLCNxr57LNXkJAprVkIcX/GTIFPJyIiGwv65W1W3r74HR26zHq2S2+M9rK4d0zjL3Ydew3j2USd3AycQeLqY15u26LPK7br0dqMA1ca7c/aplnYBpDNlufELNErpZdVJ3EmJDhosY4EqmpdGzV3rL044rfEf6wtGJpRUVFRDsn6g1YjuzjiDmDkGTT6gKM69JFjbNV5ObRoVXL+B7hYhFGtOyXaQCvLRL1aZSD5FF0PAXj+aIkqBS5L+hQpY1+OErayEu6FxKcDCSH0vEcjCeKkqDwYU4xHcal7YgkyUGCsyuSbLfmw0T1pShrv0MYUxtAkowcbAVJdnVvxpg/WhyI62jzkXTmIdqBIYm8ciTi0gaRdIb+yOkYuta6+pH7IOlMPFpXN1Dk3Doy4j9o3V1SjhTp0nZFkgRzHGij60fORDL6vrWCOslHLBPX0SYhSQ5AwsYmNByNWCYurbEB2f4iBPiR2SzTfErRy6uBEdXV1XT2u5IO49MuQ9acwXBSkDyZjs1pwExREswUuZ/pUKV9T4QKrTlRmoWYY348nkDH5htotSgJ5opcrKN9X4QK7RBk1yPm9EOSvfjM5zOxrN8l4YRX0bFK+5EIFdpsZIn1q3s6cuzyxsICIeWixjAfqS/Qsaz9BuHft/NQoTW+RHoVvUlBFywT1SWzKDJLZmeak2lOrybTQNZ+hZCQX75eu3atSjsKaVIzkFvosfyEzMs8xEoM5bVjO7f2d+o/yXwX8ptK1i5BCFTa9MgHEdk2b3bZ1HJTSsgg3uDHsdupz6BlWXsjQqDSGqchb6MGRz8ZsY1nWFXWhr5FLFBqU/DRaeMwNLQ0T7/EFr64YtPe8A8SHKXWyHL8oLM8lrJXIxXF1p68aNOGFiHBUWuNLKz5WakrRJHR1pw+WliG6bZdG3rjL6QoMbRG8vHSx+aOcmkVKyidiarIjM5BG7r2wz+QDPuKgPOKZ17xq+aXTW3lKIels56PrMDnUm1lsWUVPg27LbocTs6Y6267c9Fb9I+LBaLU7JwDA13Vi7qpnQPB/DzVqjSWTCT0rUuBZm1obGK0CxKjDSdEe01itOGEaMclRDs6nBAt+8/MptcuSIh2IbM2tfZsLm1q7Y2wNql2PJyUptKOvv5dGDnatfBINGs9BR6JZq2XpMEjoVvbBx4J3VpoZP6f2iA0Mpq1sNjQqx0Miw2tWj8kdnRqk+FwQKM2CQon9GlTYXBEm7YDBM5o0rYoxv4VaNG2HYm9K/Fam5LV6xTsWk04/C+LOCax9YczEgAAAABJRU5ErkJggg=="
    }

    static Layout = {
        btnNormal: "light",
        btnToggled: "secondary"
    }

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
        this.editorRef.current.innerHTML = this.props.content;
    }

    componentWillUnmount(){
    }

    componentDidUpdate(prevProps) {
        if(prevProps.content !== this.props.content){
            this.editorRef.current.innerHTML = this.props.content;
        }
    }
      
    render(){
        let style = {backgroundColor: "#f7f7f7", border: "1px solid #dfdfdf", borderRadius: "4px"};

        let main = 
            <div style={{border: style.border, cursor: (this.state.highlighterOn ? `url(${VisualWordProcessor.Assets.highlighter}),  auto` : 'inherit')}}>
                <div style={{backgroundColor: style.backgroundColor, minHeight: 50, padding: ".5rem"}}>
                    <ButtonToolbar aria-label="Toolbar with Button groups">
                        <ButtonGroup className="mr-2 mb-2" size="sm" style={{border: style.border, borderRadius: style.borderRadius}}>
                            <Button variant={VisualWordProcessor.Layout.btnNormal} onClick={this.props.onVisualBuilder}><FontAwesomeIcon icon={faFileCode} title="Éditeur visuel HTML"/></Button>
                            <Button  variant={VisualWordProcessor.Layout.btnNormal} onClick={this.onShowCodeEditor}><FontAwesomeIcon icon={faCode} title="Éditeur code HTML"/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" style={{border: style.border, borderRadius: style.borderRadius}}>
                            <DropdownSetCssProp selection={this.state.selection} cssProp="font-size" defaultValue={"16px"} values={["12px", "14px", "16px", "18px", "20px", "25px", "30px", "35px", "40px"]} onClick={this.onRefreshEditor} />
                            <BtnSetCssProp selection={this.state.selection} cssProp="font-weight" defaultValue="normal" value="bold"  icon={faBold} onClick={this.onRefreshEditor} title="Gras"/>
                            <BtnSetCssProp selection={this.state.selection} cssProp="font-style" defaultValue="normal" value="italic" icon={faItalic} onClick={this.onRefreshEditor} title="Italique"/>
                            <BtnSetCssProp selection={this.state.selection} cssProp="text-decoration" defaultValue="normal" value="underline" icon={faUnderline} onClick={this.onRefreshEditor} title="Souligné"/>
                            <BtnSetCssProp selection={this.state.selection} cssProp="text-decoration" defaultValue="normal" value="line-through" icon={faStrikethrough} onClick={this.onRefreshEditor} title="Barré"/>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" style={{border: style.border, borderRadius: style.borderRadius}}>
                            <BtnColorPicker selection={this.state.selection} cssProp="backgroundColor" icon={faFillDrip} defaultValue="#FFFFFF" onClick={this.onRefreshEditor}  title="Couleur d'arrière-plan"/>
                            <BtnUnsetCssProp selection={this.state.selection} cssProp="backgroundColor" icon={faRemoveFormat} defaultValue="#FFFFFF" onClick={this.onRefreshEditor} title="Enlever la couleur d'arrière-plan"/>
                            <BtnColorPicker selection={this.state.selection} cssProp="color" icon={faFont} defaultValue="#000000" onClick={this.onRefreshEditor} title="Couleur de la police"/>
                            <BtnUnsetCssProp selection={this.state.selection} cssProp="color" icon={faRemoveFormat} defaultValue="#000000" onClick={this.onRefreshEditor}  title="Enlever la couleur de la police"/>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm" style={{border: style.border, borderRadius: style.borderRadius}} >
                            <Button variant={VisualWordProcessor.Layout.btnNormal} onClick={() => this.applyNumerationTypeset("ul")}><FontAwesomeIcon icon={faListUl} title="Liste non numérotée"/></Button>
                            <Button  variant={VisualWordProcessor.Layout.btnNormal} onClick={() => this.applyNumerationTypeset("ol")}><FontAwesomeIcon icon={faListOl} title="Liste numérotée"/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm"  style={{border: style.border, borderRadius: style.borderRadius}}>
                            <BtnAlignment selection={this.state.selection} cssProp="left" icon={faAlignLeft} onClick={this.onRefreshEditor}  title="Aligner à gauche"/>
                            <BtnAlignment selection={this.state.selection} cssProp="center" icon={faAlignCenter} onClick={this.onRefreshEditor} title="Centrer"/>
                            <BtnAlignment selection={this.state.selection} cssProp="right" icon={faAlignRight} onClick={this.onRefreshEditor} title="Aligner à droite"/>
                            <BtnAlignment selection={this.state.selection} cssProp="justify" icon={faAlignJustify} onClick={this.onRefreshEditor} title="Justifier"/>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm"  style={{border: style.border, borderRadius: style.borderRadius}}>
                            <Button variant={VisualWordProcessor.Layout.btnNormal} onClick={() => this.applyIndentTypeset("outdent")}  title="Désindenter"><FontAwesomeIcon icon={faOutdent}/></Button>
                            <Button  variant={VisualWordProcessor.Layout.btnNormal} onClick={() => this.applyIndentTypeset("indent")}  title="Indenter"><FontAwesomeIcon icon={faIndent}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm"  style={{border: style.border, borderRadius: style.borderRadius}}>
                            <Button variant={VisualWordProcessor.Layout.btnNormal} onClick={this.onOpenInputLink} title="Lien"><FontAwesomeIcon icon={faLink}/></Button>
                            <Button  variant={VisualWordProcessor.Layout.btnNormal} onClick={this.onRemoveLink} title="Supprimer le lien"><FontAwesomeIcon icon={faUnlink}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm"  style={{border: style.border, borderRadius: style.borderRadius}}>
                            <Button variant={VisualWordProcessor.Layout.btnNormal} onClick={this.undoHistory} disabled={this.state.history.undo.length === 0} title="Annuler"><FontAwesomeIcon icon={faUndo}/></Button>
                            <Button  variant={VisualWordProcessor.Layout.btnNormal} onClick={this.redoHistory}  disabled={this.state.history.redo.length === 0} title="Répéter"><FontAwesomeIcon icon={faRedo}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm"  style={{border: style.border, borderRadius: style.borderRadius}}>
                            <Button variant={(this.state.highlighterOn ? 'warning' : "light")} onClick={this.onHighlighter} title="Outil de surlignage"><FontAwesomeIcon icon={faHighlighter}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2 mb-2" size="sm"  style={{border: style.border, borderRadius: style.borderRadius}}>
                            <Button variant={VisualWordProcessor.Layout.btnNormal} onClick={this.onRemoveTypeset} title="Supprimer la mise en forme"><FontAwesomeIcon icon={faRemoveFormat}/></Button>
                        </ButtonGroup>
                    </ButtonToolbar>                    
                </div>
                
                <div style={{display: (this.state.showCodeEditor ? 'none' : 'block')}}>
                    <div ref={this.editorRef} contentEditable={true} style={{backgroundColor: "#FFF", minHeight: 300, padding: "1rem", resize: 'vertical', overflow: 'auto'}}
                        onKeyUp={this.onRefreshEditor} onClick={this.onRefreshEditor} data-recit-rich-editor='content'>
                    </div>

                    <div style={{minHeight: 30, borderTop: style.border, backgroundColor: style.backgroundColor, padding: ".5rem", display: "flex", justifyContent: "space-between"}}>
                        {this.state.statusBar.toString()}
                        <div>
                            <img src={VisualWordProcessor.Assets.brand} width="20" height="20"></img>
                        </div>
                    </div>
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

    onRefreshEditor(event, clearSelection){
        clearSelection = (typeof clearSelection === "undefined" ? false : clearSelection);

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

        // remove empty tags
        let elements = this.editorRef.current.querySelectorAll('div, p, span, strong');
        for (let el of elements) {
            if((el.innerHTML === '&nbsp;' || el.innerHTML === '')){
                el.parentNode.removeChild(el);
            }
        }

        if(clearSelection){
            //clear selection
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        }

        if((this.props.onChange) && (this.props.content !== this.editorRef.current.innerHTML)){
            this.props.onChange(this.editorRef.current.innerHTML);
        }
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

        if((!sel.isNodeRoot) && (sel.sel.extentOffset - sel.sel.anchorOffset > 0)){            
            sel.parentNode.insertAdjacentHTML("beforeend", sel.node.innerHTML);
            sel.node.remove();    
        }

        this.onRefreshEditor();
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

class DropdownSetCssProp extends Component{
    static defaultProps = {
        selection: null,
        icon: null,
        cssProp: "",
        defaultValue: "",
        values: "",
        onClick: null,
        title: ""
    };

    constructor(props){
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    render(){
        let value = this.getCurrentValue();

        let main = 
            <DropdownButton variant={VisualWordProcessor.Layout.btnNormal} as={ButtonGroup} title={value}>
                {this.props.values.map((item, index) =>
                    <Dropdown.Item key={index} onClick={(event) => this.onClick(event, item)}>{item}</Dropdown.Item>
                )}
                
            </DropdownButton>

        return main;
            
    }
  
    getCurrentValue(){
        let sel = this.props.selection;
        if(sel === null){ 
            return this.props.defaultValue; 
        }

        let currentValue = sel.node.style[this.props.cssProp] || "";

        currentValue = (currentValue.length === 0 ? this.props.defaultValue : currentValue);

        return currentValue;
    }

    onClick(event, value){
        let sel = this.props.selection;
        
        if(sel === null){ return; }
        
        let prop = this.props.cssProp;
        
        if(this.getCurrentValue() === this.props.defaultValue){
            let newNode = document.createElement("span");
            newNode.appendChild(sel.range.extractContents());
            newNode.style[prop] = value;
            sel.range.insertNode(newNode);
            
        }
        else{
            sel.node.outerHTML = sel.node.innerHTML;
        }

        if(this.props.onClick){
            this.props.onClick(event, true);
        }
    }
}

class BtnSetCssProp extends Component{
    static defaultProps = {
        selection: null,
        icon: null,
        cssProp: "",
        defaultValue: "",
        value: "",
        onClick: null,
        title: ""
    };

    constructor(props){
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    render(){
        let variant = (this.getCurrentValue() === this.props.value ? VisualWordProcessor.Layout.btnToggled : VisualWordProcessor.Layout.btnNormal );

        let main = 
            <Button variant={variant} title={this.props.title} onClick={this.onClick}>
                <FontAwesomeIcon icon={this.props.icon}/>{" "}
            </Button>;

        return main;
            
    }
  
    getCurrentValue(){
        let sel = this.props.selection;
        if(sel === null){ 
            return this.props.defaultValue; 
        }

        let currentValue = sel.node.style[this.props.cssProp] || "";

        currentValue = (currentValue.length === 0 ? this.props.defaultValue : currentValue);

        return currentValue;
    }

    onClick(event){
        let sel = this.props.selection;
        
        if(sel === null){ return; }
        
        let prop = this.props.cssProp;
        
        if(this.getCurrentValue() === this.props.defaultValue){
            let newNode = document.createElement("span");
            newNode.appendChild(sel.range.extractContents());
            newNode.style[prop] = this.props.value;
            sel.range.insertNode(newNode);
            
        }
        else{
            sel.node.outerHTML = sel.node.innerHTML;
        }

        if(this.props.onClick){
            this.props.onClick(event, true);
        }
    }
}

class BtnColorPicker extends Component{
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
            <Button variant={VisualWordProcessor.Layout.btnNormal} title={this.props.title}>
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
        return <Button variant={VisualWordProcessor.Layout.btnNormal} onClick={this.onClick} title={this.props.title}><FontAwesomeIcon icon={this.props.icon}/></Button>;
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
        let variant = VisualWordProcessor.Layout.btnNormal;

        if((sel !== null) && (sel.node !== null)){
            variant = (sel.node.style.textAlign === this.props.cssProp ? VisualWordProcessor.Layout.btnToggled : VisualWordProcessor.Layout.btnNormal );
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