import React, { Component } from 'react';
import { Nav, Card, Accordion, Button, Tab, Form} from 'react-bootstrap';
import {JsNx} from "../libs/utils/Utils";

class Global{
    static lastId = 1;

    static getNextId(){ return Global.lastId++; }
}

class Data
{
	static HtmlElements = []
}

Data.htmlElemProperties = {
    alt: {name: "alt", text: "Alt", input:{type: 'text'}},
    src: {name: "src", text: "source", input:{type: 'text'}}
};


Data.HtmlElements.push({name: "div"}, {name: "img", properties: [{name: "alt", value: ""}, {name: "src", value: ""}]});


export class VisualHTMLBuilder extends Component
{
    static defaultProps = {
        input: ""
    };

    constructor(props){
        super(props);

        this.onSelectTab = this.onSelectTab.bind(this);
        this.onSelectAccordion = this.onSelectAccordion.bind(this);
        this.onAddElement = this.onAddElement.bind(this);
        this.onSelectSlot = this.onSelectSlot.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.onSetRoot = this.onSetRoot.bind(this);

        this.state = {selectedSlot: null, draggingElement: null, activeAccordion: "1", activeTab: 0, rootData: null};
    }

	render(){
		let main = 
			<div className="visual-builder">
                <Accordion activeKey={this.state.activeAccordion}  onSelect={this.onSelectAccordion} className="left-area">
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">Arborescence</Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body></Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">Elements</Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <RawElementList onSelect={this.onAddElement}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="2">Proprietés</Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                                <HtmlProperties selectedSlot={this.state.selectedSlot} onDataChange={this.onDataChange}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <div className="center-area" >
                    <Tab.Container id="tabCenter" activeKey={this.state.activeTab}  onSelect={this.onSelectTab}>
                        <Nav justify variant="tabs" defaultActiveKey="0">
                            <Nav.Item>
                                <Nav.Link eventKey="0">Édition</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="1">Rendu</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content style={{height:"100%"}}>
                            <Tab.Pane eventKey="0" style={{height:"100%"}}>
                                <VisualEditionMode>
                                    <VisualSlot draggingElement={this.state.draggingElement} selectedSlot={this.state.selectedSlot} 
                                                    onSelect={this.onSelectSlot} onSetRoot={this.onSetRoot}/>
                                </VisualEditionMode>
                            </Tab.Pane>
                            <Tab.Pane eventKey="1">
                                <VisualPreview rootNode={this.state.rootNode}/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>;

		return (main);
    }

    onSelectAccordion(eventKey){
        this.setState({activeAccordion: eventKey});
    }

    onSelectTab(eventKey){
        this.setState({activeTab: eventKey});
    }

    onAddElement(data){
        this.setState({selectedSlot: null, draggingElement: data});
    }

    onSelectSlot(slot){
        this.setState({selectedSlot: slot, draggingElement: null, activeAccordion: (slot !== null ? "2" : "1")});
    }

    onDataChange(event, iItem){
        let selectedSlot = this.state.selectedSlot;
        selectedSlot.content.properties[iItem].value = event.target.value;
        this.setState({selectedSlot: selectedSlot});
    }

    onSetRoot(rootNode){
        this.setState({rootNode: rootNode});
    }

    convertInput(){
        
    }
}

class VisualEditionMode extends Component
{
    static defaultProps = {
        children: null
    };
      
	render(){
		let main = 
            <div className="visual-edition-mode">
                {this.props.children}
            </div>;

		return (main);
    }
}

class VisualPreview extends Component{
    static defaultProps = {
        rootNode: null
    };

    render(){
		let main = 
            <div className="visual-preview">
               {VisualElement.createElement(this.props.rootNode, null)}
            </div>;

		return (main);
    }
}

class VisualSlot extends Component
{
    static defaultProps = {
        selectedSlot: null,
        draggingElement: null,
        onSelect: null,
        onSetRoot: null
    };
    
    constructor(props){
        super(props);

        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onClick = this.onClick.bind(this);

        this.state = {hovering: 0, data: {id: Global.getNextId(), content: null}};
    }
	
	render(){
        let selected = (this.isSelected() ? 1 : 0);

		let main = 
            <div className={this.getClassName()} data-id={this.state.data.id} data-hovering={this.state.hovering} onClick={this.onClick} data-selected={selected}
                onDragOver={this.onDragOver} onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave}>
                {this.createContent()}
            </div>;
        return main;
    }

    createContent(){        
        return VisualElement.createElement(this.state.data.content, this.props);
    }

    isEmpty(){
        return (this.state.data.content === null);
    }

    isSelected(){
        if(this.props.selectedSlot === null){ return false; }
        
        return (this.props.selectedSlot.id === this.state.data.id);
    }

    onClick(event){        
        event.stopPropagation();

        this.props.onSelect((this.isSelected() ? null : this.state.data));
    }

    onDragEnter(event){
        if(!this.isEmpty()){ return; }
        event.stopPropagation(); 
        this.setState({hovering: 1});
    }
    
    onDragLeave(event){
        if(!this.isEmpty()){ return; }
        event.stopPropagation(); 
        this.setState({hovering: 0});
    }
    
    onDrop(event){
        if(!this.isEmpty()){ return; }
        
        // it needs to stop propagation otherwise it will dispatch onFillInSlot in cascade. We want just assign a section to one single slot.
        event.stopPropagation();   
        
        let data = this.state.data;
        data.content = this.props.draggingElement;
        this.setState({hovering: 0, data: data});

        if(this.props.onSetRoot !== null){
            this.props.onSetRoot(data.content);
        }
    } 
    
    onDragOver(event){
        if(!this.isEmpty()){ return; }
        event.preventDefault(); // Necessary to allows us to drop.
    }

    getClassName(){
        //return (this.isEmpty() ? "slot" : "");
        return `slot ` + (this.isEmpty() ? "empty" : "");
    }
}

class VisualElement extends Component
{
    static defaultProps = {
        children: null,
        editingMode: false,
        slotProps: null,
        properties: []
    };
    
    static createElement(data, slotProps){
        if(data === null){ return null;}

        let editingMode = (slotProps === null);
        let result = null;

        switch(data.name){
            case "div": 
                result = <DivElement slotProps={slotProps} editingMode={editingMode}/>;
                break;
            case "img":
                result = <ImgElement properties={data.properties}/>;
                break;
            default:
                result = null;
        }

        return result;
    }

	render(){
		return null;
    }
}

class DivElement extends VisualElement{
    render(){
        let main =
                <div>
                    {this.props.editingMode && <VisualSlot {...this.props.slotProps}/>}
                    {this.props.children}
                    {this.props.editingMode && <VisualSlot {...this.props.slotProps}/>}
                </div>;
        
        return main;
    }
}

class HtmlProperties extends Component{
    static defaultProps = {
        selectedSlot: null,
        onDataChange: null
    };

    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    render(){
        if(this.props.selectedSlot === null){ return null; }
        
        if(this.props.selectedSlot.content === null){ return null; }
        
        let properties = this.props.selectedSlot.content.properties || null;

        if(properties === null){ return null;}
        let main =
                <Form>
                    {properties.map((item, index) => {
                        let htmlProp = Data.htmlElemProperties[item.name];

                        let formItem = 
                            <Form.Group size="sm" key={index} controlId={`formitem${index}`}>
                                <Form.Label>{htmlProp.text}</Form.Label>
                                <Form.Control type={htmlProp.input.type} placeholder="" value={item.value} onChange={(event) => this.onChange(event, index)}/>
                            </Form.Group>;
                    
                        return (formItem);
                })}
                </Form>
        return main;
    }

    onChange(event, iItem){
        this.props.onDataChange(event, iItem);
    }
}

class ImgElement extends VisualElement{
    render(){
        let src = JsNx.getItem(this.props.properties, 'name', 'src') || "";
        let alt = JsNx.getItem(this.props.properties, 'name', 'alt');

        let main = <img src={src.value} alt={alt.value}/>;
        
        return main;
    }
}

class RawElementList extends Component{
    static defaultProps = {
        onSelect: null
    };

    render(){
        let main =
            <div className='raw-element-list'>
                {Data.HtmlElements.map((item, index) => {
                    return (<RawElement key={index} data={item} onSelect={this.props.onSelect}/>);
                })}
            </div>;

        return main;
    }
}

class RawElement extends Component
{
    static defaultProps = {
        data: null,
        onSelect: null
    };
    
    constructor(props){
        super(props);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this.state = {dragging: 0};
    }
	
	render(){
		let main = 
            <div className="raw-element" draggable="true" onDragStart={this.onDragStart}  onDragEnd={this.onDragEnd} data-dragging={this.state.dragging}>
                {this.props.data.name}
            </div>;

		return main;
    }
    
    onDragStart(event){
        this.setState({dragging: 1});
        this.props.onSelect(this.props.data);
    }
    
    onDragEnd(event){
        this.setState({dragging: 0});
        this.props.onSelect(null);
    }
}