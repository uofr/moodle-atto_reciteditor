import React, { Component } from 'react';
import { Nav, Card, Navbar, Collapse, Button  } from 'react-bootstrap';
import {faMobileAlt, faTabletAlt, faLaptop, faDesktop, faFileWord, faEye, faCode, faAngleRight, faAngleDown, faBars, faPuzzlePiece, faSlidersH, faStream, faSave, faRedo, faUndo} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {TreeView} from './TreeView';
import {Canvas, CanvasElement, FloatingMenu, NodeTextEditing} from './Canvas';
import {ComponentProperties, VisualComponentList} from './ComponentsCollection';
import {SourceCodeEditor, Assets} from '../Components';
import { HTMLElementData } from './HTMLElementData';
import { Templates } from './Templates';
import { HistoryManager } from './HistoryManager';
import Utils, {UtilsHTML, UtilsMoodle} from '../../utils/Utils';
import html2canvas from 'html2canvas';

export class LayoutBuilder extends Component
{
    static defaultProps = {
        content: "",
        onSelectBuilder: null,
        onChange: null,
        onSaveAndClose: null,
        onChange: null
    };

    constructor(props){
        super(props);

        this.onNavbarSelect = this.onNavbarSelect.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);

        this.state = {
            device: 'xl', view: 'drawner', leftPanel: false 
        };

        this.mainViewRef = React.createRef();
        this.historyManager = new HistoryManager();

        if (screen.width < 1400){//If screen is small, set layout to lg instead of xl
            this.state.device = 'lg';
        }
    }  

	render(){
		let main = 
			<div className="layout-builder">                
                <Navbar bg="dark" variant="dark" onSelect={this.onNavbarSelect} expand="sm">
                    <Navbar.Brand>
                        <img alt="RÉCIT" src={`.${Assets.RecitLogo}`} width="30" height="30" className="d-inline-block align-top" />{' '}
                        Éditeur RÉCIT
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" activeKey={(this.state.leftPanel ? 'collapse' : '')}>
                            <Nav.Link eventKey="wordbuilder"><FontAwesomeIcon icon={faFileWord} title="Word Builder"/></Nav.Link>
                            <Nav.Link eventKey="collapse"><FontAwesomeIcon icon={faBars} title="Collapser"/></Nav.Link>
                        {this.state.view == 'drawner' && <>
                            <Nav.Link eventKey="undo"><FontAwesomeIcon icon={faUndo} title="Undo"/></Nav.Link>
                            <Nav.Link eventKey="redo"><FontAwesomeIcon icon={faRedo} title="Redo"/></Nav.Link>
                            </>
                        }
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
                        <Button variant="outline-success" onClick={this.onSaveAndClose}><FontAwesomeIcon icon={faSave} title="Enregistrer"/>{" Enregistrer"}</Button>
                    </Navbar.Collapse>
                </Navbar>
                <MainView ref={this.mainViewRef} content={this.props.content} device={this.state.device} view={this.state.view} leftPanel={this.state.leftPanel} historyManager={this.historyManager}/>
            </div>;

		return (main);
    }

    onNavbarSelect(eventKey, event){
        if(eventKey === 'wordbuilder'){
            this.props.onChange(this.mainViewRef.current.getData());
            this.props.onSelectBuilder('word');
        }
        else if(eventKey === 'preview'){
            let value = (this.state.view === eventKey);
            this.setState({view: value ? 'drawner' : eventKey});
        }
        else if(eventKey === 'sourceCode'){
            let value = (this.state.view === eventKey);
            this.setState({view: value ? 'drawner' : eventKey});
        }
        else if(eventKey === 'collapse'){
            this.setState({leftPanel: !this.state.leftPanel});
        }
        else if(eventKey === 'undo'){
            this.historyManager.onUndo(this.mainViewRef.current.setData, this.mainViewRef.current.getData());
        }
        else if(eventKey === 'redo'){
            this.historyManager.onRedo(this.mainViewRef.current.setData, this.mainViewRef.current.getData());
        }
        else{
            this.setState({device: eventKey});
        }
    }

    onSaveAndClose(){
        let content = this.mainViewRef.current.getData();
        this.props.onSaveAndClose(content);
    }
}

class MainView extends Component{
    static defaultProps = {
        content: "",
        device: "",
        view: "drawner",
        leftPanel: false,
        historyManager: null,
    };

    constructor(props){
        super(props);

        this.onSelectElement = this.onSelectElement.bind(this);
        this.onDeleteElement = this.onDeleteElement.bind(this);
        this.onMoveNodeUp = this.onMoveNodeUp.bind(this);
        this.onMoveNodeDown = this.onMoveNodeDown.bind(this);
        this.onCloneNode = this.onCloneNode.bind(this);
        this.onEditNodeText = this.onEditNodeText.bind(this);
        this.onSaveTemplate = this.onSaveTemplate.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        this.setCollapse = this.setCollapse.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);

        this.canvasState = {
            drawner: new DrawnerState(this, this.props.historyManager),
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

    componentDidMount(){
        this.canvasState[this.props.view].setData(this.props.content);
        this.props.historyManager.addHistoryItem(this.props.content);
        this.loadTemplates();
    }

    loadTemplates(){
        let p = Templates.onLoad();
        let that = this;
        
        p.then((webApiResult) => {
            if(webApiResult.success){
                that.forceUpdate();
            }
            else{
                alert(`Error: ${webApiResult.msg}`);
            }
        },
        (err, response) => {
            console.log(err, response);
        });
    }

    componentDidUpdate(prevProps){
        if(prevProps.view !== this.props.view){
            let data = this.canvasState[prevProps.view].getData();
            this.canvasState[this.props.view].setData(data, this.state.selectedElement);
            this.setState({canvasState: this.props.view},  this.onCollapse);
        }

        if(prevProps.content !== this.props.content){
            this.canvasState[this.props.view].setData(this.props.content);
        }
    }

    getData(){
        return this.canvasState[this.props.view].getData(true);
    }

    setData(data){
        return this.canvasState[this.props.view].setData(data);
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
                                    <Card.Body className="properties">
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
                    {this.canvasState.drawner.render(this.props.view === 'drawner', this.state.selectedElement)}
                    {this.canvasState.preview.render(this.props.view === 'preview', this.state.selectedElement)}
                    {this.canvasState.sourceCode.render(this.props.view === 'sourceCode', this.state.selectedElement)}
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

    onEditNodeText(el){
        if(el instanceof HTMLElement){
            this.canvasState[this.state.canvasState].onEditNodeText(el);
            this.setState({selectedElement: el});
        }
        else{
            this.canvasState[this.state.canvasState].onEditNodeText(this.state.selectedElement);
            this.forceUpdate();
        }
    }

    onSaveTemplate(name, type){
        let p = null;

        if(type === 'l'){
            let body = this.state.selectedElement;
            p = html2canvas(body, {useCORS: true}).then((canvas) => {
                let data = canvas.toDataURL();
                let MAX_WIDTH = 600;
                let MAX_HEIGHT = 600;
                let fileType = "png"
                let p2 = Utils.resizeImageFromSize(data, MAX_WIDTH, MAX_HEIGHT, fileType);
               
                return p2.then((img) => {
                    return Templates.onSave(name, type, body.outerHTML, img);
                });
            });
        }
        else{
            p = Templates.onSave(name, type, this.state.selectedElement.outerHTML);
        }

        let that = this;

        p.then((webApiResult) => {
            if(webApiResult.success){
                that.loadTemplates();                
            }
            else{
                alert(`Error: ${webApiResult.msg}`);
        }
        });
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
        this.onEditNodeText = this.onEditNodeText.bind(this);
        this.onLoadFrame = this.onLoadFrame.bind(this);
        this.htmlCleaning = this.htmlCleaning.bind(this);

        this.onLoadFrame();
    }

    onLoadFrame(){} // Abstract method
    onInit(iframe){ console.log("Abstract method...");}
    render(show, selectedElement){ console.log("Abstract method...");}
    onDragEnd(){ console.log("Abstract method...");}
    onDropElement(){console.log("Abstract method...");}
    getData(htmlCleaning){console.log("Abstract method...");}
    setData(value){console.log("Abstract method...");}
    onDeleteElement(selectedElement){console.log("Abstract method...");}
    onMoveNodeUp(selectedElement){console.log("Abstract method...");}
    onMoveNodeDown(selectedElement){console.log("Abstract method...");}
    onCloneNode(selectedElement){console.log("Abstract method...");}
    onEditNodeText(selectedElement){console.log("Abstract method...");}

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
}

class DrawnerState extends CanvasState{
    constructor(mainView, historyManager){
        super(mainView);

        this.iFrame = null;
        this.window = null;
        this.historyManager = historyManager;
    }

    onLoadFrame(){
        let iframe = window.document.getElementById("drawner-canvas");
        if(iframe){
            this.onInit(iframe);
            return;
        }
        else{
            console.log("Loading drawner iframe...");
            setTimeout(this.onLoadFrame, 500);
        }
    }

    onInit(iframe){
        this.iFrame = iframe;
        this.window = this.iFrame.contentWindow || this.iFrame.contentDocument;
        let head = this.window.document.head;
        let body = this.window.document.body;

        let el = document.createElement("link");
		el.setAttribute("href", UtilsMoodle.getBaseCss());
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `${Assets.CanvasContentCSS}?v=${Math.floor(Math.random() * 100)}`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        body.parentElement.classList.add("canvas-content");

        // pure JS
        CanvasElement.create(body, this.mainView.onSelectElement, this.onDropElement, this.mainView.onEditNodeText);

        // React JS
        //body.appendChild(doc.firstChild);
    }

    render(show, selectedElement){
        let posCanvas = (this.iFrame === null ? null : this.iFrame.getBoundingClientRect());

        let main = 
            <Canvas style={{display: (show ? 'flex' : 'none') }}>
                <iframe id="drawner-canvas" className="canvas" style={this.getDeviceDimension()}></iframe>
                <FloatingMenu posCanvas={posCanvas} selectedElement={selectedElement}  onEdit={this.mainView.onEditNodeText}
                            onDeleteElement={this.mainView.onDeleteElement} onMoveNodeUp={this.mainView.onMoveNodeUp} onMoveNodeDown={this.mainView.onMoveNodeDown} 
                             onCloneNode={this.mainView.onCloneNode} onSaveTemplate={this.mainView.onSaveTemplate} />
                <NodeTextEditing posCanvas={posCanvas} window={this.window} selectedElement={selectedElement} />
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

    onContentChange(){
        if (this.historyManager){
            this.historyManager.onContentChange(this.getData());
        }
    }

    onDropElement(){
        this.onDragEnd();
        this.onContentChange();
    } 

    onDeleteElement(selectedElement){
        this.onContentChange();
        selectedElement.remove();
    }
    
    onMoveNodeUp(selectedElement){
        this.onContentChange();
        let parent = selectedElement.parentElement;
        let previousSibling = selectedElement.previousSibling;
        parent.insertBefore(selectedElement, previousSibling);
    }

    onMoveNodeDown(selectedElement){
        this.onContentChange();
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
        this.onContentChange();
        let parent = selectedElement.parentElement;
        let el = selectedElement.cloneNode(true)
        el.removeAttribute("data-selected");
        el.removeAttribute("contenteditable");
        parent.appendChild(el);
        CanvasElement.create(el, this.mainView.onSelectElement, this.onDropElement, this.mainView.onEditNodeText);
    }

    onDragEnd(){
        this.htmlCleaning();
    }
   
    getData(htmlCleaning){
        if(this.window === null){ return null; }

        if(htmlCleaning){
            this.htmlCleaning();
        }

        return this.window.document.body.innerHTML;
    }

    getBody(){
        if(this.window === null){ return null; }

        return this.window.document.body;
    }

    setData(value){
        let that = this;

        let loading = function(){
            if(that.window){
                let body = that.window.document.body;
                body.innerHTML = value;
                CanvasElement.create(body, that.mainView.onSelectElement, that.onDropElement, that.mainView.onEditNodeText);
            }
            else{
                console.log("Loading drawner canvas...");
                setTimeout(loading, 500);
            }
        }
        setTimeout(loading, 500);
    }

    onEditNodeText(selectedElement){ 
        let that = this;     
      
        let setCaretToEnd = function(el) {
            el.focus();
            
            let range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(true);
            let sel = that.window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          
            // set scroll to the end if multiline
            el.scrollTop = el.scrollHeight; 
        }    

        selectedElement.setAttribute('contenteditable', 'true');
        setCaretToEnd(selectedElement);
    }
}

class SourceCodeState extends CanvasState{
    constructor(mainView){
        super(mainView);

        this.onChange = this.onChange.bind(this);

        this.queryStr = "";
        this.data = "";
    }

    render(show, selectedElement){
        let style = this.getDeviceDimension();
        style.display = (show ? 'block' : 'none');
        return <SourceCodeEditor queryStr={this.queryStr} style={style} value={this.data} onChange={this.onChange}/>
    }

    onChange(value){
        this.data = value;
    }

    getData(htmlCleaning){
        if(htmlCleaning){
            this.htmlCleaning();
        }
        
        return UtilsHTML.removeTagId(this.data);
    }

    setData(value, el){
        el = el || null;

        if(el !== null){
            this.queryStr = el.getAttribute("data-tag-id") || "";
        }        
        
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

    onLoadFrame(){
        let iframe = window.document.getElementById("preview-canvas");
        if(iframe){
            this.onInit(iframe);
            return;
        }
        else{
            console.log("Loading preview iframe...");
            setTimeout(this.onLoadFrame, 500);
        }
    }

    onInit(iframe){
        this.iFrame =  iframe.contentWindow || iframe.contentDocument;
        let head = this.iFrame.document.head;

        let el = document.createElement("link");
		el.setAttribute("href", UtilsMoodle.getBaseCss());
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        this.iFrame.addEventListener("click", function(e) {//Prevent links from working on preview
            if (e.target.tagName == 'A' || e.target.tagName == 'BUTTON'){
                e.preventDefault();
            }
        });
    }

    render(show, selectedElement){
        let main = 
            <Canvas style={{display: (show ? 'flex' : 'none') }}> 
                <iframe id="preview-canvas" className="canvas" style={this.getDeviceDimension()}></iframe>
            </Canvas>;
        return main;
    }

    onSelectElement(el, selectedElement, collapsed){
        let result = {el: null, collapsed: collapsed};
        return result;
    }

    htmlCleaning(){
        super.htmlCleaning();
        
        //Clean up popups before returning html
        let popup = this.iFrame.document.body.querySelectorAll('.r_popup-overlay');
        for (let el of popup){
            el.remove();
        }
    }

    getData(htmlCleaning){
        this.htmlCleaning();
        return this.iFrame.document.body.innerHTML;
    }

    setData(value){
        let body = this.iFrame.document.body;
        body.innerHTML = value;
    }
}