import React, { Component } from 'react';
import { VisualWordProcessor } from './VisualWordProcessor';
import { VisualHTMLBuilder } from './VisualHTMLBuilder';

export class RecitRichEditor extends Component{
    static defaultProps = {
        name: "",
        content: "",
        onChange: null
    };

    constructor(props){
        super(props);

        this.onVisualBuilder = this.onVisualBuilder.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {editor: '1'};

        // the content is not in the state because we don't want to refresh the component every time the user types something. This moves the caret to the beginning of the content.
        this.content = props.content; 
    }

	render(){
		let main = 
                this.state.editor === "0" ? 
                    <VisualWordProcessor content={this.content} onVisualBuilder={this.onVisualBuilder} onChange={this.onChange}/> 
                    : 
                    <VisualHTMLBuilder content={this.content}/>
		return (main);
    }
    
    onChange(content, forceUpdate){
        this.content = content;

        if(this.props.onChange){
            this.props.onChange({target:{value: this.content, name: this.props.name}});
        }

        if(forceUpdate){
            this.forceUpdate();
        }
    }

    onVisualBuilder(){
        let Moodle = (M ? M : {}); // M = Moodle global variable

        let url = Moodle.cfg.wwwroot;
        url += "/lib/editor/atto/plugins/vvvebjs/editor/index.php";
        url += "?contextid="+Moodle.cfg.contextid;
        url += "&theme="+Moodle.cfg.theme;
        url += "&themerev="+Moodle.cfg.themerev;

        let popup = window.open(url,'VvvEbJs','scrollbars=1');

        if (popup.outerWidth < window.screen.availWidth || popup.outerHeight < window.screen.availHeight)
        {
          popup.moveTo(0,0);
          popup.resizeTo(window.screen.availWidth, window.screen.availHeight);
        }

        let that = this;
        popup.getEditorContent = function(){
            return that.content;
        };
        
        popup.onSave = function(frameDocument){
            let html = frameDocument.body.outerHTML;
            that.content = html;
            popup.close();
            that.forceUpdate();
        };
    }
}
