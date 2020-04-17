import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.scss';
import { Navbar, Nav, Card, Accordion, Button, Tab, Form} from 'react-bootstrap';

import { Options } from './Options';


class Data
{
	static HtmlElements = []
}

class Global{
    static lastId = 1;

    static getNextId(){ return Global.lastId++; }
}

export default class App extends Component{
	render(){
		let main = <MainView/>;

		return (main);
	}
}

class MainView extends Component
{
	render(){
		let main = 
			<div className="MainView">
				<AppNarBar/>
				<VisualBuilder/>
			</div>;
		return (main);
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

class VisualBuilder extends Component
{
    constructor(props){
        super(props);

        this.onSelectTab = this.onSelectTab.bind(this);
        this.onSelectAccordion = this.onSelectAccordion.bind(this);
        this.onAddElement = this.onAddElement.bind(this);
        this.onSelectSlot = this.onSelectSlot.bind(this);

        this.state = {selectedSlot: null, draggingElement: null, activeAccordion: "1", activeTab: 0};
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
                                <RawElementList  onSelect={this.onAddElement}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="2">Proprietés</Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                                <HtmlProperties selectedSlot={this.state.selectedSlot}/>
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
                                <VisualEditionMode draggingElement={this.state.draggingElement} selectedSlot={this.state.selectedSlot} 
                                        onSelectSlot={this.onSelectSlot} onFillInSlot={this.onFillInSlot}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="1">
                                Rendu...
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
}

class VisualEditionMode extends Component
{
    static defaultProps = {
        draggingElement: null,
        selectedSlot: null,
        onSelectSlot: null
    };
      
    constructor(props){
        super(props);

        this.state = {};
    }
	
	render(){
		let main = 
            <div className="visual-edition-mode">
                <VisualSlot draggingElement={this.props.draggingElement} selectedSlot={this.props.selectedSlot} onSelect={this.props.onSelectSlot}/>
            </div>;

		return (main);
    }
}

class VisualSlot extends Component
{
    static defaultProps = {
        selectedSlot: null,
        draggingElement: null,
        onSelect: null
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
        if(this.state.data.content === null){ return null;}

        let result = null;

        switch(this.state.data.content.name){
            case "div": 
                result = <DivElement slotProps={this.props}/>;
                break;
            case "img":
                result = <ImgElement />;
                break;
            default:
                result = null;
        }

        return result;
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
        slotProps: null
    };
    
	render(){
		return null;
    }
}

class DivElement extends VisualElement{
    constructor(props){
        super(props);
    }

   /* renderChildren() {       
        let that = this;
        return React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {createSlot: that.props.createSlot});
        });
    }*/

    render(){
        let main =
                <div>
                    <VisualSlot {...this.props.slotProps}/>
                    {this.props.children}
                    <VisualSlot onSelect={this.props.slotProps.onSelect} selectedSlot={this.props.slotProps.selectedSlot}  draggingElement={this.props.slotProps.draggingElement}/>
                </div>;
        
        return main;
    }
}

class HtmlProperties extends Component{
    static defaultProps = {
        selectedSlot: null,
    };

    render(){
        if(this.props.selectedSlot === null){ return null; }
        
        if(this.props.selectedSlot.content === null){ return null; }
        
        let properties = this.props.selectedSlot.content.properties;
        let main =
                <Form>
                    {properties.map((item, index) => {
                        let htmlProp = Data.htmlElemProperties[item.name];

                        let formItem = 
                            <Form.Group size="sm" key={index} controlId={`formitem${index}`}>
                                <Form.Label>{htmlProp.text}</Form.Label>
                                <Form.Control type={htmlProp.input.type} placeholder="" value={item.value} />
                            </Form.Group>;
                    
                        return (formItem);
                })}
                </Form>
        return main;
    }
}

class ImgElement extends VisualElement{
    static defaultProps = {
        style: null,
        src: "",
        alt: "aa"
    };

    render(){
        let main = <img style={this.props.style} src={this.props.src} alt={this.props.alt}/>;
        
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

Data.htmlElemProperties = {
    alt: {name: "alt", text: "Alt", input:{type: 'text'}}
};


Data.HtmlElements.push({name: "div"}, {name: "img", properties: [{name: "alt", value: ""}]});