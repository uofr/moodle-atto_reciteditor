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
import { Nav, Card, Navbar, Button } from 'react-bootstrap';
import {faMobileAlt, faTabletAlt, faTh, faLaptop, faDesktop, faFileWord, faEye, faCode, faAngleRight, faAngleDown, faSave, faRedo, faUndo, faColumns} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {TreeView, CanvasElement, ComponentProperties, VisualComponentList, Assets, Templates, HistoryManager, Utils, i18n, DesignerState, PreviewState, SourceCodeDesignerState, SourceCodeState} from '../RecitEditor';
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
                        <img alt="RÉCIT" src={Assets.RecitLogo} width="30" height="30" className="d-inline-block align-top" />{' '}
                        {i18n.get_string('pluginname')}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            {this.props.options.wordProcessor && <Nav.Link eventKey="wordbuilder"><FontAwesomeIcon icon={faFileWord} title={i18n.get_string('texteditor')}/></Nav.Link>}
                        </Nav>
                        
                        <Nav className="mr-auto"></Nav>

                        <Nav className="mr-auto" activeKey={this.state.view}>
                            <Nav.Link eventKey="designer" ><FontAwesomeIcon icon={faTh} title={i18n.get_string('canvas')}/></Nav.Link>
                            <Nav.Link eventKey="preview" ><FontAwesomeIcon icon={faEye} title={i18n.get_string('preview')}/></Nav.Link>
                            <Nav.Link eventKey="sourceCode"><FontAwesomeIcon icon={faCode} title={i18n.get_string('sourcecode')}/></Nav.Link>
                            <Nav.Link eventKey="sourceCodeDesigner"><FontAwesomeIcon icon={faColumns} title={i18n.get_string('sourcecodedesigner')}/></Nav.Link>
                        </Nav>

                        {(this.state.view == 'designer' || this.state.view == 'sourceCodeDesigner') && <>
                            <Nav>
                                <Nav.Link eventKey="undo"><FontAwesomeIcon icon={faUndo} title={i18n.get_string('undo')}/></Nav.Link>
                                <Nav.Link eventKey="redo"><FontAwesomeIcon icon={faRedo} title={i18n.get_string('redo')}/></Nav.Link>
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
                        <Button variant="success" size="sm"  onClick={this.onSaveAndClose}><FontAwesomeIcon icon={faSave} title={i18n.get_string('save')}/> {i18n.get_string('save')}</Button>
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
        else if(['designer', 'preview', 'sourceCode', 'sourceCodeDesigner'].includes(eventKey)){
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

        let designer = new DesignerState(this, this.props.historyManager);
        let sourceCode = new SourceCodeState(this)
        this.canvasState = {
            designer: designer,
            preview: new PreviewState(this),
            sourceCode: sourceCode,
            sourceCodeDesigner: new SourceCodeDesignerState(this, designer, sourceCode)
        }

        this.state = {
            canvasState: 'designer',
            selectedElement: null,
            collapsed: {components: false, properties: true, treeView: true}
        };
    }

    componentDidMount(){
        this.setData(this.props.content);
        this.props.historyManager.addHistoryItem(this.props.content);
        this.loadTemplates();
        document.body.onkeyup = this.onKey;
    }

    loadTemplates(){
        let p = Templates.onLoad();
        let that = this;
        
        p.then((webApiResult) => {
            if(!webApiResult.error){
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
            let data = "";
            if (prevProps.view == 'sourceCodeDesigner'){
                data = this.canvasState.designer.getData(true);
            }else{
                data = this.canvasState[prevProps.view].getData();
            }
            this.setData(data, this.state.selectedElement);
            let view = this.props.view;
            this.setState({canvasState: view},  this.onCollapse);
        }

        if(prevProps.content !== this.props.content){
            this.setData(this.props.content);
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
                            {i18n.get_string('components')}
                        </Card.Header>
                        <Card.Body data-collapsed={(this.state.collapsed.components ? 1 : 0)} style={{height: panelHeight}}>
                            <VisualComponentList onDragEnd={this.onDragEnd} onSaveTemplate={this.onSaveTemplate}/>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header onClick={() => this.setCollapse('properties')}>
                            <FontAwesomeIcon className="mr-1" icon={(this.state.collapsed.properties ? faAngleRight : faAngleDown)}/> {i18n.get_string('proprieties')}
                        </Card.Header>
                        <Card.Body className="properties"  data-collapsed={(this.state.collapsed.properties ? 1 : 0)}  style={{height: panelHeight}}>
                            <ComponentProperties onInsertNode={this.onInsertNode} onDeleteElement={this.onDeleteElement} element={this.state.selectedElement}/>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header onClick={() => this.setCollapse('treeView')}>
                            <FontAwesomeIcon className="mr-1" icon={(this.state.collapsed.treeView ? faAngleRight : faAngleDown)}/> {i18n.get_string('tree')}
                        </Card.Header>
                        <Card.Body data-collapsed={(this.state.collapsed.treeView ? 1 : 0)}  style={{height: panelHeight}}>
                            <TreeView data={this.canvasState.designer.getBody()} onSelect={this.onSelectElement} selectedElement={this.state.selectedElement} view={this.props.view}
                                    onDeleteElement={this.onDeleteElement} onMoveNodeUp={this.onMoveNodeUp} onMoveNodeDown={this.onMoveNodeDown} />
                        </Card.Body>
                    </Card>
                </div>
                
                <div className="center-area">
                    <div className='row'>
                        {this.canvasState.sourceCodeDesigner.render(this.props.view, this.state.selectedElement)}
                        {this.canvasState.preview.render(this.props.view === 'preview', this.state.selectedElement)} 
                    </div>
                </div>
            </div>;
           

        return main;
    }

    onContentChange(data, origin){
        this.canvasState[this.state.canvasState].onContentChange(data, origin);
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

    onCollapse(){
        let collapsed = this.canvasState[this.state.canvasState].onCollapse(this.state.collapsed);
        this.setState({collapsed: collapsed});
    }

    setCollapse(attr){
        let data = this.state.collapsed;
        data[attr] = !data[attr];
        this.setState({collapsed: data});
    }

    getCollapse(){
        return this.state.collapsed;
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
            if(!webApiResult.error){
                that.loadTemplates();                
            }
            else{
                alert(`Error: ${webApiResult.msg}`);
        }
        });
    }
}
