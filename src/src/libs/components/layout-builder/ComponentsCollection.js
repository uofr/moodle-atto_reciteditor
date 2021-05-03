import React, { Component } from 'react';
import { Form, Row, Col, Nav, ButtonToolbar, ButtonGroup, Button  } from 'react-bootstrap';
import { faUpload, faDownload, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { ToggleButtons, InputNumber, InputText} from '../Components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {HTMLElementData} from './HTMLElementData';

export class ComponentProperties extends Component{
    static defaultProps = {
        element: null
    };

    constructor(props){
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
    }

    render(){
        if(this.props.element === null){ return null; }
        
        let componentData = HTMLElementData.getElement(this.props.element.tagName.toLowerCase());

        if(componentData === null){ return null;}

        let properties = HTMLElementData.propertyList.filter(item => componentData.properties.includes(item.name));

        
        if((properties === null) || (properties.length === 0)){ return null; }
        
        let main =
                properties.map((item, index) => {
                    let form = 
                    <Form key={index} onSubmit={this.onSubmit}>
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
        let value = data.getValue(this.props.element, data);
        
        switch(data.input.type){
            case 'radio':
                result = <ToggleButtons type="radio" name={data.name} value={value} bsSize="sm" defaultValue={value}
                                options={data.input.options} onChange={(event) => this.onDataChange(event, data)}/>;
                break;
            case 'text':
                result = <InputText name={data.name} value={value} size="sm"
                                onChange={(event) => this.onDataChange(event, data)} />;
                break;
            case 'number':
                result = <InputNumber name={data.name} value={value} size="sm"
                                onChange={(event) => this.onDataChange(event, data)} onCommit={(event) => this.onDataCommit(event, data, this.props.element)}/>;
                break;
        }

        return result;
    }

    onDataChange(event, componentData){
        if (componentData.input.onChange){
            componentData.input.onChange(this.props.element, event.target.value, componentData);
            this.forceUpdate();
        }
    }

    onSubmit(event){
        event.preventDefault();
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
        onImportCustomComponent: null,
        onDragEnd: null
    };
  
    constructor(props){
        super(props);


        this.onSelectTab = this.onSelectTab.bind(this);

        this.state = {tab: '0'};
    }

    render(){
        let main =
            <div className='component-list'>
                <Nav variant="tabs" activeKey={this.state.tab} onSelect={this.onSelectTab}>
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
                
                {this.state.tab === "0" && <TokenList dataProvider={HTMLElementData.elementList} onDragEnd={this.props.onDragEnd}/>}

                {this.state.tab === "1" && 
                                <TokenList dataProvider={this.props.customHtmlComponentList} onDeleteCustomComponent={this.props.onDeleteCustomComponent} 
                                onImportCustomComponent={this.props.onImportCustomComponent} onDragEnd={this.props.onDragEnd} showMenu={true}/>}
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
        onImportCustomComponent: null,
        showMenu: false
    };

    constructor(props){
        super(props);

        this.onImport = this.onImport.bind(this);
        this.onExport = this.onExport.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.showImport = this.showImport.bind(this);

        this.state = {showMenu: false, showImport: false};

        this.fileInput = React.createRef();
    }

    render(){
        let main =
            <div className="tab-content">
                {this.props.showMenu && 
            <div>
                    <ButtonToolbar style={{justifyContent: 'flex-end'}}>
                        <ButtonGroup >
                                <Button onClick={() => this.showImport(!this.state.showImport)}><FontAwesomeIcon  icon={faUpload} title="Importer la collection"/></Button>
                                <Button onClick={this.onExport} ><FontAwesomeIcon  icon={faDownload} title="Exporter la collection"/></Button>
                            <Button onClick={() => this.showMenu(!this.state.showMenu)} variant={(this.state.showMenu ? 'warning' : 'primary')}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                        {this.state.showImport && <input type="file" onChange={this.onImport} accept=".json"/>}
                    </div>
                }
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

    showImport(show){
        this.setState({showImport: show});
    }

    onImport(event){
        let fileCtrl = event.target;
        
        if(fileCtrl.length === 0) { return;}
    
        let reader = new FileReader();
        let that = this;
		reader.addEventListener('load', function(e) {
            let content = (e.target.result);
            that.props.onImportCustomComponent(content);
            that.showImport(false);
        });
		reader.readAsText(fileCtrl.files[0]);
    }

    onExport(){
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.dataProvider));
        let node = document.createElement('a');
        node.setAttribute("href",     dataStr);
        node.setAttribute("download", "my-collection.json");
        window.document.body.appendChild(node); // required for firefox
        node.click();
        node.remove();
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
