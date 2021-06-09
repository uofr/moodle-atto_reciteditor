import React, { Component } from 'react';
import { VisualWordProcessor } from './VisualWordProcessor';
import { LayoutBuilder } from './layout-builder/LayoutBuilder';

export class RecitRichEditor extends Component{
    static defaultProps = {
        name: "",
        content: "",
        onSaveAndClose: null
    };

    constructor(props){
        super(props);

        this.onSelectBuilder = this.onSelectBuilder.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {builder: 'layout'};

        // the content is not in the state because we don't want to refresh the component every time the user types something. This moves the caret to the beginning of the content.
        this.content = props.content; 
    }

	render(){
		let main = 
                this.state.builder === "word" ? 
                    <VisualWordProcessor content={this.content} onSelectBuilder={this.onSelectBuilder} onChange={this.onChange}/> 
                    : 
                    <LayoutBuilder content={this.content} onSelectBuilder={this.onSelectBuilder} onChange={this.onChange} onSaveAndClose={this.props.onSaveAndClose}/>
		return (main);
    }
    
    onChange(content, forceUpdate){
        this.content = content;

        if(forceUpdate){
            this.forceUpdate();
        }
    }

    onSelectBuilder(option){
        this.setState({builder: option});
    }
}
