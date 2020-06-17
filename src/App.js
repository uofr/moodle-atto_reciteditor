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

        this.state = {editor: 'wp'};
    }

	render(){
		let main = 
			<div className="MainView">
				<AppNarBar/>
                {this.state.editor === "wp" ? 
                    <VisualWordProcessor input={"<div></div>"} onVisualBuilder={this.onVisualBuilder}/> 
                    : 
                    <VisualHTMLBuilder input={"<div></div>"}/>
                }
				
            </div>;
		return (main);
    }
    
    onVisualBuilder(){
        this.setState({editor: "vb"});
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
