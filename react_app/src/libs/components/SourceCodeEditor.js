import React, { Component } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { lintGutter } from '@codemirror/lint';
import { html, htmlCompletion, autoCloseTags } from '@codemirror/lang-html';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
var beautifyingHTML = require("pretty");

export class SourceCodeEditor extends Component{
    static defaultProps = {
        value: "",
        onChange: null,
        queryStr: "",
        style: null
    };

    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
        this.setCursor = this.setCursor.bind(this);

        this.state = {data: ""};

        this.codeMirror = React.createRef();
    }

    componentDidUpdate(prevProps, prevState){
        if((prevProps.value !== this.props.value) && (this.props.value.length > 0)){
            let data = beautifyingHTML(this.props.value, {ocd: true});
            this.setState({data: data}, () => this.setCursor(prevProps));
        }
        else{
            this.setCursor(prevProps);
        }
    }

    setCursor(prevProps){
        if((prevProps.queryStr !== this.props.queryStr) && (this.props.queryStr.length > 0) && this.codeMirror){
            let pos = this.state.data.search(`data-tag-id="${this.props.queryStr}"`);
            let line = (this.state.data.substr(0, pos).match(/\n/g) || []).length;
            
            let el = this.codeMirror.current.editor.querySelector('.cm-content');
            if (el.childNodes[line]){
                setTimeout(() => {
                    let range = document.createRange()
                    let sel = window.getSelection()
                    
                    range.selectNodeContents(el.childNodes[line])
                    range.collapse(false)
                    
                    sel.removeAllRanges()
                    sel.addRange(range)
                    this.codeMirror.current.editor.focus()
                }, 500);

            }
            //this.codeMirror.current.view.dispatch({selection: {anchor: line}});
        }
    }

    render(){
        let main = 
            <div style={this.props.style} className="react-codemirror">
                <CodeMirror ref={this.codeMirror} value={this.state.data} maxHeight="80vh" theme="dark" width="100%" extensions={[html(), EditorView.lineWrapping, lintGutter(), htmlCompletion, autoCloseTags]} onChange={this.onChange}/>
            </div>;

        return main;
    }

    onChange(value){
        this.setState({data: value});
        if(this.props.onChange){
            this.props.onChange(value);
        }
    }
}