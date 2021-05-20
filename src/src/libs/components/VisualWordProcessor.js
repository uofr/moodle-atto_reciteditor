
import React, { Component  } from 'react';
import {Controlled  as CodeMirror} from 'react-codemirror2';
import MathJax from 'react-mathjax';
import {ButtonsBar} from './ButtonsBar';
import {JsNx} from '../utils/Utils';

import * as iink from 'iink-js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
var beautifyingHTML = require("pretty");

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

export class VisualWordProcessor extends Component
{
    static defaultProps = {
        content: "",
        onSelectBuilder: null,
        onChange: null
    };

    static Assets = {
        highlighter: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC41ZYUyZQAAAYRJREFUOE+dkz1Lw1AUhpvvpCGKcQhIEOnk4KyD6FInJ4WuDoIudRbFD6qzu7iI9mc4O7sodlcEQbFgBXGw1ucmQWtrPpoXHs7Jzb3vPffcpJBDMpQMwyiFjzmlquq8JEnX0FAUpRwNDybLsqYxuCf9gg75ja7rk8HLjFLZfYmFL+Sdbhg7JVqQLk3TVgmP8McEXmVZXieqEK9arSbTk03SJvSaiGpOiEVIlMHEA+I79Jq0qeTS8zybPFFFJu4S36DPhA0uaPwYebwcxxmlsWek/1UijtOgZ1PkEsSL61wmtKDPBNpsskhMNqGxs7ANWzz2XnWTStaI6eKzn6D0KzinRxsMPYEwafFcJWqQrsjolvSTWOcYh+QfxDox9Zp/xK7iwxNNfsboTlTFMauu6w4FEzLIpJoyC/fZ/ZjFczBDT1bEu3BKulQMdqjgwTRNsdAJhwMl3063fN+3bNte4NorGI0zJI6Rld+fFROPivao6GhQaEMlsgmkwDCM5CD7TWZTofANbolfjJl6AqYAAAAASUVORK5CYII=",
        brand: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAAB0CAMAAABnsTYoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAABpvwJqvyp9vwRrwAZswAduwAhtwQhuwQtvwgtwwQ5wwQ1wwg5xww9ywxBywxJ0wxN0xBd1whR1xBZ2xBl2wRh3xRp4xR95wR56xR56xh97xyJ8xyV8wiR9xyV+yCZ/yTKBvz+HvSeAySiAySyCyi6Dyy+Eyi+EyzCFyzKGyzaIzDeJzTiJzTiKzTuMzj2MzkGGu2WTr3KVpkCOz0KQz0OR0ESQ0EaS0EeS0UmT0UqU0UyV0kyW0U2W0k6X01KZ01Oa01Oa1FWa1Fid1Vqd1lqe1Vue1l6g1l+h12Ki12Sj2Gak2Gqn2Wqn2muo2Wuo2m2o2m6q2nGq23Ks23St3Hau3Hev3Xiv3Xqw3Xux3n6y3n+03rugbPGgL/qiKvmiK/qjLPqjLfqjLvqkL/qnNfqoOPmqP8efXtqfSMOfYcKfZNegS9GgVdWgUNupX9eoYeGgQvqrQPqsQvquR/qvSPqvSfqwS/qzUfqzUvuzVPu1V/u2V/u2WPu4Xfu5X/u6YPu6Yvu+a/u+bPvEePvEefvGfPzEePzEeZacjJychZidjKGvroC034O24Ia34Ie44Ie44Ym64Yy74o284o+945C945C+45TA5JfB5ZfC5JjC5JrC5ZrE5ZvE5pzF5p/G56DH5qDG56HI56PJ6KTJ6KXK6KjM6arN6qzO6q/Q6q/Q67DQ6rLR67PS7LTT7LbU7LjV7brW7bzX7r3Y7r7Z77/a7/vHgPzIgvzJhPzJhfzKhfzKhvzKh/zLiPzLivzOj/zPk/zQk/zQlPzRlf3ZqP3brv3guf3iu/3hvP3ivMDa78Pb8MPc8Mbd8Mfe8Mje8cvg8szg8s7i89Ll89Lk9NTm89bm9Nno9dvq9d3q9t7s9v7kwP3nyf3oy/7r0v7s0/7t1v7t1/7w3eHt9+Pu+OTv+OXw+Obw+ejx+eny+erz+uz0+u71+/7y4/705fD2+/L3/PP4/PT5/Pb6/f/58v/68//89/j7/fr8/v/8+f/9/P/+/P3+/v7+/wAAAFY5PcMAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjVlhTJlAAAGpklEQVRoQ+2Zd3gURRiHb2MiERIDEj0NEVBaIBpOBSOgB4ooiVgIRTHqKdh7B+wtiiWKiBIQLKBobCiCimADGwlqJCgQxI5SFWJUojLnlN9e9mZ3Lsu5k3sen7z8wXxl92Vv2+zgCzfOOzdfOSbkLY1q3zwXnZ7SiPbts9DnMbG1V6HLc2JqR6PJe2Jp0aKDGNoz0aIDtfYcdGhBqb0VDXpQalHXhEo7HnVNqLQo60KhXYiyLhTasSjrQqFFVRvNWgqq2mjWUlDVhqQd1rdbFmWfveNl3/0PvvcC7DsGVm3fJMMb9rv7DOxeRYO2G7bxhD3viT1JMLVD0O8ZB10BgyPQdkezh+xxPhROCG02Wj2l1YVwOMC1XdCoJCUA2iPhilaXQmKHaQeiTc1AIqjrjIQ7dlFe0EyLphi8CO1JiN1yCCw2qNaPHjVt6oV1DmLXJF8MjQzVoiUGJwrrxkzErsgvLSsrvQ8aGV/YxemqEtrDEbqiVGzzATwSPhcH20HsYRpCd2wUG/3p/KXqRiv+4StSEboijW9Dcf5W9fVDXwxeYZuv27lHip87KZiDvr54CecmEfpc7O0xuvX8dghckiqkhJwnPGGES0Toa4G+GKQWDs3F0D0/Cs3mS4RH1qLLc4qE5v6LhKeptEbO0AceHJZnnC48jWkzggMC0bOMzB6B/ED3tojstM4NDgj26aK40BXaNRzzYZv7xG+09jQiw+hR+kmt6Ccbnitw2POhM2pQ37FySh6SVhRaEW1lz72Wx1WLaJjYwjjicxGbbBmZggo4ZiUq4NMACkZ6MbgsFLq6ZMIdv6KjouSuCRNKSqAls42uZdswJh35lhnPI7Sw3Pre8M9H1sIknKB2iMm4UKgEQwumlizH35Q1fEP/KoRR1DR4O65DLoqnRNGt1kIZ2y5N+v1MqszrbXfHfxYhp/JqHNog2+5JBDbME1+GWKaev9J2XrudXbC5COjVNqOgd4/ehTPrEG8S13O7HYhtPMvLCNxr57LNXkJAprVkIcX/GTIFPJyIiGwv65W1W3r74HR26zHq2S2+M9rK4d0zjL3Ydew3j2USd3AycQeLqY15u26LPK7br0dqMA1ca7c/aplnYBpDNlufELNErpZdVJ3EmJDhosY4EqmpdGzV3rL044rfEf6wtGJpRUVFRDsn6g1YjuzjiDmDkGTT6gKM69JFjbNV5ObRoVXL+B7hYhFGtOyXaQCvLRL1aZSD5FF0PAXj+aIkqBS5L+hQpY1+OErayEu6FxKcDCSH0vEcjCeKkqDwYU4xHcal7YgkyUGCsyuSbLfmw0T1pShrv0MYUxtAkowcbAVJdnVvxpg/WhyI62jzkXTmIdqBIYm8ciTi0gaRdIb+yOkYuta6+pH7IOlMPFpXN1Dk3Doy4j9o3V1SjhTp0nZFkgRzHGij60fORDL6vrWCOslHLBPX0SYhSQ5AwsYmNByNWCYurbEB2f4iBPiR2SzTfErRy6uBEdXV1XT2u5IO49MuQ9acwXBSkDyZjs1pwExREswUuZ/pUKV9T4QKrTlRmoWYY348nkDH5htotSgJ5opcrKN9X4QK7RBk1yPm9EOSvfjM5zOxrN8l4YRX0bFK+5EIFdpsZIn1q3s6cuzyxsICIeWixjAfqS/Qsaz9BuHft/NQoTW+RHoVvUlBFywT1SWzKDJLZmeak2lOrybTQNZ+hZCQX75eu3atSjsKaVIzkFvosfyEzMs8xEoM5bVjO7f2d+o/yXwX8ptK1i5BCFTa9MgHEdk2b3bZ1HJTSsgg3uDHsdupz6BlWXsjQqDSGqchb6MGRz8ZsY1nWFXWhr5FLFBqU/DRaeMwNLQ0T7/EFr64YtPe8A8SHKXWyHL8oLM8lrJXIxXF1p68aNOGFiHBUWuNLKz5WakrRJHR1pw+WliG6bZdG3rjL6QoMbRG8vHSx+aOcmkVKyidiarIjM5BG7r2wz+QDPuKgPOKZ17xq+aXTW3lKIels56PrMDnUm1lsWUVPg27LbocTs6Y6267c9Fb9I+LBaLU7JwDA13Vi7qpnQPB/DzVqjSWTCT0rUuBZm1obGK0CxKjDSdEe01itOGEaMclRDs6nBAt+8/MptcuSIh2IbM2tfZsLm1q7Y2wNql2PJyUptKOvv5dGDnatfBINGs9BR6JZq2XpMEjoVvbBx4J3VpoZP6f2iA0Mpq1sNjQqx0Miw2tWj8kdnRqk+FwQKM2CQon9GlTYXBEm7YDBM5o0rYoxv4VaNG2HYm9K/Fam5LV6xTsWk04/C+LOCax9YczEgAAAABJRU5ErkJggg=="
    }

    constructor(props){
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onAfterSelection = this.onAfterSelection.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onTextAreaDidMount = this.onTextAreaDidMount.bind(this);
        this.onChangeTmpContent = this.onChangeTmpContent.bind(this);
        this.onSetFlag = this.onSetFlag.bind(this);

        this.updateHistory = this.updateHistory.bind(this);
        this.undoHistory = this.undoHistory.bind(this);
        this.redoHistory = this.redoHistory.bind(this);
        this.onCodeSource = this.onCodeSource.bind(this);
        this.onScreenCapture = this.onScreenCapture.bind(this);

        this.state = {
            selection: null,
            history: {undo: [], redo:[]}, 
            flags: {codeSource: false, highlighter: false, mathFormula: false, myScript: false},
            tmpContent: "",
        };

        this.editorRef = null;
    }
   
    render(){        
        //const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`;
 
        let main = <EditorFrame flags={this.state.flags} 
                        buttonsBar={<ButtonsBar selection={this.state.selection} history={this.state.history} onUndo={this.undoHistory} onRedo={this.redoHistory}
                                flags={this.state.flags} onHighlighter={() => this.onSetFlag('highlighter')} onCodeSource={this.onCodeSource}
                                onMathFormula={() => this.onSetFlag('mathFormula')} onScreenCapture={this.onScreenCapture}
                                    onShowHtmlEditor={() => this.props.onSelectBuilder('layout')}/>} 
                        workArea={this.getWorkArea()}
                        footerBar={<StatusBar selection={this.state.selection} />}>
                        {this.state.flags.mathFormula && (this.state.selection !== null) &&
                            <MathJax.Provider>
                                <div>
                                    <MathJax.Node formula={this.state.selection.selectedText} />
                                </div>
                            </MathJax.Provider>
                        }                      
                        
                    </EditorFrame>;            
        return main;
    }

    onScreenCapture(screenCapture){
        let img = document.createElement("img");
        img.src = screenCapture;
        this.editorRef.current.appendChild(img);
    }

    onTextAreaDidMount(editorRef){
        this.editorRef = editorRef;
        document.body.onkeydown = this.onKeyDown.bind(this);
        document.body.onkeyup = this.onKeyUp.bind(this);
    }

    componentWillUnmount(){
        document.body.onkeydown = null;
        document.body.onkeyup = null;
    }

    onKeyUp(e){
        if (e.keyCode == 17 || e.keyCode == 91) {
          this.ctrlDown = false;
        }
    }

    onKeyDown(e){     
        if (e.keyCode == 17 || e.keyCode == 91) { //17 = ctrl
            this.ctrlDown = true;
        }
        if ((this.ctrlDown && e.key == 'z')) {//undo
            e.preventDefault();
            this.undoHistory();
            return false;
        }
        if ((this.ctrlDown && e.key == 'y')) {//redo
            e.preventDefault();
            this.redoHistory();
            return false;
        }
    }

    onSelect(selection, clearSelection){
        clearSelection = (typeof clearSelection === "undefined" ? false : clearSelection);
     
        if(clearSelection){
           this.clearSelection();
        }

        this.setState({selection: selection}, this.onAfterSelection);
    }

    onAfterSelection(){
        this.onUserHighlight();
    }

    clearSelection(){
        if (window.getSelection().empty) {  // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
            window.getSelection().removeAllRanges();
        }
    }

    onChange(content, forceUpdate){
        let contentHasChanged = (this.state.tmpContent !== content);

        if((this.props.onChange) && ((contentHasChanged) || (forceUpdate))){
            
            // remove empty tags
            if(this.editorRef.current){
                let elements = this.editorRef.current.querySelectorAll('div, p, span, strong');
                for (let el of elements) {
                    if((el.innerHTML === '&nbsp;' || el.innerHTML === '')){
                        if((el instanceof HTMLDivElement) && (!el.hasAttribute('style') && (el.attributes.length === 0))){
                            el.parentNode.removeChild(el);
                        }
                        else{
                            el.parentNode.removeChild(el);
                        }
                    }
                }
            }

            this.updateHistory(content);
            this.props.onChange(content, forceUpdate);
        }
    }
    
    updateHistory(content){
        let history = this.state.history;
        
        if(history.undo.length === 0){
            history.undo.push("");
        }
        else if(history.undo.length > 15){
            history.undo.unshift();
        }
        else if(history.undo[history.undo.length - 1] !== content){
            history.undo.push(this.state.tmpContent);
        }

        this.setState({history: history, tmpContent: content});
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
        this.setState({history: history, tmpContent: this.editorRef.current.innerHTML});
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
        this.setState({history: history, tmpContent: this.editorRef.current.innerHTML});
    }

    onSetFlag(flag){
        let tmp = this.state.flags;
        tmp[flag] = !this.state.flags[flag];
        this.setState({flags: tmp});
    }

    onUserHighlight(){
        if(this.state.flags.highlighter){
            let sel = this.state.selection;
            let backgroundColor = 'rgb(255, 193, 7)';

            if(sel === null){return;}
            if(sel.sel.isCollapsed){ return; }

            if(sel.node.style.backgroundColor === backgroundColor){
                sel.node.insertAdjacentHTML("beforebegin", sel.node.innerHTML);
                sel.node.remove();
            }
            else if(sel.isNodeRoot){
                let newNode = document.createElement("span");
                newNode.appendChild(sel.range.extractContents());
                newNode.style.backgroundColor = backgroundColor;
                sel.range.insertNode(newNode);
            }
            else if(sel.subSelection){
                let newNode = document.createElement("span");
                newNode.appendChild(sel.range.extractContents());
                newNode.style.backgroundColor = backgroundColor;
                sel.range.insertNode(newNode);
            }
            else{
                sel.node.style.backgroundColor = backgroundColor;
            }
        }
    }

    onCodeSource(){
        if(this.state.flags.codeSource){
           // let parser = new DOMParser();
            //let document = parser.parseFromString(this.state.tmpContent, 'text/html');
            let tmp = this.state.flags;
            tmp.codeSource = !this.state.flags.codeSource;
            this.setState({flags: tmp}, () => this.onChange(this.state.tmpContent, true));
        }       
        else{            
            let tmpContent = this.editorRef.current.innerHTML;
            tmpContent = beautifyingHTML(tmpContent, {ocd: true});
            let tmp = this.state.flags;
            tmp.codeSource = !this.state.flags.codeSource;
            this.setState({flags: tmp, tmpContent: tmpContent});
        }
    }

    getWorkArea(){
        let result = null;

        if(this.state.flags.codeSource){
            result = <CodeMirror  value={this.state.tmpContent}  options={{mode: 'xml', tabSize: 4, theme: 'material', lineNumbers: true, electricChars: true}} 
                            onBeforeChange={(editor, data, value) => this.onChangeTmpContent(value)}/>;
        }
        else{
            result = <TextArea onComponentDidMount={this.onTextAreaDidMount} value={this.props.content} onChange={this.onChange} onSelect={this.onSelect} />;
        }

        return result;
    }

    onChangeTmpContent(value){
        this.setState({tmpContent: value});
    }
}

class EditorFrame extends Component{
    static defaultProps = {
        buttonsBar: null,
        workArea: null,
        footerBar: null,
        flags: null,
        children: null
    };

    render(){
        let style = {backgroundColor: "#f7f7f7", border: "1px solid #dfdfdf", borderRadius: "4px"};

        let main =
            <div style={{border: style.border, cursor: (this.props.flags.highlighter ? `url(${VisualWordProcessor.Assets.highlighter}),  auto` : 'inherit')}}>
                {this.props.buttonsBar}
                {this.props.workArea}
                {this.props.footerBar}
                {this.props.children}
            </div>
        return main;
    }
}

class TextArea extends Component{
    static defaultProps = {
        value: "",
        onChange: null,
        onSelect: null,
        onComponentDidMount: null
    };

    constructor(props){
        super(props);

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onClick = this.onClick.bind(this);
        this.setCurrentSelection = this.setCurrentSelection.bind(this);

        this.editorRef = React.createRef();

        this.state = {selection: null};
    }

    componentDidMount(){
        //window.document.execCommand("defaultParagraphSeparator", false, "br");
        this.editorRef.current.innerHTML = this.props.value;
        this.props.onComponentDidMount(this.editorRef);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value){
            this.editorRef.current.innerHTML = this.props.value;
        }
    }

    render(){
        let main = 
            <div ref={this.editorRef} contentEditable={true} style={{backgroundColor: "#FFF", minHeight: 300, maxHeight: "90vh", padding: "1rem", resize: 'vertical', overflow: 'auto'}}
                onKeyUp={this.onKeyUp} onClick={this.onClick}  onMouseLeave={this.onMouseMove} data-recit-rich-editor='content'>
            </div>;

        return main;
    }

    onMouseMove(event){ 
        switch(event.type){
           // case 'mousedown': 
            //case 'mouseup':
            //case 'mouseout':
            case 'mouseleave':
                break;
        }

        this.setCurrentSelection(event);
    }

    onKeyUp(event){
        if((this.props.onChange) && (this.props.value !== this.editorRef.current.innerHTML)){
            this.props.onChange(this.editorRef.current.innerHTML);
        }
        
        
        //let evtobj = (window.event ? window.event : event);
        //if (evtobj.keyCode == 90 && evtobj.ctrlKey) alert("Ctrl+z");

        this.setCurrentSelection(event);
    }   
    
    onClick(event){
        if((this.props.onChange) && (this.props.value !== this.editorRef.current.innerHTML)){
            this.props.onChange(this.editorRef.current.innerHTML);
        }

        this.setCurrentSelection(event);
    }

    setCurrentSelection(event){
        let result = null;
        let sel = window.getSelection ? window.getSelection() : document.selection;              

        if(sel !== null){
            result = {};
            result.sel = sel;
            result.isSelection = (sel.rangeCount > 0) && (sel.toString().length > 0);
        
            result.selectionDirection = '';
            if(result.sel.anchorOffset > result.sel.focusOffset){
                result.selectionDirection = 'ltr';
            }
            else if(result.sel.anchorOffset < result.sel.focusOffset){
                result.selectionDirection = 'rtl';
            }
             
            let mainNode = result.sel.baseNode;
            if (!mainNode) return;
            result.node = (mainNode instanceof Element ? mainNode :  mainNode.parentElement);
            result.subSelection = (result.sel.anchorOffset > 0 && result.sel.focusOffset > 0);

            if (!result.isSelection){//If it's not a selection, set the range to be the whole node
                let range = document.createRange();
                let text = result.node;
                if (text){
                    range.selectNodeContents(text);
                    result.range = range;
                }
            }else{
                result.range = result.sel.getRangeAt(0);
            }
    
            result.isNodeRoot = (result.node === this.editorRef.current);
            result.parentNode = (result.node === this.editorRef.current ? result.node : result.node.parentElement);
            result.isParentNodeRoot = (result.node === this.editorRef.current);
            result.editorRef = this.editorRef;
            result.selectedText = result.sel.toString();
            result.selectedContent = result.range.cloneContents();

            if (result.selectedContent.children[0]){ // Est-ce que la selection contient des tag html?
                if (result.selectedContent.children[0].innerText == result.selectedText){
                    result.node = result.selectedContent.children[0];
                    result.isNodeRoot = false;
                    result.subSelection = false;
                }
            }
            result.refreshSelection = this.setCurrentSelection;
        }
        
        if(!JsNx.compare(result, this.state.selection)){
            this.setState({selection: result}, () => this.props.onSelect(result));
        }
    }
}

class StatusBar extends Component{
    static defaultProps = {
        selection: null,
    }

    constructor(props){
        super(props);

        this.getStatusDesc = this.getStatusDesc.bind(this);

        this.state = {statusBar: ""};
    }

    render(){
        let style = {backgroundColor: "#f7f7f7", border: "1px solid #dfdfdf", borderRadius: "4px"};
        let selectionDesc = this.props.selection !== null ? `${this.props.selection.selectedText} (${this.props.selection.sel.type})` : "";
        selectionDesc = (selectionDesc.length > 100 ? selectionDesc.substr(0, 100) + "..." : selectionDesc);

        let main = 
            <div style={{minHeight: 30, borderTop: style.border, backgroundColor: style.backgroundColor, padding: ".5rem", display: "flex"}}>
                <div>
                    <b>HTML: </b>{this.getStatusDesc()}
                    {" | "}
                    <b>Sélection: </b>{selectionDesc}
                </div>
                <div style={{marginLeft: "auto"}}>
                    <img src={VisualWordProcessor.Assets.brand} width="20" height="20"></img>
                </div>
            </div>;

        return main;
    }

    getStatusDesc(){
        let sel = this.props.selection;
        if(sel === null){ return ""; }

        if(sel.isNodeRoot){ return ""; }
                
        let node = sel.node;

        if(!sel.editorRef.current.contains(node)){ return "";}
        
        let result = [node.nodeName.toLowerCase()];
        
        while(node.getAttribute('data-recit-rich-editor') !== 'content'){
            
            node = node.parentElement;

            if(node === null){ break;}
            if(node === null){ break;}

            result.push(node.nodeName.toLowerCase());
        }

        return result.reverse().join(" / ");
    }
}

class MyScript extends Component{
    static defaultProps = {
        value: "",
        onExported: null,
    }

    constructor(props){
        super(props);

        this.editorRef = React.createRef();;
    }
    
    componentDidMount(){
        let editor = this.editorRef.current;

        editor.addEventListener('exported', (event) => this.props.onExported(event.detail.exports['text/plain']));

        editor = iink.register(this.editorRef.current, {
            /*triggers: {
                exportContent: 'DEMAND'
            },*/
            recognitionParams: {
                type: 'TEXT',
                //protocol: 'WEBSOCKET',
                //apiVersion: 'V4',
                server: {
                    scheme: 'https',
                    host: 'webdemoapi.myscript.com',
                    applicationKey: '1463c06b-251c-47b8-ad0b-ba05b9a3bd01',
                    hmacKey: '60ca101a-5e6d-4159-abc5-2efcbecce059',
                },
            },
        });

        editor.import_(this.props.value, "text/plain");
    }

    render(){
        const editorStyle = {
            'minWidth': '100px',
            'minHeight': '100px',
            'width': '100vw',
            'height': 'calc(100vh - 190px)',
            'touchAction': 'none',
          };

        return <div style={editorStyle} ref={this.editorRef} touch-action="none"></div>;
    }
}