import React, { Component } from 'react';
import { Form, Row, Col, Nav, ButtonToolbar, ButtonGroup, Button  } from 'react-bootstrap';
import { faRemoveFormat, faAlignLeft, faAlignCenter, faAlignRight, faUpload, faDownload, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { ToggleButtons, InputNumber, InputText} from '../Components';
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
                    text: 'Alignment',
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
                    },
                    getValue: function(el, data){
                        for(let option of data.input.options){
                            if (el.classList.contains(option)){
                                return option;
                            }
                        }
                        return false;
                    }
                },
            ]
        },
        {
            name: 'link', description: 'Link Options', 
            children: [
                {
                    name: 'href', 
                    text: 'Link',
                    input: { 
                        type: 'text', 
                        defaultValue: ['#'],
                        onCommit: function(el, value, data){
                            el.href = value;
                        }
                    },
                    getValue: function(el){
                        return el.href;
                    }
                },
                {
                    name: 'target', 
                    text: 'Action du lien',
                    input: { 
                        type: 'radio', 
                        options:[
                            {text: "Même page", value:'_self'},
                            {text: "Nouvelle onglet", value:'_blank' },
                        ],
                        defaultValue: ['_self'],
                        onChange: function(el, value, data){
                            el.target = value;
                        }
                    },
                    getValue: function(el){
                        return el.target;
                    }
                },
            ]
        },
        {
            name: 'audio', description: 'Audio Options', 
            children: [
                {
                    name: 'src', 
                    text: 'Source de l\'audio',
                    input: { 
                        type: 'text', 
                        defaultValue: [''],
                        onCommit: function(el, value, data){
                            el.src = value;
                        }
                    },
                    getValue: function(el){
                        return el.src;
                    }
                },
            ]
        },
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
        let value = (data.getValue(this.props.element, data) ? data.getValue(this.props.element, data) : data.input.defaultValue);
        
        switch(data.input.type){
            case 'radio':
                result = <ToggleButtons type="radio" name={data.name} value={value} 
                                options={data.input.options} onChange={(event) => this.onDataChange(event, data, this.props.element)}/>;
                break;
            case 'text':
                result = <InputText name={data.name} value={value} 
                                options={data.input.options} onChange={(event) => this.onDataChange(event, data, this.props.element)} onCommit={(event) => this.onDataCommit(event, data, this.props.element)}/>;
                break;
        }

        return result;
    }

    onDataChange(event, componentData, element){
        let properties = this.state.properties;
        properties[event.target.name] = event.target.value;
        if (componentData.input.onChange){
            this.setState({properties: properties}, componentData.input.onChange(this.props.element, event.target.value, componentData));
        }else{
            this.setState({properties: properties});
        }
    }

    onDataCommit(event, componentData, element){
        let properties = this.state.properties;
        properties[event.target.name] = event.target.value;
        if (componentData.input.onCommit){
            this.setState({properties: properties}, componentData.input.onCommit(this.props.element, event.target.value, componentData));
        }else{
            this.setState({properties: properties});
        }
    }
}

export class VisualComponentList extends Component{
    static defaultProps = {
        customHtmlComponentList: [],
        onDeleteCustomComponent: null,
        onDragEnd: null
    };

    static htmlElementList = [
        {name: 'Text', children: [
            {name: "Heading", type: 'native', tagName: 'h1', init:function(el){
                el.innerText = el.tagName.toLowerCase();
            }, properties: ['text']},

            {name: "Paragraph", type: 'native', tagName: 'p', init:function(el){
                el.innerText = el.tagName.toLowerCase();
            }, properties: ['text']}
        ]},
        {name: 'Controls', children: [
            {name: "Button", type: 'native', tagName: 'button', init:function(el){
                el.innerText = el.tagName.toLowerCase();
                el.classList.add('btn');
                el.classList.add('btn-primary');
            }, properties: ['text']},

            {name: "Link", type: 'native', tagName: 'a', init:function(el){
                el.innerText = el.tagName.toLowerCase();
                el.href = '#';
            }, properties: ['text', 'link']},

            {name: "Audio", type: 'native', tagName: 'audio', init:function(el){
                el.setAttribute('controls', '1')
            }, properties: ['audio']},
        ]},
        {name: 'Containers', children: [
            {name: "Div", type: 'native', tagName: 'div', properties: []},
            {name: "Séparateur", type: 'native', tagName: 'hr', properties: []}
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

        this.state = {tab: '1'};
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
                
                {this.state.tab === "0" && <TokenList dataProvider={VisualComponentList.htmlElementList} onDragEnd={this.props.onDragEnd}/>}

                {this.state.tab === "1" && 
                                <TokenList dataProvider={this.props.customHtmlComponentList} onDeleteCustomComponent={this.props.onDeleteCustomComponent} 
                                        onDragEnd={this.props.onDragEnd} showMenu={true}/>}
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
        onDragEnd: null,
        onDeleteCustomComponent: null,
        showMenu: false
    };

    constructor(props){
        super(props);

        this.showMenu = this.showMenu.bind(this);

        this.state = {showMenu: false};
    }

    render(){
        let main =
            <div>
                <br/>
                {this.props.showMenu && 
                    <ButtonToolbar style={{justifyContent: 'flex-end'}}>
                        <ButtonGroup >
                            <Button ><FontAwesomeIcon  icon={faUpload} title="Importer la collection"/></Button>
                            <Button ><FontAwesomeIcon  icon={faDownload} title="Exporter la collection"/></Button>
                            <Button onClick={() => this.showMenu(!this.state.showMenu)} variant={(this.state.showMenu ? 'warning' : 'primary')}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                }
                <br/>
                {this.props.dataProvider.map((item, index) => {
                    let branch = 
                        <ul key={index}>
                            <li key={index} className='token-section'>
                                {item.name}
                                {this.state.showMenu &&
                                    <ButtonToolbar style={{marginLeft: "1rem", display: "inline-flex"}}>
                                        <ButtonGroup size="sm">
                                            <Button onClick={() => this.props.onDeleteCustomComponent(item, 's')}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                }
                            </li>
                            {item.children.map((item2, index2) => {
                                return (<Token showMenu={this.state.showMenu} data={item2} key={index2} onDragEnd={this.props.onDragEnd} onDeleteCustomComponent={this.props.onDeleteCustomComponent}/>);
                            })}
                        </ul>

                    return (branch);
                })}
            </div>;

        return main;
    }

    showMenu(show){
        this.setState({showMenu: show});
    }
}

class Token extends Component
{
    static defaultProps = {
        data: null,
        onDragEnd: null,
        onDeleteCustomComponent: null,
        showMenu: false
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
                {this.props.showMenu && 
                    <ButtonToolbar style={{marginLeft: "1rem", display: "inline-flex"}}>
                        <ButtonGroup size="sm">
                            <Button onClick={() => this.props.onDeleteCustomComponent(this.props.data)}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                }             
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
