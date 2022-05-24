// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto HTML editor
 *
 * @package    atto_reciteditor
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */

import React, { Component } from 'react';
import { VisualWordProcessor } from './VisualWordProcessor';
import { LayoutBuilder } from './layout-builder/LayoutBuilder';

export class RecitRichEditor extends Component{
    static defaultProps = {
        name: "",
        content: "",
        builder: "layout",
        onSaveAndClose: null,
        options: {wordProcessor: false, layoutBuilder: true}
    };

    constructor(props){
        super(props);

        this.onSelectBuilder = this.onSelectBuilder.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {builder: this.props.builder};

        // the content is not in the state because we don't want to refresh the component every time the user types something. This moves the caret to the beginning of the content.
        this.content = props.content; 
    }

	render(){
		let main = 
                this.state.builder === "word" ? 
                    <VisualWordProcessor content={this.content} onSelectBuilder={this.onSelectBuilder} onChange={this.onChange} options={this.props.options}/> 
                    : 
                    <LayoutBuilder content={this.content} onSelectBuilder={this.onSelectBuilder} onChange={this.onChange} onSaveAndClose={this.props.onSaveAndClose} options={this.props.options}/>
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
