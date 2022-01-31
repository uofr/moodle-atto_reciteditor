import React, { Component } from 'react';
import { Nav, Card, Navbar, Button  } from 'react-bootstrap';
import {faExpand, faMobileAlt, faTabletAlt, faTh, faLaptop, faDesktop, faFileWord, faEye, faCode, faAngleRight, faAngleDown, faBars, faPuzzlePiece, 
        faSlidersH, faStream, faSave, faRedo, faUndo} from '@fortawesome/free-solid-svg-icons';
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
        onChange: null,
        options: {}
    };

    constructor(props){
        super(props);

        this.onNavbarSelect = this.onNavbarSelect.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);

        this.state = { device: (window.screen.width <= 1920 ? 'lg' : 'xl'), view: 'designer'}; 

        this.mainViewRef = React.createRef();
        this.historyManager = new HistoryManager(); 
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
                        <Nav>
                            {this.props.options.wordProcessor && <Nav.Link eventKey="wordbuilder"><FontAwesomeIcon icon={faFileWord} title="Word Builder"/></Nav.Link>}
                        </Nav>
                        
                        <Nav className="mr-auto"></Nav>

                        <Nav className="mr-auto" activeKey={this.state.view}>
                            <Nav.Link eventKey="designer" ><FontAwesomeIcon icon={faTh} title="Canevas"/></Nav.Link>
                            <Nav.Link eventKey="preview" ><FontAwesomeIcon icon={faEye} title="Preview"/></Nav.Link>
                            <Nav.Link eventKey="sourceCode"><FontAwesomeIcon icon={faCode} title="Code source"/></Nav.Link>
                        </Nav>

                        {this.state.view == 'designer' && <>
                            <Nav>
                                <Nav.Link eventKey="undo"><FontAwesomeIcon icon={faUndo} title="Undo"/></Nav.Link>
                                <Nav.Link eventKey="redo"><FontAwesomeIcon icon={faRedo} title="Redo"/></Nav.Link>
                            </Nav>
                            <Nav className="separator"></Nav>
                            </>
                        }

                        <Nav activeKey={this.state.device}>
                            <Nav.Link eventKey="xs"><FontAwesomeIcon icon={faMobileAlt} title="XS"/></Nav.Link>
                            <Nav.Link eventKey="sm"><FontAwesomeIcon icon={faTabletAlt} title="SM"/></Nav.Link>
                            <Nav.Link eventKey="md"><FontAwesomeIcon icon={faTabletAlt} title="MD" style={{transform: 'rotate(90deg)'}}/></Nav.Link>
                            <Nav.Link eventKey="lg"><FontAwesomeIcon icon={faLaptop} title="LG"/></Nav.Link>
                            <Nav.Link eventKey="xl"><FontAwesomeIcon icon={faDesktop} title="XL"/></Nav.Link>    
                        </Nav>
                        <Nav className="separator"></Nav>
                        <Button variant="success" size="sm"  onClick={this.onSaveAndClose}><FontAwesomeIcon icon={faSave} title="Enregistrer"/>{" Enregistrer"}</Button>
                    </Navbar.Collapse>
                </Navbar>
                <MainView ref={this.mainViewRef} content={this.props.content} device={this.getDeviceDimension()} view={this.state.view} historyManager={this.historyManager}/>
            </div>;

		return (main);
    }

    onNavbarSelect(eventKey, event){
        if(eventKey === 'wordbuilder'){
            this.props.onChange(this.mainViewRef.current.getData());
            this.props.onSelectBuilder('word');
        }
        else if(['designer', 'preview', 'sourceCode'].includes(eventKey)){
            this.setState({view: eventKey});
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

    getDeviceDimension(){
        let device = null;
        
        function getScale(device){
            let result = 1;

            if(window.innerWidth - 380 <= device.width){
                // 380 = left panel width; 10 = padding
                result = (window.innerWidth - 380 - 10) / device.width;
            }
            else if(window.innerHeight <= device.height){
                // 380 = top navbar; 10 = padding
                result = (window.innerHeight - 56 -10) / device.height;
            }

            return result;
        }

        switch(this.state.device){
            case 'xs': device = {width: 375, height: 667, scale: 1}; break;
            case 'sm': device = {width: 768, height: 1024, scale: 1}; break;
            case 'md': device = {width: 1024, height: 768, scale: 1}; break;
            case 'lg': device = {width: 1366, height: 768, scale: 1}; break;
            case 'xl':
            default: device = {width: 1500, height: 1050, scale: 1}; 
        }

        device.scale = getScale(device);

        return device;
    }
}

class MainView extends Component{
    static defaultProps = {
        content: "",
        device: null,
        view: "designer",
        historyManager: null,
    };

    constructor(props){
        super(props);

        this.onSelectElement = this.onSelectElement.bind(this);
        this.onDeleteElement = this.onDeleteElement.bind(this);
        this.onReplaceNonBreakingSpace = this.onReplaceNonBreakingSpace.bind(this);
        this.onMoveNodeUp = this.onMoveNodeUp.bind(this);
        this.onMoveNodeDown = this.onMoveNodeDown.bind(this);
        this.onCloneNode = this.onCloneNode.bind(this);
        this.onInsertNode = this.onInsertNode.bind(this);
        this.onEditNodeText = this.onEditNodeText.bind(this);
        this.onSaveTemplate = this.onSaveTemplate.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        this.setCollapse = this.setCollapse.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.onKey = this.onKey.bind(this);

        this.canvasState = {
            designer: new DesignerState(this, this.props.historyManager),
            preview: new PreviewState(this),
            sourceCode: new SourceCodeState(this),
        }

        this.state = {
            canvasState: 'designer',
            selectedElement: null,
            collapsed: {components: false, properties: true, treeView: true}
        };
    }

    componentDidMount(){
        this.canvasState[this.props.view].setData(this.props.content);
        this.props.historyManager.addHistoryItem(this.props.content);
        this.loadTemplates();
        document.body.onkeyup = this.onKey;
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

    forceRefresh(){
        //Wait to see if selectedElement gets destroyed
        if (typeof(this.state.selectedElement) == 'undefined' || this.state.selectedElement.deleted){
            this.setState({selectedElement:null});
        }else{
            this.forceUpdate();
        }
    }

    render(){
        let panelHeight = window.innerHeight - 56 - 10 - 100; // 56px = top navbar; 10px padding; card header = 100px
        let openPanels = (!this.state.collapsed.components ? 1 : 0) + (!this.state.collapsed.properties ? 1 : 0) + (!this.state.collapsed.treeView ? 1 : 0);
        panelHeight = `${panelHeight / openPanels}px`;

        let main =
            <div className="main">
                <div className="left-area" >
                    <Card>
                        <Card.Header onClick={() => this.setCollapse('components')}>
                            <FontAwesomeIcon className="mr-1" icon={(this.state.collapsed.components ? faAngleRight : faAngleDown)}/>
                            Composants
                        </Card.Header>
                        <Card.Body data-collapsed={(this.state.collapsed.components ? 1 : 0)} style={{height: panelHeight}}>
                            <VisualComponentList onDragEnd={this.onDragEnd} onSaveTemplate={this.onSaveTemplate}/>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header onClick={() => this.setCollapse('properties')}>
                            <FontAwesomeIcon className="mr-1" icon={(this.state.collapsed.properties ? faAngleRight : faAngleDown)}/>Proprietés
                        </Card.Header>
                        <Card.Body className="properties"  data-collapsed={(this.state.collapsed.properties ? 1 : 0)}  style={{height: panelHeight}}>
                            <ComponentProperties onInsertNode={this.onInsertNode} onDeleteElement={this.onDeleteElement} element={this.state.selectedElement}/>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header onClick={() => this.setCollapse('treeView')}>
                            <FontAwesomeIcon className="mr-1" icon={(this.state.collapsed.treeView ? faAngleRight : faAngleDown)}/>Arborescence
                        </Card.Header>
                        <Card.Body data-collapsed={(this.state.collapsed.treeView ? 1 : 0)}  style={{height: panelHeight}}>
                            <TreeView data={this.canvasState.designer.getBody()} onSelect={this.onSelectElement} selectedElement={this.state.selectedElement} view={this.props.view}
                                    onDeleteElement={this.onDeleteElement} onMoveNodeUp={this.onMoveNodeUp} onMoveNodeDown={this.onMoveNodeDown} />
                        </Card.Body>
                    </Card>
                </div>
                
                <div className="center-area">
                    {this.canvasState.designer.render(this.props.view === 'designer', this.state.selectedElement)}
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

    onDeleteElement(el){
        this.canvasState[this.state.canvasState].onDeleteElement(el || this.state.selectedElement);
        this.setState({selectedElement: null});
    }

    onReplaceNonBreakingSpace(el){
        this.canvasState[this.state.canvasState].onReplaceNonBreakingSpace(el || this.state.selectedElement);
        this.forceUpdate();
    }

    onMoveNodeUp(el){
        this.canvasState[this.state.canvasState].onMoveNodeUp(el || this.state.selectedElement);
        this.forceUpdate();
    }

    onKey(e){
        this.canvasState[this.state.canvasState].onKey(e, this.state.selectedElement);
    }

    onMoveNodeDown(el){
        this.canvasState[this.state.canvasState].onMoveNodeDown(el || this.state.selectedElement);
        this.forceUpdate();
    }

    onCloneNode(){
        this.canvasState[this.state.canvasState].onCloneNode(this.state.selectedElement);
        this.forceUpdate();
    }

    onInsertNode(elems){
        this.canvasState[this.state.canvasState].onInsertNode(elems);
        this.forceUpdate();
    }

    onDragStart(event){
        event.stopPropagation();
        
        CanvasElement.draggingItem = this.state.selectedElement;
        event.dataTransfer.setDragImage(this.state.selectedElement, 0, 0);
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
            let el = this.canvasState.designer.getBody() || null;
            if(el === null){ return; }

            el = el.firstChild;
            p = html2canvas(el, {useCORS: true}).then((canvas) => {
                let data = canvas.toDataURL();
                let MAX_WIDTH = 600;
                let MAX_HEIGHT = 600;
                let fileType = "png"
                let p2 = Utils.resizeImageFromSize(data, MAX_WIDTH, MAX_HEIGHT, fileType);
               
                return p2.then((img) => {
                    return Templates.onSave(name, type, el.outerHTML, img);
                });
            });
        }
        else{ //Component
            p = html2canvas(this.state.selectedElement, {useCORS: true}).then((canvas) => {
                let data = canvas.toDataURL();
                let MAX_WIDTH = 300;
                let MAX_HEIGHT = 300;
                let fileType = "png"
                let p2 = Utils.resizeImageFromSize(data, MAX_WIDTH, MAX_HEIGHT, fileType);
               
                return p2.then((img) => {
                    return Templates.onSave(name, type, this.state.selectedElement.outerHTML, img);
                });
            });
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
}

class CanvasState{
    constructor(mainView){
        this.mainView = mainView;

        this.onInit = this.onInit.bind(this);
        this.onSelectElement = this.onSelectElement.bind(this);
        this.onDeleteElement = this.onDeleteElement.bind(this);
        this.onMoveNodeUp = this.onMoveNodeUp.bind(this);
        this.onMoveNodeDown = this.onMoveNodeDown.bind(this);
        this.onCloneNode = this.onCloneNode.bind(this);
        this.onInsertNode = this.onInsertNode.bind(this);
        this.onEditNodeText = this.onEditNodeText.bind(this);
        this.onLoadFrame = this.onLoadFrame.bind(this);
        this.htmlCleaning = this.htmlCleaning.bind(this);
        this.onKey = this.onKey.bind(this);

        this.onLoadFrame();
    }

    onLoadFrame(){} // Abstract method
    onInit(iframe){ console.log("Abstract method...");}
    render(show, selectedElement){ console.log("Abstract method...");}
    onDragEnd(){ console.log("Abstract method...");}
    getData(htmlCleaning){console.log("Abstract method...");}
    setData(value){console.log("Abstract method...");}
    onDeleteElement(selectedElement){console.log("Abstract method...");}
    onMoveNodeUp(selectedElement){console.log("Abstract method...");}
    onMoveNodeDown(selectedElement){console.log("Abstract method...");}
    onCloneNode(selectedElement){console.log("Abstract method...");}
    onInsertNode(elems){console.log("Abstract method...");}
    onEditNodeText(selectedElement){console.log("Abstract method...");}
    onKey(e, editingElement){}

    onCollapse(collapsed){ 
        return collapsed;
    }

    onSelectElement(el, selectedElement, collapsed){ 
        let result = {el: el, collapsed: collapsed };
        return result;
    }  

    htmlCleaning(htmlDoc){
        htmlDoc = htmlDoc || null;
        if(htmlDoc === null){
            return;
        }

        // remove the class dropping-zone of all elements
        let items = htmlDoc.querySelectorAll(".dropping-zone, .dropping-zone-hover, [contenteditable], [data-hovering], [data-selected], [draggable]");

        items.forEach(function(item) {
            //item.classList.remove('dropping-zone');
            if(item.classList.contains("dropping-zone")){
                item.remove();
            }
            else if(item.classList.contains("dropping-zone-hover")){
                item.classList.remove('dropping-zone-hover');
            }
            
            item.removeAttribute("data-hovering");
            item.removeAttribute("contenteditable");
            item.removeAttribute("data-selected");
            item.removeAttribute("draggable");
        });
    }

    getStyle(){
        let style = {width: this.mainView.props.device.width, height: this.mainView.props.device.height};
        if(this.mainView.props.device.height > window.innerHeight){
            style.transform = `scale(${this.mainView.props.device.scale})`;
            style.transformOrigin = "0 0";
        } 

        return style;
    }
}

class DesignerState extends CanvasState{
    constructor(mainView, historyManager){
        super(mainView);

        this.iFrame = null;
        this.window = null;
        this.historyManager = historyManager;
        this.onKey = this.onKey.bind(this);
    }

    onLoadFrame(){
        let iframe = window.document.getElementById("designer-canvas");
        if(iframe){
            this.onInit(iframe);
            return;
        }
        else{
            console.log("Loading designer iframe...");
            setTimeout(this.onLoadFrame, 500);
        }
    }

    onInit(iframe){
        this.iFrame = iframe;
        this.window = this.iFrame.contentWindow || this.iFrame.contentDocument;
        let head = this.window.document.head;
        let body = this.window.document.body;

        let el = document.createElement("style");
		el.setAttribute("title", "theme-moodle");
        el.innerHTML = UtilsHTML.cssRules2Str(UtilsMoodle.getThemeMoodleCssRules());
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `${Assets.CanvasDesignerCSS}`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        // pure JS
        CanvasElement.create(body, this.mainView.onSelectElement, this.mainView.onDragEnd, this.mainView.onEditNodeText);

        // React JS
        //body.appendChild(doc.firstChild);        

        body.onkeyup = this.mainView.onKey;
    }

    render(show, selectedElement){
        let posCanvas = (this.iFrame === null ? null : this.iFrame.getBoundingClientRect());        
 
        let main = 
            <Canvas style={{display: (show ? 'flex' : 'none') }}>
                <iframe id="designer-canvas" className="canvas" style={this.getStyle()}></iframe>
                <FloatingMenu posCanvas={posCanvas} selectedElement={selectedElement} onDragElement={this.mainView.onDragStart}  onEdit={this.mainView.onEditNodeText}
                            onDeleteElement={this.mainView.onDeleteElement} onMoveNodeUp={this.mainView.onMoveNodeUp} onMoveNodeDown={this.mainView.onMoveNodeDown} 
                             onCloneNode={this.mainView.onCloneNode} onSaveTemplate={this.mainView.onSaveTemplate} device={this.mainView.props.device} />
                <NodeTextEditing posCanvas={posCanvas} window={this.window} selectedElement={selectedElement} onReplaceNonBreakingSpace={this.mainView.onReplaceNonBreakingSpace} device={this.mainView.props.device}/>
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
            this.htmlCleaning(this.window.document);
            
            result.collapsed.components = false;
            result.collapsed.properties = true;
            result.el = null;
        }
       /* else if(selectedElement !== null){ 
            this.htmlCleaning();
            
            result.collapsed.components = false;
            result.collapsed.properties = true;
            result.el = null;
            return result; 
        }*/
        else{
            this.htmlCleaning(this.window.document);

            if(result.el !== null){
                if(result.el.getAttribute('data-selected') === '1'){
                    result.el.removeAttribute('data-selected');
                    result.el.removeAttribute('draggable');
                }
                else{
                    result.el.setAttribute('data-selected', '1');
                    result.el.setAttribute('draggable', 'true');
    
                    let elClass = HTMLElementData.getElementClass(null, result.el);
                    if (elClass && elClass.onSelect){
                        elClass.onSelect(result.el);
                    }
                }
            }
    
            result.collapsed.components = true;
            result.collapsed.properties = false;
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
    
    onDragEnd(){
        this.onContentChange();
        this.htmlCleaning(this.window.document);
    }

    onDeleteElement(el){
        if(!el){ return; } // Element does not exist
        if(el.isSameNode(this.window.document.body)){ return; }

        this.onContentChange();
        el.remove();
    }

    onReplaceNonBreakingSpace(el){
        if(!el){ return; } // Element does not exist
        if(el.isSameNode(this.window.document.body)){ return; }

        let regex = new RegExp(/(\u00AB|\u2014)(?:\s+)?|(?:\s+)?([\?!:;\u00BB])/g);
        el.innerHTML = el.innerHTML.replace("&nbsp; ", "");//Revert old nbsp
        el.innerHTML = el.innerHTML.replace("&nbsp;", "");//Revert old nbsp
        el.innerHTML = el.innerHTML.replace(regex, "$1&nbsp;$2");
        this.onContentChange();

    }
    
    onMoveNodeUp(el){
        if(el.isSameNode(this.window.document.body)){ return; }

        let parent = el.parentElement;

        if(el.isSameNode(parent.firstElementChild)){
            if(!parent.isSameNode(this.window.document.body)){
                parent.parentElement.insertBefore(el, parent);
            }
        }
        else{
            parent.insertBefore(el, el.previousElementSibling);
        }
        
        this.onContentChange();
    }

    onMoveNodeDown(el){
        if(el.isSameNode(this.window.document.body)){ return; }

        let parent = el.parentElement;

        if(el.isSameNode(parent.lastElementChild)){
            if(!parent.isSameNode(this.window.document.body)){
                parent.parentElement.insertBefore(el, parent.nextElementSibling);
            }
        }
        else{
            parent.insertBefore(el.nextElementSibling, el);
        }

        this.onContentChange();
    }

    onCloneNode(selectedElement){
        if(selectedElement.isSameNode(this.window.document.body)){ return; }

        this.onContentChange();
        let parent = selectedElement.parentElement;
        let el = selectedElement.cloneNode(true)
        el.removeAttribute("data-selected");
        el.removeAttribute("contenteditable");
        parent.appendChild(el);
        CanvasElement.create(el, this.mainView.onSelectElement, this.mainView.onDragEnd, this.mainView.onEditNodeText);
    }

    onInsertNode(elems){
        this.onContentChange();

        for(let el of elems){
            CanvasElement.create(el, this.mainView.onSelectElement, this.mainView.onDragEnd, this.mainView.onEditNodeText);
        }
    }
   
    getData(htmlCleaning){
        if(this.window === null){ return null; }

        if(htmlCleaning){
            this.htmlCleaning(this.window.document);
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
                CanvasElement.create(body, that.mainView.onSelectElement, that.mainView.onDragEnd, that.mainView.onEditNodeText);
            }
            else{
                console.log("Loading designer canvas...");
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

        if(selectedElement === null){
            return;
        }

        selectedElement.setAttribute('contenteditable', 'true');
        setCaretToEnd(selectedElement);
    }

    onKey(e, editingElement) {
        if (e.keyCode === 46) {//del
            console.log(editingElement)
            if (!editingElement || editingElement.getAttribute('contenteditable') != 'true') {
                this.mainView.onDeleteElement(null);
            }
        }

        if (e.ctrlKey && e.keyCode == 90){//ctrl z
            this.historyManager.onUndo(this.mainView.setData, this.mainView.getData());
        }
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
        let style = {
            width: Math.min(this.mainView.props.device.width, window.innerWidth - 380 - 10), 
            height: Math.min(this.mainView.props.device.height, window.innerHeight - 56 - 10), 
            display: (show ? 'block' : 'none'),
            overflowY: 'auto'
        };
        return <SourceCodeEditor queryStr={this.queryStr} style={style} value={this.data} onChange={this.onChange}/>
    }

    onChange(value){
        this.data = value;
    }

    htmlCleaning(){
        let htmlDoc = new DOMParser().parseFromString(this.data, "text/html");
        super.htmlCleaning(htmlDoc);
        return htmlDoc.body.innerHTML;
    }

    getData(htmlCleaning){
        let result = this.data;

        if(htmlCleaning){
            result = this.htmlCleaning();
        }
        
        return UtilsHTML.removeTagId(result);
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
        let doc = this.iFrame.document;

        let el = document.createElement("style");
		el.setAttribute("title", "theme-moodle");
        el.innerHTML = UtilsHTML.cssRules2Str(UtilsMoodle.getThemeMoodleCssRules());
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `${Assets.CanvasCSS}`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        this.iFrame.addEventListener("click", function(e) {//Prevent links from working on preview
            if (e.target.tagName == 'A' || e.target.tagName == 'BUTTON'){
                if (e.target.getAttribute('data-toggle') == 'collapse'){//Accordion
                    let el = doc.querySelector(e.target.getAttribute('data-target'));
                    if (el){
                        if (el.classList.contains('show')){
                            el.classList.remove('show');
                        }else{
                            el.classList.add('show');
                        }
                    }
                }
                e.preventDefault();
            }
        });
    }

    render(show, selectedElement){
        let main = 
            <Canvas style={{display: (show ? 'flex' : 'none') }}> 
                <iframe id="preview-canvas" className="canvas" style={this.getStyle()}></iframe>
            </Canvas>;
        return main;
    }

    onSelectElement(el, selectedElement, collapsed){
        let result = {el: null, collapsed: collapsed};
        return result;
    }

    htmlCleaning(){
        super.htmlCleaning(this.iFrame.document);
        
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