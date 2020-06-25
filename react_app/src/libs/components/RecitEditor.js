import React, { Component } from 'react';
import { VisualWordProcessor } from './VisualWordProcessor';
import { VisualHTMLBuilder } from './VisualHTMLBuilder';

export class RecitEditor extends Component{
    static defaultProps = {
        Moodle: {},
    };

    constructor(props){
        super(props);

        this.onVisualBuilder = this.onVisualBuilder.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {editor: 'wp', content: ""};
    }

	render(){
		let main = 
			<div>
                {this.state.editor === "wp" ? 
                    <VisualWordProcessor content={this.state.content} onVisualBuilder={this.onVisualBuilder} onChange={this.onChange}/> 
                    : 
                    <VisualHTMLBuilder content={this.state.content}/>
                }
				
            </div>;
		return (main);
    }
    
    onChange(content){
        this.setState({content: content});
    }

    onVisualBuilder(){
        //this.setState({editor: "vb"});
        let Moodle = this.props.Moodle;

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
            return that.state.content;
        };
        
        popup.onSave = function(frameDocument){
            let html = frameDocument.body.outerHTML;
            that.setState({content: html});
            popup.close();
        };
    }
}
