import React, { Component } from 'react';
import { Form, Row, Col, Nav, ButtonToolbar, ButtonGroup, Button  } from 'react-bootstrap';
import { faFile, faSave, faTrashAlt, faAngleRight, faAngleDown} from '@fortawesome/free-solid-svg-icons';
import { LayoutSpacingEditor, LayoutSpacing, MultipleSelect, ToggleButtons, InputColor, InputText, MinValueMax, ComboBox, TableActions} from '../Components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {HTMLElementData} from './HTMLElementData';
import { IconSelector } from '../iconSelector';
import { ColorSelector } from '../ColorSelector';
import { TemplateList, Templates } from './Templates';

export class ComponentProperties extends Component{
    static defaultProps = {
        element: null
    };

    constructor(props){
        super(props);

        this.onSelectTab = this.onSelectTab.bind(this);

        this.state = {tab: '0'};
    }

    render(){
        if(this.props.element === null){ return null; }
        
        let componentData = HTMLElementData.getElementData(null, this.props.element);

        if(componentData === null){ return null;}

        let properties = HTMLElementData.propertyList.filter(item => componentData.properties.includes(item.name));

        
        if((properties === null) || (properties.length === 0)){ return null; }
        
        properties.sort((el1, el2) => { 
            return componentData.properties.indexOf(el1.name) - componentData.properties.indexOf(el2.name)
        });

        let bootstrapProps = properties.filter(item => item.type === 'bootstrap');
        let styleAttr = properties.filter(item => item.type === 'styleattr');
        let attributes = properties.filter(item => item.type === 'htmlattr');

        let main = 
            <div>
                <Nav variant="tabs" activeKey={this.state.tab} onSelect={this.onSelectTab}>
                    <Nav.Item>
                        <Nav.Link eventKey="0">Bootstrap</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="1">Proprietés HTML</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="2">Style</Nav.Link>
                    </Nav.Item>
                </Nav>
                {this.state.tab === "0" && <FormProperties element={this.props.element} properties={bootstrapProps} />}
                {this.state.tab === "1" && <FormProperties element={this.props.element} properties={attributes} />}
                {this.state.tab === "2" && <FormProperties element={this.props.element} properties={styleAttr} />}
            </div>
                
                
        return main;
    }

    onSelectTab(k){
        this.setState({tab: k});
    }
}

class FormProperties extends Component{
    static defaultProps = {
        element: null,
        properties: []
    };

    constructor(props){
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.onCollapse = this.onCollapse.bind(this);

        this.state = {collapsed: {}}
    }
    
    render(){
        let main =
        <div className="tab-content">
            {this.props.properties.map((item, index) => {
                let collapsed = (typeof this.state.collapsed[item.name] === "undefined" ? false : this.state.collapsed[item.name]);
                
                let icon = collapsed ? faAngleRight : faAngleDown;

                let form = 
                <Form key={index} onSubmit={this.onSubmit} className="mb-4">
                    <h6  onClick={(event) => this.onCollapse(event, item.name)}><FontAwesomeIcon className="mr-1" icon={icon}/>{item.description}</h6>
                    {!collapsed && item.children.map((item2, index2) => {
                        let formItem = null;
                        
                        if((!item2.input.hasOwnProperty('flags')) || (item2.input.flags.showLabel)){
                            formItem = 
                            <Form.Group size="sm" key={index2} as={Row} style={{alignItems: "center"}}  controlId={`formitem${index}${index2}`}>
                                <Form.Label column sm="4">{item2.text}</Form.Label>
                                <Col sm="8">
                                    {this.createFormControl(item2)}
                                </Col>
                            </Form.Group>;
                            
                        }else{
                            formItem = 
                            <Form.Group size="sm" key={index2}  controlId={`formitem${index}${index2}`}>
                                {this.createFormControl(item2)}
                            </Form.Group>;
                        }

                        return (formItem);
                    })}

                </Form>

                return form;
            })}
        </div>;
            
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
            case 'minvaluemax':
                result = <MinValueMax valueName={data.name} values={value} size="sm"
                                onChange={(event) => this.onDataChange(event, data)} />;
                break;
            case 'color':
                result = <InputColor name={data.name} value={value} 
                                onBlur={(event) => this.onDataChange(event, data)} />;
                break;
            case 'combobox':
                result = <ComboBox name={data.name} value={value} options={data.input.options}
                                onChange={(event) => this.onDataChange(event, data)} />;
                break;
            case 'iconselector':
                result = <IconSelector name={data.name} value={value} text={data.input.text}
                                onChange={(event) => this.onDataChange(event, data)} />;
                break;
            case 'multipleselect':
                result = <MultipleSelect name={data.name} values={value} options={data.input.options} autoAdd={data.input.flags.autoAdd}
                                onChange={(event) => this.onDataChange(event, data)} />;
                break;
            case 'layoutspacingeditor':
                result = <LayoutSpacingEditor name={data.name} values={value}
                                onChange={(event) => this.onDataChange(event, data)} />;
                break;
            case 'layoutspacing':
                result = <LayoutSpacing name={data.name} value={value} options={data.input.options}
                                            onChange={(event) => this.onDataChange(event, data)} />;
                break;
            case 'colorselector':
                result = <ColorSelector name={data.name} value={value} options={data.input.options}
                                onChange={(event) => this.onDataChange(event, data)} />;
                break;
            case 'tableactions':
                result = <TableActions showRmCol={data.input.showRmCol}
                                onChange={(event) => this.onDataChange(event, data)} />;
                break;
           /* case 'number':
                result = <InputNumber name={data.name} value={value} size="sm"
                                onChange={(event) => this.onDataChange(event, data)} onCommit={(event) => this.onDataCommit(event, data, this.props.element)}/>;
                break;*/
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
    
    onCollapse(event, id){
        event.stopPropagation();
        event.preventDefault();

        let collapsed = this.state.collapsed;
        collapsed[id] = (typeof collapsed[id] === 'undefined' ? false : !collapsed[id]);
        this.setState({collapsed: collapsed});
    }
}

export class VisualComponentList extends Component{
    static defaultProps = {
        onDragEnd: null
    };
  
    constructor(props){
        super(props);

        this.onSelectTab = this.onSelectTab.bind(this);
        this.loadTemplates = this.loadTemplates.bind(this);

        this.state = {tab: '2'};
    }

    render(){
        let main =
            <div className='component-list'>
                <Nav variant="tabs" activeKey={this.state.tab} onSelect={this.onSelectTab}>
                    <Nav.Item>
                        <Nav.Link eventKey="2">Mes gabarits</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="1">Mes composants</Nav.Link>
                    </Nav.Item>                   
                    <Nav.Item>
                        <Nav.Link eventKey="0">Base HTML</Nav.Link>
                    </Nav.Item>
                </Nav>
                
                {this.state.tab === "0" && <TokenList dataProvider={HTMLElementData.elementList} onDragEnd={this.props.onDragEnd}/>}

                {this.state.tab === "1" && 
                                <TokenList2 dataProvider={Templates.componentList} onDragEnd={this.props.onDragEnd} onChange={this.loadTemplates}/>}

                {this.state.tab === "2" &&
                                <TemplateList dataProvider={Templates.layoutList} onDragEnd={this.props.onDragEnd} onChange={this.loadTemplates}/>}
            </div>;

        return main;
    }

    onSelectTab(k){
        this.setState({tab: k});
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
}

class TokenList extends Component{
    static defaultProps = {
        dataProvider: [],
        onDragEnd: null
    };

    constructor(props){
        super(props);

        this.onCollapse = this.onCollapse.bind(this);

        this.state = {collapsed: {}};
    }    

    render(){       
        let main =
            <div className="tab-content">
                {this.props.dataProvider.map((item, index) => {
                    let collapsed = ((typeof this.state.collapsed[item.name] !== "undefined") && (this.state.collapsed[item.name]));
                    let icon = collapsed ? faAngleRight : faAngleDown;

                    let branch = 
                        <ul key={index} className='mt-2'>
                            <li key={index} className='token-section' onClick={(event) => this.onCollapse(event, item.name)}>
                                <FontAwesomeIcon className="mr-1" icon={icon} />
                                {item.name}
                            </li>
                            {!collapsed && item.children.map((item2, index2) => {
                                return (<Token data={item2} key={index2} onDragEnd={this.props.onDragEnd} />);
                            })}
                        </ul>

                    return (branch);
                })}
            </div>;

        return main;
    }

    onCollapse(event, id){
        event.stopPropagation();
        event.preventDefault();

        let collapsed = this.state.collapsed;
        collapsed[id] = !collapsed[id] || false;
        this.setState({collapsed: collapsed});
    }
}

class TokenList2 extends Component{
    static defaultProps = {
        dataProvider: [],
        onDragEnd: null,
        onChange: null
    };

    constructor(props){
        super(props);

        this.onImport = this.onImport.bind(this);
        this.onExport = this.onExport.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.showImport = this.showImport.bind(this);
        this.onDelete = this.onDelete.bind(this);
       
        this.state = {showMenu: false, showImport: false, collapsed: {}};
    }    

    render(){       
        let main =
            <div className="tab-content">
                <div>
                    <ButtonToolbar style={{justifyContent: 'flex-end'}}>
                        <ButtonGroup >
                                <Button onClick={() => this.showImport(!this.state.showImport)}><FontAwesomeIcon  icon={faFile} title="Importer la collection"/></Button>
                                <Button onClick={() => this.showMenu(!this.state.showMenu)} variant={(this.state.showMenu ? 'warning' : 'primary')}><FontAwesomeIcon  icon={faSave} title="Exporter"/></Button>
                                <Button onClick={() => this.showMenu(!this.state.showMenu)} variant={(this.state.showMenu ? 'warning' : 'primary')}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                    {this.state.showImport && <input type="file" onChange={this.onImport} accept=".json"/>}
                    {this.state.showMenu && <Button onClick={(event) => this.onExport(event, this.props.dataProvider)}><FontAwesomeIcon  icon={faSave}/>{" Exporter la collection"}</Button>}
                </div>
                <ul className='mt-2'>
                    {this.props.dataProvider.map((item, index) => {
                        let ret = 
                            <Token showMenu={this.state.showMenu} data={item} key={index} onDragEnd={this.props.onDragEnd} 
                                                onExport={(event) => this.onExport(event, [item])} onDelete={this.onDelete}/>

                        return (ret);
                    })}
                </ul>
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
        let that = this;        
        let promise = Templates.onImport(fileCtrl);
        
        promise.then((webApiResult) => {
            if(webApiResult.success){
                that.showImport(false);
                that.props.onChange();
            }
            else{
                alert(`Error: ${webApiResult.msg}`);
            }
        },
        (err, response) => {
            console.log(err, response);
        });
    }

    onExport(event, item){
        item = item || [];
        event.stopPropagation();

        let dataStr = Templates.onExport(item);
        let node = document.createElement('a');
        node.setAttribute("href",     dataStr);
        node.setAttribute("download", (item.length === 1 ? `${item[0].name}.json` : "my-collection.json"));
        window.document.body.appendChild(node); // required for firefox
        node.click();
        node.remove();
    }

    onDelete(event, item){
        event.stopPropagation();

        let promise = Templates.onDelete(item);

        if(promise === null){ return;}

        let that = this;

        promise.then((webApiResult) => {
            if(webApiResult.success){
                that.props.onChange();
            }
            else{
                alert(`Error: ${webApiResult.msg}`);
            }
        },
        (err, response) => {
            console.log(err, response);
        });
    }
}

class Token extends Component
{
    static defaultProps = {
        data: null,
        onDragEnd: null,
        showMenu: false,
        onExport: null,
        onDelete: null
    };
    
    constructor(props){
        super(props);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }
	
	render(){
		let main = 
            <li className="token" data-type={this.props.data.type} draggable="true" onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
                {this.props.data.name}   
                {this.props.showMenu && 
                    <ButtonToolbar style={{marginLeft: "1rem", display: "inline-flex"}}>
                        <ButtonGroup size="sm">
                            <Button onClick={this.props.onExport}><FontAwesomeIcon  icon={faSave} title="Export"/></Button>
                            <Button onClick={(event) => this.props.onDelete(event, this.props.data)}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
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
