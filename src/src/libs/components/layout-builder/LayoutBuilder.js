import React, { Component } from 'react';
import { Nav, Card, Navbar, Collapse  } from 'react-bootstrap';
import {faMobileAlt, faTabletAlt, faLaptop, faDesktop, faFileWord, faEye, faCode} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {TreeView} from './TreeView';
import {Canvas, CanvasElement, FloatingMenu} from './Canvas';
import {ComponentProperties, VisualComponentList} from './ComponentsCollection';
import {Cookies} from '../../utils/Cookies';
import { JsNx } from '../../utils/Utils';
import RecitLogo from '../assets/recit.png';

import {Controlled  as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
var beautifyingHTML = require("pretty");
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

export class LayoutBuilder extends Component
{
    static defaultProps = {
        input: "",
        onSelectBuilder: null
    };

    constructor(props){
        super(props);

        this.onNavbarSelect = this.onNavbarSelect.bind(this);
        this.onSelectElement = this.onSelectElement.bind(this);
        this.onDeleteElement = this.onDeleteElement.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onDropElement = this.onDropElement.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        this.htmlCleaning = this.htmlCleaning.bind(this);
        this.onSaveCustomComponent = this.onSaveCustomComponent.bind(this);
        this.onDeleteCustomComponent = this.onDeleteCustomComponent.bind(this);
        this.onImportCustomComponent = this.onImportCustomComponent.bind(this);
        this.onAfterSaveCustomComponent = this.onAfterSaveCustomComponent.bind(this);
        this.onCreateCanvasElement = this.onCreateCanvasElement.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onSourceCode = this.onSourceCode.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);

        this.state = {device: 'xl', view: '', collapsed: ['0', '1', '2'], selectedElement: null, data: {customHtmlComponentList: [], content: ''}};

        this.canvas = React.createRef();
    }

    componentDidMount(){
        let window = this.canvas.current.contentWindow || this.canvas.current.contentDocument;
        let head = window.document.head;
        let body = window.document.body;

        let el = document.createElement("link");
		el.setAttribute("href", `canvas-content.css?v=${Math.floor(Math.random() * 100)}`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `bootstrap.min.c9ac70f5.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `fontello/css/fontello.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        body.parentElement.classList.add("canvas-content");

        // pure JS
        this.onCreateCanvasElement(body);

        // React JS
        //body.appendChild(doc.firstChild);
        
        try{
            let tmp = Cookies.get('appData', null);
            
            if(tmp !== null){
                tmp = JSON.parse(tmp);
                if (tmp){
                    let data = {customHtmlComponentList: tmp.customHtmlComponentList};
                    this.setState({data: data})
                }
            }
        }
        catch(err){
            alert("Error on getting Cookie appData. See console for more information.");
            console.log(err);
        }
    }

	render(){
		let main = 
			<div className="layout-builder">                
                <Navbar bg="dark" variant="dark" onSelect={this.onNavbarSelect} expand="sm">
                    <Navbar.Brand>
                        <img alt="RÉCIT" src={`.${RecitLogo}`} width="30" height="30" className="d-inline-block align-top" />{' '}
                        Éditeur RÉCIT
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link eventKey="wordbuilder"><FontAwesomeIcon icon={faFileWord} title="Word Builder"/></Nav.Link>
                            
                        </Nav>
                        <Nav className="mr-auto" activeKey={this.state.view}>
                            <Nav.Link eventKey="preview" ><FontAwesomeIcon icon={faEye} title="Preview"/></Nav.Link>
                            <Nav.Link eventKey="sourcecode"><FontAwesomeIcon icon={faCode} title="Code source"/></Nav.Link>
                        </Nav>
                        <Nav activeKey={this.state.device}>
                            <Nav.Link eventKey="xs"><FontAwesomeIcon icon={faMobileAlt} title="XS"/></Nav.Link>
                            <Nav.Link eventKey="sm"><FontAwesomeIcon icon={faTabletAlt} title="SM"/></Nav.Link>
                            <Nav.Link eventKey="md"><FontAwesomeIcon icon={faTabletAlt} title="MD" style={{transform: 'rotate(90deg)'}}/></Nav.Link>
                            <Nav.Link eventKey="lg"><FontAwesomeIcon icon={faLaptop} title="LG"/></Nav.Link>
                            <Nav.Link eventKey="xl"><FontAwesomeIcon icon={faDesktop} title="XL"/></Nav.Link>    
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                   
                <div className="main">
                    <div className="left-area">
                        <Card>
                            <Card.Header onClick={() => this.onCollapse('0')}>Composants</Card.Header>
                            <Collapse in={this.state.collapsed.includes('0')}>
                                <Card.Body style={{maxHeight: 350, overflow: "auto"}}>
                                    <VisualComponentList onDeleteCustomComponent={this.onDeleteCustomComponent}  onImportCustomComponent={this.onImportCustomComponent}
                                                customHtmlComponentList={this.state.data.customHtmlComponentList} onDragEnd={this.onDragEnd}/>
                                </Card.Body>
                            </Collapse>
                        </Card>

                        <Card>
                            <Card.Header onClick={() => this.onCollapse('1')}>Proprietés</Card.Header>
                            <Collapse in={this.state.collapsed.includes('1')}>
                                <Card.Body style={{maxHeight: 350, overflow: "auto"}}>
                                    <ComponentProperties element={this.state.selectedElement}/>
                                </Card.Body>
                            </Collapse>
                        </Card>

                        <Card>
                            <Card.Header  onClick={() => this.onCollapse('2')}>Arborescence</Card.Header>
                            <Collapse in={this.state.collapsed.includes('2')}>
                                <Card.Body style={{maxHeight: 350, overflow: "auto"}}>
                                    <TreeView canvas={this.canvas} onSelect={this.onSelectElement} selectedElement={this.state.selectedElement} />
                                </Card.Body>
                            </Collapse>
                        </Card>
                    </div>
                    
                    <div className="center-area" >
                        {this.state.view === 'sourcecode' &&
                            <CodeMirror  value={this.state.data.content}  options={{mode: 'xml', tabSize: 4, theme: 'material', lineNumbers: true, electricChars: true}} 
                                onBeforeChange={(editor, data, value) => this.onChangeContent(value)}/>
                        }

                        <Canvas style={{display: (this.state.view === 'sourcecode' ? 'none' : 'block')}}>
                            <iframe ref={this.canvas} className="canvas" style={this.getDeviceDimension()}></iframe>
                            <FloatingMenu canvas={this.canvas} selectedElement={this.state.selectedElement} onDeleteElement={this.onDeleteElement} onRefresh={this.onRefresh}
                                        onSaveCustomComponent={this.onSaveCustomComponent} onCreateCanvasElement={this.onCreateCanvasElement}/>
                        </Canvas>
                    </div>
                </div>
            </div>;

		return (main);
    }

    onCollapse(index){
        let data = [];
        if(this.state.collapsed.includes(index)){
            data = this.state.collapsed;
            data = data.filter(item => item !== index);
        }
        else{
            data = this.state.collapsed;
            data.push(index);
        }

        this.setState({collapsed: data});
    }

    onNavbarSelect(eventKey){
        if(eventKey === 'wordbuilder'){
            this.props.onSelectBuilder('word');
        }
        else if('preview' === eventKey){
            let value = (this.state.view === eventKey);
            this.setState({view: value ? '' : eventKey}, () => this.onPreview(value));
        }
        else if('sourcecode' === eventKey){
            this.onSourceCode((this.state.view === eventKey));
            
        }
        else{
            this.setState({device: eventKey});
        }
    }

    onPreview(value){
        let window = this.canvas.current.contentWindow || this.canvas.current.contentDocument;
        let body = window.document.body;

        if(value){
            body.parentElement.classList.add("canvas-content");
        }
        else{
            body.parentElement.classList.remove("canvas-content");
        }
    }

    onSourceCode(opened){
        let window = this.canvas.current.contentWindow || this.canvas.current.contentDocument;
        let body = window.document.body;
        let html = body.parentElement;

        if(opened){
            html.removeChild(body);

            let el = document.createElement("body");
            html.appendChild(el);
            el.innerHTML = this.state.data.content;
            this.onCreateCanvasElement(el);
            this.setState({view: ''});
        }       
        else{            
            
            let tmpContent = body.innerHTML;
            tmpContent = beautifyingHTML(tmpContent, {ocd: true});
            let data = this.state.data;
            data.content = tmpContent
            this.setState({view: 'sourcecode', data: data});
        }
    }

    onChangeContent(value){
        let data = this.state.data;
        data.content = value;
        this.setState({data: data});
    }

    onSelectElement(el){
        // if the selected element receives another click then it deselects it
        if(Object.is(el, this.state.selectedElement)){
            this.htmlCleaning();
            this.setState({selectedElement: null});
            return;
        }


        if(this.state.selectedElement !== null){ 
            this.htmlCleaning();
            this.setState({selectedElement: null}, () => this.onSelectElement(el));
            return; 
        }

        this.htmlCleaning();

        if(el.tagName.toLowerCase() === 'body'){ 
            el = null;
        }

        if(el !== null){
            if(el.getAttribute('data-selected') === '1'){
                el.removeAttribute('data-selected');
            }
            else{
                el.setAttribute('data-selected', '1');
            }
        }

        this.setState({selectedElement: el});
    }

    onDropElement(el){
        this.onDragEnd();
    }    

    onDragEnd(){
        this.htmlCleaning();
        this.forceUpdate();
    }

    getDeviceDimension(){
        let device = null;

        switch(this.state.device){
            case 'xs': device = {width: 360, height: 1050}; break;
            case 'sm': device = {width: 576, height: 1050}; break;
            case 'md': device = {width: 768, height: 1050}; break;
            case 'lg': device = {width: 992, height: 1050}; break;
            case 'xl':
            default: device = {width: 1200, height: 1050}; 
        }

        return device;
    }

    htmlCleaning(){
        // deselect the element if it is the case
        if(this.state.selectedElement){            
            this.state.selectedElement.removeAttribute('data-selected');
        }

        // remove the class dropping-zone of all elements
        let canvas = this.canvas.current.contentWindow || this.canvas.current.contentDocument;
        let items = canvas.document.querySelectorAll(".dropping-zone, .dropping-zone-hover, [contenteditable='true']");

        items.forEach(function(item) {
            //item.classList.remove('dropping-zone');
            if(item.classList.contains("dropping-zone")){
                item.remove();
            }
            else if(item.classList.contains("dropping-zone-hover")){
                item.classList.remove('dropping-zone-hover');
            }           
            
            item.removeAttribute("contenteditable");
        });
    }

    onDeleteElement(){
        this.state.selectedElement.remove();
        this.setState({selectedElement: null});
    }

    onRefresh(){
        this.forceUpdate();
    }

    onSaveCustomComponent(data){
        let tmp = this.state.data;
        let section = JsNx.getItem(tmp.customHtmlComponentList, 'name', data.section, null);

        if(section === null){
            section = {name: data.section, children: []};
            tmp.customHtmlComponentList.push(section);
        }

        this.htmlCleaning();
        section.children.push({name: data.name, type: 'custom', tagName: '', htmlString: this.state.selectedElement.outerHTML, properties: []});

        this.setState({data: tmp}, this.onAfterSaveCustomComponent);
    }

    onAfterSaveCustomComponent(){
        try{
            let str = JSON.stringify(this.state.data)
            Cookies.set('appData', str, 43200);
        }
        catch(err){
            alert("Error on setting Cookie appData. See console for more information.");
            console.log(err);
        }
    }

    onDeleteCustomComponent(item, type){
        if(!window.confirm("Êtes-vous sur de vouloir supprimer l'item ?")){ return; }

        let tmp = this.state.data;

        if(type === 's'){
            JsNx.removeItem(tmp.customHtmlComponentList, 'name', item.name);
        }
        else{
            for(let section of tmp.customHtmlComponentList){
                JsNx.removeItem(section.children, 'name', item.name);
            }
        }
        
        this.setState({data: tmp}, this.onAfterSaveCustomComponent);
    }

    onImportCustomComponent(fileContent){
        let tmp = this.state.data;
        tmp.customHtmlComponentList = JSON.parse(fileContent);
        this.setState({data: tmp}, this.onAfterSaveCustomComponent);
    }

    onCreateCanvasElement(el){
        return new CanvasElement(el, this.onSelectElement, this.onDropElement);
    }
}
