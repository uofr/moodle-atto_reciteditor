import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.scss';
import { Navbar, Nav} from 'react-bootstrap';
import { VisualWordProcessor } from './views/VisualWordProcessor';
import { VisualHTMLBuilder } from './views/VisualHTMLBuilder';
import {Options} from "./Options";

export default class App extends Component{
	render(){
		let main = <MainView/>;

		return (main);
	}
}

class MainView extends Component
{
    constructor(props){
        super(props);

        this.onVisualBuilder = this.onVisualBuilder.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {editor: 'wp', content: ""};
    }

	render(){
		let main = 
			<div className="MainView">
				<AppNarBar/>
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
        let url = M.cfg.wwwroot;
        url += "/lib/editor/atto/plugins/vvvebjs/editor/index.php";
        url += "?contextid="+M.cfg.contextid;
        url += "&theme="+M.cfg.theme;
        url += "&themerev="+M.cfg.themerev;

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

class AppNarBar extends Component
{
	render(){
		let main = 
			<Navbar bg="dark" variant="dark">
				<Navbar.Brand href="#home">
				<img	alt="Logo RECIT"
					src={Options.brandImage}
					width="30"
					height="30"
					className="d-inline-block align-top"
				/>
				{' SN FAD'}
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto"></Nav>
					<Nav.Item>
					</Nav.Item>
				</Navbar.Collapse>
			</Navbar>
		return (main);
	}
}
