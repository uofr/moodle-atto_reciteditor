import React, { Component } from 'react';
import {Controlled as CodeMirror2} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
var beautifyingHTML = require("pretty");
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

export class SourceCodeEditor extends Component{
    static defaultProps = {
        value: "",
        onChange: null,
        queryStr: "",
        style: null
    };

    constructor(props){
        super(props);

        this.onBeforeChange = this.onBeforeChange.bind(this);
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
        if((prevProps.queryStr !== this.props.queryStr) && (this.props.queryStr.length > 0)){
            let pos = this.state.data.search(`data-tag-id="${this.props.queryStr}"`);
            let line = (this.state.data.substr(0, pos).match(/\n/g) || []).length;
            this.codeMirror.current.editor.focus();
            this.codeMirror.current.editor.setCursor(line);
        }
    }

    render(){
        let main = 
            <div style={this.props.style}>
                <CodeMirror2 ref={this.codeMirror} value={this.state.data}
                        options={{mode: 'text/html', tabSize: 4, theme: 'material', lineNumbers: true, electricChars: true, autofocus: true, lineWrapping: true}} 
                        onBeforeChange={this.onBeforeChange}/>
            </div>;

        return main;
    }

    onBeforeChange(editor, editorData, value){
        this.setState({data: value});
        if(this.props.onChange){
            this.props.onChange(value);
        }
    }

    /*beautify(str){
        let content = new DOMParser().parseFromString(str, "text/html");
        content = content.body;
        
        let result = [];
        let that = this;
        let recFunc = function(node, indent){
            indent = indent || "";

            if(node.children.length > 0){
                result.push(indent + that.openTagAsString(node));

                for(let child of node.children){
                    if(child.children.length > 0){          
                        recFunc(child, "  ");
                    }
                    else{
                        result.push("  "+that.openTagAsString(child, true));
                    }
                }

                result.push(indent + that.endTagAsString(node));
            }
            else{
                result.push(that.openTagAsString(node, true));
            }
        }
        recFunc(content);

        result.shift(); // remove <body>
        result.pop();   // remove </body>

        return result.join("\n");
    }

    openTagAsString(node, close){
        let result = `<${node.tagName.toLowerCase()} `;

        let tmp = [];
        for(let item of node.attributes){
            tmp.push(`${item.name}="${item.value}"`);
        }
        result += tmp.join(" ");

        if(close){
            if(['img'].includes(node.tagName.toLowerCase())){
                result += "/>";
            }
            else{
                result += ">" + this.endTagAsString(node);
            }
        }
        else{
            result += ">";
        }

        return result;
    }

    endTagAsString(node){
        return `</${node.tagName.toLowerCase()}>`;
    }*/

   /* condense(str){
        // Normalize and condense all newlines
        return str
        // Remove empty whitespace the top of a file.
        .replace(/^\s+/g, '')
        // Remove extra whitespace from eof
        .replace(/\s+$/g, '\n')
        // Add a space above each comment
        .replace(/(\s*<!--)/g, '\n$1')
        // Bring closing comments up to the same line as closing tag.
        .replace(/>(\s*)(?=<!--\s*\/)/g, '> ');
    }*/

    /*beautify(str){
        if(str.length === 0){ return str;}

        str = this.condense(str);
        //let chunks = str.match(/<.+?>/g);
        let chunks = str.match(/<.+?>/g);
        
        let result = "";
        let indent = [];
        console.log(chunks);
    
        for(let chunk of chunks){
            //console.log(chunk)
            if(chunk.substr(0,2) === "</"){
                indent.pop(" ");
                indent.pop(" ");
                indent.pop(" ");
                indent.pop(" ");
                chunk = indent.join("") + chunk + "\n";
            }
            else{
                chunk = indent.join("") + chunk + "\n";
                indent.push(" ");
                indent.push(" ");
            }

            result += chunk;
        }
        return result;
    }*/
}