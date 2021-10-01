import React, { Component } from 'react';
import { Form, Row, Col, Nav, ButtonToolbar, ButtonGroup, Button, Modal  } from 'react-bootstrap';
import { faSave, faTrashAlt, faAngleRight, faAngleDown, faCloud, faTimes, faCloudUploadAlt, faCloudDownloadAlt, faCog} from '@fortawesome/free-solid-svg-icons';
import { LayoutSpacingEditor, LayoutSpacing, MultipleSelect, ToggleButtons, InputColor, InputText, MinValueMax, ComboBox, TableActions, ImageSrc, BtnUpload,  IconSelector,Assets, ColorSelector } from '../Components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {HTMLElementData} from './HTMLElementData';
import { Templates } from './Templates';

export class ComponentProperties extends Component{
    static defaultProps = {
        element: null,
        onInsertNode: null,
        onDeleteElement: null
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
                {this.state.tab === "0" && <FormProperties element={this.props.element} onInsertNode={this.props.onInsertNode} onDeleteElement={this.props.onDeleteElement} properties={bootstrapProps} />}
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
        properties: [],
        onInsertNode: null,
        onDeleteElement: null
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
                        
                        if((!item2.input.hasOwnProperty('flags')) || (typeof item2.input.flags.showLabel == "undefined" || item2.input.flags.showLabel)){
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
                result = <ColorSelector name={data.name} value={value} options={data.input.options} flags={data.input.flags}
                                onChange={(event) => this.onDataChange(event, data)} />;
                break;
            case 'buttongroup':
                result = 
                    <ButtonGroup>
                        {data.input.options.map((item, index) => {
                            let btn = <Button key={index} onClick={() => this.onClick(item)}>{item.text}</Button>;
                            return (btn);
                        })}
                    </ButtonGroup>
              
                break;
            case 'ImageSrc':
                result = <ImageSrc name={data.name} value={value} size="sm" onChange={(event) => this.onDataChange(event, data)}  />;
                break;
            case 'button':
                result = <Button onClick={() => this.onDataChange({target:{value:''}}, data)}>{data.input.text}</Button>
                break;
        }
  
       /* <TableActions showRmCol={data.input.showRmCol}
        onChange={(event) => this.onDataChange(event, data, true)} />;*/
        return result;
    }

    onDataChange(event, componentData){
        if (componentData.input.onChange){
            componentData.input.onChange(this.props.element, event.target.value, componentData);
            this.forceUpdate();
        }
    }

    onClick(item){
        let result = item.onClick(this.props.element);

        if(result.action === 'insert'){
            this.props.onInsertNode(result.nodes);
        }
        else if(result.action === 'delete'){
            this.props.onDeleteElement();
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
        onDragEnd: null,
        onSaveTemplate: null
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
                        <Nav.Link eventKey="2">Gabarits</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="1">Composants</Nav.Link>
                    </Nav.Item>                   
                    <Nav.Item>
                        <Nav.Link eventKey="0">HTML</Nav.Link>
                    </Nav.Item>
                </Nav>
                
                {this.state.tab === "0" && <TokenList dataProvider={HTMLElementData.elementList} onDragEnd={this.props.onDragEnd}/>}

                {this.state.tab === "1" && 
                                <TemplateList dataProvider={Templates.componentList} onDragEnd={this.props.onDragEnd} onChange={this.loadTemplates} type='c' />}

                {this.state.tab === "2" &&
                                <TemplateList dataProvider={Templates.layoutList} onDragEnd={this.props.onDragEnd} onChange={this.loadTemplates} onSaveTemplate={this.props.onSaveTemplate} type='l'/>}
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

class TemplateList extends Component{
    static defaultProps = {
        dataProvider: [],
        onDragEnd: null,
        onChange: null,
        type: 'c',
        onSaveTemplate: null
    };

    constructor(props){
        super(props);

        this.onImport = this.onImport.bind(this);
        this.onExport = this.onExport.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.showImport = this.showImport.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.showVitrine = this.showVitrine.bind(this);
        this.receiveMessageFromIframe = this.receiveMessageFromIframe.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onSaveTemplate = this.onSaveTemplate.bind(this);

        this.state = {showModal: false, showMenu: false, showImport: false, showVitrine: false, collapse: {} };
    }    

    componentDidMount(){
        window.addEventListener("message", this.receiveMessageFromIframe, false);
    }

    componentWillUnmount(){
        window.removeEventListener("message", this.receiveMessageFromIframe, false);
    }

    render(){       
        let that = this;
        let main =
            <div className="tab-content">
                <div>
                    <ButtonToolbar style={{justifyContent: 'flex-end'}}>
                        <ButtonGroup >
                                {this.props.type === 'l' && <Button onClick={() => this.showModal(true)}><FontAwesomeIcon  icon={faSave} title="Enregistrer un gabarit"/></Button>}
                                <BtnUpload id="import-collection"  accept=".json" onChange={this.onImport} title="Importer la collection"/>
                                {this.props.type === 'l' && <Button onClick={() => this.showVitrine(true)}><FontAwesomeIcon  icon={faCloud} title="Voir la vitrine de gabarits"/> Vitrine</Button>}
                                <Button onClick={() => this.showMenu(!this.state.showMenu)} variant={(this.state.showMenu ? 'warning' : 'primary')}><FontAwesomeIcon  icon={faCog} title="Options"/></Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                    {this.state.showMenu &&  this.props.type === 'c' && <Button onClick={(event) => this.onExport(event, this.props.dataProvider.myComponents)}><FontAwesomeIcon  icon={faCloudDownloadAlt}/>{" Exporter la collection"}</Button>}
                </div>
                {this.props.type === 'l' && 
                    <ul className='mt-2 d-flex flex-wrap justify-content-center'>
                        {this.props.dataProvider.map((item, index) => {
                            return (that.getToken(item, index, true));
                        })}
                    </ul>
                }
                {this.props.type === 'c' && <>
                    <span onClick={() => this.onCollapse('my')}>
                        <FontAwesomeIcon className="mr-1" icon={faAngleDown}/> Mes composants
                    </span>
                    <ul className='mt-2 d-flex flex-wrap'>
                    {!this.state.collapse['my'] && this.props.dataProvider.myComponents.map((item, index) => {
                        return (this.getToken(item, index, true));
                    })}
                    </ul>
                    <span onClick={() => this.onCollapse('base')}>
                        <FontAwesomeIcon className="mr-1" icon={faAngleDown}/> Composants de base
                    </span>
                    <ul className='mt-2 d-flex flex-wrap'>
                    {!this.state.collapse['base'] && this.props.dataProvider.components.map((item, index) => {
                        return (this.getToken(item, index, false));
                    })}
                </ul></>}
                {this.state.showVitrine && 
                    <Modal show={true} onHide={() => this.showVitrine(false)} backdrop="static" keyboard={false} className='templatevitrine'>
                        <Modal.Header closeButton>
                            <Modal.Title>Vitrine</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <iframe src={Assets.UrlVitrine}/>
                        </Modal.Body>
                    </Modal>
                }
                {this.state.showModal && <TemplateForm onClose={() => this.showModal(false)} onSave={this.onSaveTemplate}/>}
            </div>;

        return main;
    }
    
    onCollapse(id){
        let c = this.state.collapse;
        c[id] = !c[id];
        this.setState({collapse: c});
    }

    showModal(show){
        this.setState({showModal: show});
    }

    onSaveTemplate(data){
        this.props.onSaveTemplate(data.name, 'l');
        this.showModal(false);
    }

    showMenu(show){
        this.setState({showMenu: show});
    }

    showImport(show){
        this.setState({showImport: show});
    }

    onImport(event, data){
        let fileCtrl = (event !== null ? event.target : null);
        let that = this;        
        let promise = Templates.onImport(fileCtrl, data);
        
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

    showVitrine(show){
        this.setState({showVitrine: show});
    }

    getToken(item, index, editable){
        if(this.props.type === 'l'){
            return <TokenTemplate showMenu={this.state.showMenu} data={item} key={index} onDragEnd={this.props.onDragEnd} 
                        onExport={(event) => this.onExport(event, item)} onDelete={(event) => this.onDelete(event, item)}/>
        }
        else{
            return <Token showMenu={editable && this.state.showMenu} data={item} key={index} onDragEnd={this.props.onDragEnd} hoverimg={item.img}
                            onExport={(event) => this.onExport(event, item)} onDelete={(event) => this.onDelete(event, item)}/>
        }
    }

    receiveMessageFromIframe(event) {
        switch (event.data.message){
            case 'import':
                let data = [{name: event.data.value.name, htmlStr: event.data.value.htmlStr || event.data.value.htmlString || event.data.value.htmlstr, img: event.data.value.img || event.data.value.image, type: 'l'}];
                this.onImport(null, data);
                this.showVitrine(false);
                break;
        }
    }
}

class Token extends Component
{
    static defaultProps = {
        data: null,
        onDragEnd: null,
        showMenu: false,
        onExport: null,
        onDelete: null,
        hoverimg: null,
    };
    
    constructor(props){
        super(props);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.state = {imagePreview: false};
    }
	
	render(){
		let main = 
            <li className="token" data-type={this.props.data.type} draggable="true" onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}  onMouseEnter={() => this.onMouseEnter(this.props.hoverimg)} onMouseLeave={this.onMouseLeave} onMouseDown={this.onMouseLeave}>
                {this.props.data.name}   
                {this.props.showMenu && 
                    <ButtonToolbar style={{marginLeft: "1rem", display: "inline-flex"}}>
                        <ButtonGroup size="sm">
                            <Button onClick={this.props.onExport}><FontAwesomeIcon  icon={faCloudDownloadAlt} title="Exporter"/></Button>
                            <Button onClick={this.props.onDelete}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                }
                {this.state.imagePreview && 
                    <div className='templatepreview'>
                        <img src={this.state.imagePreview}/>
                </div>}   
            </li>;

		return main;
    }
    
    onDragStart(event){
        event.dataTransfer.setData("componentData", JSON.stringify(this.props.data));
    }
    
    onDragEnd(event){
        this.props.onDragEnd();
    }

    onMouseEnter(img){
        if (!img) return;
        this.setState({imagePreview: img});
    }

    onMouseLeave(){
        this.setState({imagePreview: false});
    }
}

class TokenTemplate extends Token{
    render(){       
        let item = this.props.data;

        let main =
                <div className='template' onMouseEnter={() => this.onMouseEnter(this.props.data.img)} onMouseLeave={this.onMouseLeave} onMouseDown={this.onMouseLeave}
                        onDragEnd={this.props.onDragEnd} draggable="true" onDragStart={this.onDragStart}>
                    <div className="tplimg">
                        <img src={item.img}/>
                    </div>
                    <p>{item.name}</p>
                    {this.props.showMenu &&
                        <ButtonToolbar style={{marginLeft: "1rem", display: "inline-flex"}}>
                            <ButtonGroup size="sm">
                                <Button onClick={this.props.onExport}><FontAwesomeIcon  icon={faCloudDownloadAlt} title="Exporter"/></Button>
                                <Button onClick={this.props.onDelete}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    }

                    {this.state.imagePreview && 
                        <div className='templatepreview'>
                            <img src={this.state.imagePreview}/>
                    </div>}
                </div>
        return main;
    }
}

export class TemplateForm extends Component{
    static defaultProps = {
        onClose: null,
        onSave: null
    };    

    constructor(props){
        super(props);

        this.onDataChange = this.onDataChange.bind(this);

        this.state = {data: {name: ""}};
    }

    render(){
        let main = 
            <Modal show={true} onHide={this.props.onClose} backdrop="static" keyboard={false} >
                <Modal.Header closeButton>
                    <Modal.Title>Créer un nouveau composant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => { e.preventDefault(); }}>                       
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{"Nom"}</Form.Label>
                                <Form.Control type="text" required value={this.state.data.name} name="name" onChange={this.onDataChange}/>
                            </Form.Group>
                        </Form.Row>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onClose}><FontAwesomeIcon  icon={faTimes} title="Annuler"/>{" "}Annuler</Button>
                    <Button variant="success" onClick={() => this.props.onSave(this.state.data)}><FontAwesomeIcon  icon={faSave} title="Enregistrer"/>{" "}Enregistrer</Button>
                </Modal.Footer>
            </Modal>
/*<Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{"Type"}</Form.Label>
                                <ToggleButtons type="checkbox" name="type" value={this.state.data.type} bsSize="sm" defaultValue={['l']}
                                options={[{text:"Composant",  value:"c"}, {text: "Layout", value:'l'}]} onChange={this.onDataChange}/>
                            </Form.Group>                           
                        </Form.Row>*/
        return main;
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data});
    }
}