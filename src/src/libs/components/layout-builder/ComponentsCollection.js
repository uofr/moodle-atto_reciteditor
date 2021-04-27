import React, { Component } from 'react';
import { Form, Row, Col, Nav, ButtonToolbar, ButtonGroup, Button  } from 'react-bootstrap';
import { faRemoveFormat, faAlignLeft, faAlignCenter, faAlignRight, faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { ToggleButtons} from '../Components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class ComponentProperties extends Component{
    static defaultProps = {
        element: null
    };

    static data = [
        {
            name: 'text', description: 'Text Options', 
            children: [
                {
                    name: 'alignment', 
                    text: 'Alignement',
                    input: { 
                        type: 'radio', 
                        options:[
                            {text: <FontAwesomeIcon icon={faRemoveFormat} title="Défaut"/>, value:'default'},
                            {text: <FontAwesomeIcon icon={faAlignLeft} title="Left"/>, value:'text-left' },
                            {text: <FontAwesomeIcon icon={faAlignCenter} title="Center"/>, value:'text-center' },
                            {text: <FontAwesomeIcon icon={faAlignRight} title="Right"/>, value:'text-right' }
                        ],
                        defaultValue: ['default'],
                        onChange: function(el, value, data){
                            if(el.classList.length > 0){
                                for(let option of data.input.options){
                                    el.classList.remove(option.value);
                                }
                            }
                            
                            if(data.input.defaultValue.join() === value){
                                return;
                            }

                            el.classList.add(value)
                        }
                    }
                }
            ]
        }
    ];

    constructor(props){
        super(props);

        this.onDataChange = this.onDataChange.bind(this);

        this.state = {properties: {}};
    }

    componentDidUpdate(prevProps, prevState){
        if((this.props.element === null) || (prevProps.element === null)){
            return;
        }

        if(this.props.element.tagName !== prevProps.element.tagName){
            this.setState({properties: {}});
        }
    }

    render(){
        if(this.props.element === null){ return null; }
        
        let componentData = VisualComponentList.getComponent(this.props.element.tagName.toLowerCase());

        if(componentData === null){ return null;}

        let properties = ComponentProperties.data.filter(item => componentData.properties.includes(item.name));

        if((properties === null) || (properties.length === 0)){ return null; }

        let main =
                properties.map((item, index) => {
                    let form = 
                    <Form key={index}>
                        <h6>{item.description}</h6>
                        {item.children.map((item2, index2) => {
                            let formItem = 
                                <Form.Group size="sm" key={index2} as={Row}  controlId={`formitem${index2}`}>
                                    <Form.Label column sm="4">{item2.text}</Form.Label>
                                    <Col sm="8">
                                        {this.createFormControl(item2)}
                                    </Col>
                                </Form.Group>;

                            return (formItem);
                        })}
                    </Form>

                    return form;
                });
                
        return main;
    }

    createFormControl(data){
        let result = null;
        
        switch(data.input.type){
            case 'radio':
                let value = (this.state.properties[data.name] ? this.state.properties[data.name] : data.input.defaultValue);
                result = <ToggleButtons type="radio" name={data.name} defaultValue={value} 
                                options={data.input.options} onChange={(event) => this.onDataChange(event, data, this.props.element)}/>;
                break;
        }

        return result;
    }

    onDataChange(event, componentData, element){
        let properties = this.state.properties;
        properties[event.target.name] = event.target.value;
        this.setState({properties: properties}, componentData.input.onChange(this.props.element, event.target.value, componentData));
    }
}

export class VisualComponentList extends Component{
    static defaultProps = {
        customHtmlComponentList: [],
        onDragEnd: null
    };

    static htmlElementList = [
        {name: 'Text', children: [
            {name: "Heading", type: 'native', tagName: 'h1', properties: ['text']},
            {name: "Paragraph", type: 'native', tagName: 'p', properties: ['text']}
        ]},
        {name: 'Controls', children: [
            {name: "Button", type: 'native', tagName: 'button', classList: ['btn', 'btn-primary'], properties: []}
        ]},
        {name: 'Containers', children: [
            {name: "Div", type: 'native', tagName: 'div', properties: []}
        ]},
    ];

    static getComponent(tagName){
        for(let section of VisualComponentList.htmlElementList){
            for(let item of section.children){
                if(item.tagName === tagName){
                    return item;
                }
            }
        }

        return null;
    }

    constructor(props){
        super(props);

        this.onSelectTab = this.onSelectTab.bind(this);

        this.state = {tab: '0'};
    }

    render(){
        let main =
            <div className='component-list'>
                <Nav variant="pills" activeKey={this.state.tab} onSelect={this.onSelectTab}>
                    <Nav.Item>
                        <Nav.Link eventKey="0">Base HTML</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="1">Mes composants</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="2">Mes gabarits</Nav.Link>
                    </Nav.Item>
                </Nav>
                <br/>
                {this.state.tab === "0" && <TokenList dataProvider={VisualComponentList.htmlElementList} onDragEnd={this.props.onDragEnd}/>}

                {this.state.tab === "1" && <TokenList dataProvider={this.props.customHtmlComponentList} onDragEnd={this.props.onDragEnd}/>}
            </div>;

        return main;
    }

    onSelectTab(k){
        this.setState({tab: k});
    }
}

class TokenList extends Component{
    static defaultProps = {
        dataProvider: [],
        onDragEnd: null
    };

    constructor(props){
        super(props);

        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onHover = this.onHover.bind(this);

        this.state = {showMenu: -1};
    }

    render(){
        let main =
            this.props.dataProvider.map((item, index) => {
                let branch = 
                    <ul key={index}>
                        <li key={index} className='token-section' onMouseEnter={() => this.onHover(index)} onMouseLeave={() => this.onHover(-1)}>
                            {item.name}
                            {this.state.showMenu === index &&
                                <ButtonToolbar style={{marginLeft: "1rem", display: "inline-flex"}}>
                                    <ButtonGroup size="sm">
                                        <Button onClick={this.onEdit}><FontAwesomeIcon  icon={faEdit} title="Éditer"/></Button>
                                        <Button onClick={this.onDelete}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                            }   
                        </li>
                        {item.children.map((item2, index2) => {
                            return (<Token data={item2} key={index2} onDragEnd={this.props.onDragEnd}/>);
                        })}
                    </ul>

                return (branch);
            });

        return main;
    }

    onHover(index){
        this.setState({showMenu: index});
    }

    onEdit(){

    }

    onDelete(){

    }
}

class Token extends Component
{
    static defaultProps = {
        data: null,
        onDragEnd: null
    };
    
    constructor(props){
        super(props);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }
	
	render(){
		let main = 
            <li className="token" draggable="true" onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
                {this.props.data.name}                
            </li>;

		return main;
    }
    
    onDragStart(event){
        event.dataTransfer.setData("componentData", JSON.stringify(this.props.data));
    }
    
    onDragEnd(event){
        this.props.onDragEnd();
    }
}
