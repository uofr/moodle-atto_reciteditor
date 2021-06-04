import React, { Component } from 'react';
import { Nav, Card, Navbar, Collapse  } from 'react-bootstrap';
import {faMobileAlt, faTabletAlt, faLaptop, faDesktop, faFileWord, faEye, faCode, faAngleRight, faAngleDown, faBars, faPuzzlePiece, faSlidersH, faStream} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {TreeView} from './TreeView';
import {Canvas, CanvasElement, FloatingMenu} from './Canvas';
import {ComponentProperties, VisualComponentList} from './ComponentsCollection';
import RecitLogo from '../assets/recit.png';
import {CustomHtmlComponents} from './CustomHtmlComponents';
import {SourceCodeEditor} from '../Components';
import { HTMLElementData } from './HTMLElementData';
import {UtilsHTML} from '../../utils/Utils';
import "../css/content.scss";

export class LayoutBuilder extends Component
{
    static defaultProps = {
        input: "",
        onSelectBuilder: null
    };

    constructor(props){
        super(props);

        this.onNavbarSelect = this.onNavbarSelect.bind(this);

        this.state = {
            device: 'xl', view: 'drawner', leftPanel: false 
        };
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
                        <Nav className="mr-auto" activeKey={(this.state.leftPanel ? 'collapse' : '')}>
                            <Nav.Link eventKey="wordbuilder"><FontAwesomeIcon icon={faFileWord} title="Word Builder"/></Nav.Link>
                            <Nav.Link eventKey="collapse"><FontAwesomeIcon icon={faBars} title="Collapser"/></Nav.Link>
                        </Nav>
                        <Nav className="mr-auto" activeKey={this.state.view}>
                            <Nav.Link eventKey="preview" ><FontAwesomeIcon icon={faEye} title="Preview"/></Nav.Link>
                            <Nav.Link eventKey="sourceCode"><FontAwesomeIcon icon={faCode} title="Code source"/></Nav.Link>
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
                <MainView data={this.state.data} device={this.state.device} view={this.state.view} leftPanel={this.state.leftPanel}/>
            </div>;

		return (main);
    }

    onNavbarSelect(eventKey, event){
        if(eventKey === 'wordbuilder'){
            this.props.onSelectBuilder('word');
        }
        else if('preview' === eventKey){
            let value = (this.state.view === eventKey);
            this.setState({view: value ? 'drawner' : eventKey});
        }
        else if('sourceCode' === eventKey){
            let value = (this.state.view === eventKey);
            this.setState({view: value ? 'drawner' : eventKey});
        }
        else if(eventKey === 'collapse'){
            this.setState({leftPanel: !this.state.leftPanel});
        }
        else{
            this.setState({device: eventKey});
        }
    }
}

class MainView extends Component{
    static defaultProps = {
        data: null,
        device: "",
        view: "drawner",
        leftPanel: false
    };

    constructor(props){
        super(props);

        this.onSelectElement = this.onSelectElement.bind(this);
        this.onDeleteElement = this.onDeleteElement.bind(this);
        this.onMoveNodeUp = this.onMoveNodeUp.bind(this);
        this.onMoveNodeDown = this.onMoveNodeDown.bind(this);
        this.onCloneNode = this.onCloneNode.bind(this);
        this.onSaveCustomComponent = this.onSaveCustomComponent.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        this.setCollapse = this.setCollapse.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.canvasState = {
            drawner: new DrawnerState(this),
            preview: new PreviewState(this),
            sourceCode: new SourceCodeState(this),
        }

        this.state = {
            canvasState: 'drawner',
            selectedElement: null,
            collapsed: {
                leftPanelOnHover: false, components: false, properties: true, treeView: false,
            }
        };
    }

    componentDidUpdate(prevProps){
        if(prevProps.view !== this.props.view){
            let data = this.canvasState[prevProps.view].getData();
            this.canvasState[this.props.view].setData(data);
            this.setState({canvasState: this.props.view},  this.onCollapse);
        }
    }

    render(){
        let main =
            <div className="main" data-left-area-collapsed={(this.props.leftPanel ? "1" : "0")}>
                <div className="left-area" onMouseLeave={this.onMouseLeave} >
                    {this.props.leftPanel && !this.state.collapsed.leftPanelOnHover ? 
                        <div className="panel" data-status='close' onMouseEnter={this.onMouseEnter} >
                            <div><FontAwesomeIcon icon={faPuzzlePiece} title="Composants"/></div>
                            <div><FontAwesomeIcon icon={faSlidersH} title="Proprietés"/></div>
                            <div><FontAwesomeIcon icon={faStream} title="Arborescence"/></div>
                        </div>
                    :
                        <div className="panel" data-status='open'>
                            <Card>
                                <Card.Header onClick={() => this.setCollapse('components')}>
                                    <FontAwesomeIcon className="mr-1" icon={(this.state.collapsed.components ? faAngleRight : faAngleDown)}/>
                                    Composants
                                </Card.Header>
                                <Collapse in={!this.state.collapsed.components}>
                                    <Card.Body>
                                        <VisualComponentList onDragEnd={this.onDragEnd}/>
                                    </Card.Body>
                                </Collapse>
                            </Card>

                            <Card>
                                <Card.Header onClick={() => this.setCollapse('properties')}>
                                    <FontAwesomeIcon className="mr-1" icon={(this.state.collapsed.properties ? faAngleRight : faAngleDown)}/>Proprietés
                                </Card.Header>
                                <Collapse in={!this.state.collapsed.properties}>
                                    <Card.Body>
                                        <ComponentProperties element={this.state.selectedElement}/>
                                    </Card.Body>
                                </Collapse>
                            </Card>

                            <Card>
                                <Card.Header  onClick={() => this.setCollapse('treeView')}>
                                    <FontAwesomeIcon className="mr-1" icon={(this.state.collapsed.treeView ? faAngleRight : faAngleDown)}/>Arborescence
                                </Card.Header>
                                <Collapse in={!this.state.collapsed.treeView}>
                                    <Card.Body>
                                        <TreeView data={this.canvasState.drawner.getBody()} onSelect={this.onSelectElement} selectedElement={this.state.selectedElement} view={this.props.view}/>
                                    </Card.Body>
                                </Collapse>
                            </Card>
                        </div>
                    }
                </div>
                
                <div className="center-area">
                    {this.canvasState.drawner.render(this.props.view === 'drawner')}
                    {this.canvasState.preview.render(this.props.view === 'preview')}
                    {this.canvasState.sourceCode.render(this.props.view === 'sourceCode')}
                </div>
            </div>;

        return main;
    }

    onDragEnd(){
        this.canvasState[this.state.canvasState].onDragEnd();
        this.setState({selectedElement: null});
    }

    onSelectElement(el){
        let result = this.canvasState[this.state.canvasState].onSelectElement(el, this.state.selectedElement, this.state.collapsed);
        this.setState({selectedElement: result.el, collapsed: result.collapsed});
    }

    onDeleteElement(){
        this.canvasState[this.state.canvasState].onDeleteElement(this.state.selectedElement);
        this.setState({selectedElement: null});
    }

    onMoveNodeUp(){
        this.canvasState[this.state.canvasState].onMoveNodeUp(this.state.selectedElement);
        this.forceUpdate();
    }

    onMoveNodeDown(){
        this.canvasState[this.state.canvasState].onMoveNodeDown(this.state.selectedElement);
        this.forceUpdate();
    }

    onCloneNode(){
        this.canvasState[this.state.canvasState].onCloneNode(this.state.selectedElement);
        this.forceUpdate();
    }

    onSaveCustomComponent(data){
        //this.canvasState[this.state.canvasState].onSaveCustomComponent(data, this.state.selectedElement, this.forceUpdate);
        let p = CustomHtmlComponents.onSave(data, this.state.selectedElement);
        let that = this;

        p.then(() => {
            that.forceUpdate();
        })
    }

    onCollapse(){       
        let collapsed = this.canvasState[this.state.canvasState].onCollapse(this.state.collapsed);
        this.setState({collapsed: collapsed});
    }

    setCollapse(attr){
        let data = this.state.collapsed;
        data[attr] = !data[attr];
        this.setState({collapsed: data});
    }

    onMouseEnter(){
        if(this.props.leftPanel){
            this.setCollapse('leftPanelOnHover');
        }
    }

    onMouseLeave(){
        if(this.props.leftPanel){
            this.setCollapse('leftPanelOnHover');
        }
    }
}

class CanvasState{
    constructor(mainView){
        this.mainView = mainView;

        this.onInit = this.onInit.bind(this);
        this.onDropElement = this.onDropElement.bind(this);
        this.onSelectElement = this.onSelectElement.bind(this);
        this.onDeleteElement = this.onDeleteElement.bind(this);
        this.onMoveNodeUp = this.onMoveNodeUp.bind(this);
        this.onMoveNodeDown = this.onMoveNodeDown.bind(this);
        this.onCloneNode = this.onCloneNode.bind(this);
    }

    onInit(){ console.log("Abstract method...");}
    render(){ console.log("Abstract method...");}
    onDragEnd(){ console.log("Abstract method...");}
    onDropElement(){console.log("Abstract method...");}
    getData(){console.log("Abstract method...");}
    setData(){console.log("Abstract method...");}
    onDeleteElement(){console.log("Abstract method...");}
    onMoveNodeUp(){console.log("Abstract method...");}
    onMoveNodeDown(){console.log("Abstract method...");}
    onCloneNode(){console.log("Abstract method...");}

    onCollapse(collapsed){ 
        return collapsed;
    }

    onSelectElement(el, selectedElement, collapsed){ 
        let result = {el: el, collapsed: collapsed };
        return result;
    }

    getDeviceDimension(){
        let device = null;
        
        switch(this.mainView.props.device){
            case 'xs': device = {width: 360, height: 1050}; break;
            case 'sm': device = {width: 576, height: 1050}; break;
            case 'md': device = {width: 768, height: 1050}; break;
            case 'lg': device = {width: 992, height: 1050}; break;
            case 'xl':
            default: device = {width: 1500, height: 1050}; 
        }

        return device;
    }
}

class DrawnerState extends CanvasState{
    constructor(mainView){
        super(mainView);

        this.iFrame = null;
        this.window = null;
    }

    onInit(event){
        this.iFrame = event.target;
        this.window = this.iFrame.contentWindow || this.iFrame.contentDocument;
        let head = this.window.document.head;
        let body = this.window.document.body;

        let el = document.createElement("link");
		el.setAttribute("href", `bootstrap.min.c9ac70f5.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `fontello/css/fontello.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `canvas-content.css?v=${Math.floor(Math.random() * 100)}`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `fontawesome/css/font-awesome.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        body.parentElement.classList.add("canvas-content");

        // pure JS
        CanvasElement.create(body, this.mainView.onSelectElement, this.onDropElement);

        // React JS
        //body.appendChild(doc.firstChild);
    }

    render(show){
        let posCanvas = (this.iFrame === null ? null : this.iFrame.getBoundingClientRect());
        let posEl = (this.mainView.state.selectedElement === null ? null : this.mainView.state.selectedElement.getBoundingClientRect());

        let main = 
            <Canvas style={{display: (show ? 'flex' : 'none') }}>
                <iframe onLoad={this.onInit} className="canvas" style={this.getDeviceDimension()}></iframe>
                <FloatingMenu posCanvas={posCanvas} posEl={posEl}
                            onDeleteElement={this.mainView.onDeleteElement} onMoveNodeUp={this.mainView.onMoveNodeUp} onMoveNodeDown={this.mainView.onMoveNodeDown} 
                             onCloneNode={this.mainView.onCloneNode} onSaveCustomComponent={this.mainView.onSaveCustomComponent} />                          
            </Canvas>;

        return main;
    }   

    onSelectElement(el, selectedElement, collapsed){
        let result = {el: el, collapsed: collapsed};

        if((result.el !== null) && (result.el.tagName.toLowerCase() === 'body')){ 
            result.el = null;
        }

        // if the selected element receives another click then it deselects it
        if(Object.is(result.el, selectedElement)){
            this.htmlCleaning();
            
            result.collapsed.components = false;
            result.collapsed.properties = true;
           // result.collapsed.leftPanelOnHover = false;
            result.el = null;
        }
       /* else if(selectedElement !== null){ 
            this.htmlCleaning();
            
            result.collapsed.components = false;
            result.collapsed.properties = true;
            result.collapsed.leftPanelOnHover = false;
            result.el = null;
            return result; 
        }*/
        else{
            this.htmlCleaning();

            if(result.el !== null){
                if(result.el.getAttribute('data-selected') === '1'){
                    result.el.removeAttribute('data-selected');
                    result.el.removeAttribute('draggable');
                }
                else{
                    result.el.setAttribute('data-selected', '1');
                    result.el.setAttribute('draggable', 'true');
    
                    let elData = HTMLElementData.getElementData(null, result.el);
                    if (elData && elData.onSelect){
                        elData.onSelect(result.el, elData);
                    }
                }
            }
    
            result.collapsed.components = true;
            result.collapsed.properties = false;
            //result.collapsed.leftPanelOnHover = true;
        }

        return result;
    }

    onCollapse(collapsed){
        collapsed.components = false;
        collapsed.properties = true;
        collapsed.treeView = false;
        return collapsed;
    }

    onDropElement(){
        this.onDragEnd();
    } 

    onDeleteElement(selectedElement){
        selectedElement.remove();
    }
    
    onMoveNodeUp(selectedElement){
        let parent = selectedElement.parentElement;
        let previousSibling = selectedElement.previousSibling;
        parent.insertBefore(selectedElement, previousSibling);
    }

    onMoveNodeDown(selectedElement){
        let parent = selectedElement.parentElement;
        let nextSibling = selectedElement.nextSibling;
        if(nextSibling){
            parent.insertBefore(nextSibling, selectedElement);
        }
        else{
            parent.insertBefore(selectedElement, parent.firstChild);
        }
    }

    onCloneNode(selectedElement){
        let parent = selectedElement.parentElement;
        let el = selectedElement.cloneNode(true)
        el.removeAttribute("data-selected");
        el.removeAttribute("contenteditable");
        parent.appendChild(el);
        CanvasElement.create(el, this.mainView.onSelectElement, this.onDropElement);
    }

    onDragEnd(){
        this.htmlCleaning();
    }

    htmlCleaning(){
        // remove the class dropping-zone of all elements
        let items = this.window.document.querySelectorAll(".dropping-zone, .dropping-zone-hover, [contenteditable], [data-dragging], [data-selected], [draggable]");

        items.forEach(function(item) {
            //item.classList.remove('dropping-zone');
            if(item.classList.contains("dropping-zone")){
                item.remove();
            }
            else if(item.classList.contains("dropping-zone-hover")){
                item.classList.remove('dropping-zone-hover');
            }
            
            item.removeAttribute("data-dragging");
            item.removeAttribute("contenteditable");
            item.removeAttribute("data-selected");
            item.removeAttribute("draggable");
        });
    }

    getData(){
        if(this.window === null){ return null; }

        return this.window.document.body.innerHTML;
    }

    getBody(){
        if(this.window === null){ return null; }

        return this.window.document.body;
    }

    setData(value){
        let body = this.window.document.body;
        body.innerHTML = value;
        CanvasElement.create(body, this.mainView.onSelectElement, this.onDropElement);
    }
}

class SourceCodeState extends CanvasState{
    constructor(mainView){
        super(mainView);

        this.onChange = this.onChange.bind(this);

        this.queryStr = "";
        this.data = "";
    }

    render(show){
        let style = this.getDeviceDimension();
        style.display = (show ? 'block' : 'none');
        return <SourceCodeEditor queryStr={this.queryStr} style={style} value={this.data} onChange={this.onChange}/>
    }

    onChange(value){
        this.data = value;
    }

    getData(){
        return UtilsHTML.removeTagId(this.data);
    }

    setData(value){
        this.data = UtilsHTML.assignTagId(value);
    }

    onSelectElement(el, selectedElement, collapsed){ 
        this.queryStr = el.getAttribute("data-tag-id") || "";
        let result = {el: el, collapsed: collapsed };
        return result;
    }

    onCollapse(collapsed){ 
        collapsed.components = true;
        collapsed.properties = true;
        collapsed.treeView = false;
        return collapsed;
    }
}

class PreviewState extends CanvasState{
    constructor(mainView){
        super(mainView);

        this.iFrame = null;
    }

    onInit(event){
        this.iFrame = event.target.contentWindow || event.target.contentDocument;
        let head = this.iFrame.document.head;

        let el = document.createElement("link");
		el.setAttribute("href", `bootstrap.min.c9ac70f5.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `fontello/css/fontello.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `fontawesome/css/font-awesome.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `editor/content.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("script");
		el.setAttribute("src", `editor/script.js`);
		el.setAttribute("type", "text/javascript");
		head.appendChild(el);
    }

    render(show){
        let main = 
            <Canvas style={{display: (show ? 'flex' : 'none') }}> 
                <iframe onLoad={this.onInit} className="canvas" style={this.getDeviceDimension()}></iframe>
            </Canvas>;
        return main;
    }

    onSelectElement(el, selectedElement, collapsed){
        let result = {el: null, collapsed: collapsed};
        return result;
    }

    getData(){
        //Clean up popups before returning html
        let popup = this.iFrame.document.body.querySelectorAll('.r_popup-overlay');
        for (let el of popup){
            el.remove();
        }
        return this.iFrame.document.body.innerHTML;
    }

    setData(value){
        let body = this.iFrame.document.body;
        body.innerHTML = value;
    }
}