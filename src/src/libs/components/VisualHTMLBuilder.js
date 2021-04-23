import React, { Component } from 'react';
import { Nav, Card, Navbar, Form, Collapse, Row, Col, Button  } from 'react-bootstrap';
import {faMobileAlt, faTabletAlt, faLaptop, faDesktop, faRemoveFormat, faAlignLeft, faAlignCenter, faAlignRight, faAngleRight, faAngleDown} from '@fortawesome/free-solid-svg-icons';
import { ToggleButtons} from './Components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class VisualHTMLBuilder extends Component
{
    static defaultProps = {
        input: ""
    };

    constructor(props){
        super(props);

        this.onNavbarSelect = this.onNavbarSelect.bind(this);
        this.onSelectElement = this.onSelectElement.bind(this);
        this.onDropElement = this.onDropElement.bind(this);
        this.onCollapse = this.onCollapse.bind(this);

        this.state = {device: 'xl', collapsed: ['0', '1', '2'], selectedElement: null};

        this.canvas = React.createRef();
    }

    componentDidMount(){
        let window = this.canvas.current.contentWindow || this.canvas.current.contentDocument;
        let head = window.document.head;
        let body = window.document.body;

        let el = document.createElement("link");
		el.setAttribute("href", `canvas-content.css?v=${Math.floor(Math.random() * 100)}`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = document.createElement("link");
		el.setAttribute("href", `bootstrap.min.c9ac70f5.css`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        body.parentElement.classList.add("canvas-content");

        let content = "<div>a</div>";                

        // pure JS
        new CanvasElement(body, this.onSelectElement, this.onDropElement);

        // React JS
        //body.appendChild(doc.firstChild);
        //ReactDOM.render(<CanvasElement dom={doc.firstChild} parent={body}/>, body);
    }

	render(){
		let main = 
			<div className="visual-builder">                
                <Navbar bg="dark" variant="dark" onSelect={this.onNavbarSelect} expand="sm">
                    <Navbar.Brand>
                        <img alt="RÉCIT" src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAAB0CAMAAABnsTYoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAABpvwJqvyp9vwRrwAZswAduwAhtwQhuwQtvwgtwwQ5wwQ1wwg5xww9ywxBywxJ0wxN0xBd1whR1xBZ2xBl2wRh3xRp4xR95wR56xR56xh97xyJ8xyV8wiR9xyV+yCZ/yTKBvz+HvSeAySiAySyCyi6Dyy+Eyi+EyzCFyzKGyzaIzDeJzTiJzTiKzTuMzj2MzkGGu2WTr3KVpkCOz0KQz0OR0ESQ0EaS0EeS0UmT0UqU0UyV0kyW0U2W0k6X01KZ01Oa01Oa1FWa1Fid1Vqd1lqe1Vue1l6g1l+h12Ki12Sj2Gak2Gqn2Wqn2muo2Wuo2m2o2m6q2nGq23Ks23St3Hau3Hev3Xiv3Xqw3Xux3n6y3n+03rugbPGgL/qiKvmiK/qjLPqjLfqjLvqkL/qnNfqoOPmqP8efXtqfSMOfYcKfZNegS9GgVdWgUNupX9eoYeGgQvqrQPqsQvquR/qvSPqvSfqwS/qzUfqzUvuzVPu1V/u2V/u2WPu4Xfu5X/u6YPu6Yvu+a/u+bPvEePvEefvGfPzEePzEeZacjJychZidjKGvroC034O24Ia34Ie44Ie44Ym64Yy74o284o+945C945C+45TA5JfB5ZfC5JjC5JrC5ZrE5ZvE5pzF5p/G56DH5qDG56HI56PJ6KTJ6KXK6KjM6arN6qzO6q/Q6q/Q67DQ6rLR67PS7LTT7LbU7LjV7brW7bzX7r3Y7r7Z77/a7/vHgPzIgvzJhPzJhfzKhfzKhvzKh/zLiPzLivzOj/zPk/zQk/zQlPzRlf3ZqP3brv3guf3iu/3hvP3ivMDa78Pb8MPc8Mbd8Mfe8Mje8cvg8szg8s7i89Ll89Lk9NTm89bm9Nno9dvq9d3q9t7s9v7kwP3nyf3oy/7r0v7s0/7t1v7t1/7w3eHt9+Pu+OTv+OXw+Obw+ejx+eny+erz+uz0+u71+/7y4/705fD2+/L3/PP4/PT5/Pb6/f/58v/68//89/j7/fr8/v/8+f/9/P/+/P3+/v7+/wAAAFY5PcMAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjVlhTJlAAAGpklEQVRoQ+2Zd3gURRiHb2MiERIDEj0NEVBaIBpOBSOgB4ooiVgIRTHqKdh7B+wtiiWKiBIQLKBobCiCimADGwlqJCgQxI5SFWJUojLnlN9e9mZ3Lsu5k3sen7z8wXxl92Vv2+zgCzfOOzdfOSbkLY1q3zwXnZ7SiPbts9DnMbG1V6HLc2JqR6PJe2Jp0aKDGNoz0aIDtfYcdGhBqb0VDXpQalHXhEo7HnVNqLQo60KhXYiyLhTasSjrQqFFVRvNWgqq2mjWUlDVhqQd1rdbFmWfveNl3/0PvvcC7DsGVm3fJMMb9rv7DOxeRYO2G7bxhD3viT1JMLVD0O8ZB10BgyPQdkezh+xxPhROCG02Wj2l1YVwOMC1XdCoJCUA2iPhilaXQmKHaQeiTc1AIqjrjIQ7dlFe0EyLphi8CO1JiN1yCCw2qNaPHjVt6oV1DmLXJF8MjQzVoiUGJwrrxkzErsgvLSsrvQ8aGV/YxemqEtrDEbqiVGzzATwSPhcH20HsYRpCd2wUG/3p/KXqRiv+4StSEboijW9Dcf5W9fVDXwxeYZuv27lHip87KZiDvr54CecmEfpc7O0xuvX8dghckiqkhJwnPGGES0Toa4G+GKQWDs3F0D0/Cs3mS4RH1qLLc4qE5v6LhKeptEbO0AceHJZnnC48jWkzggMC0bOMzB6B/ED3tojstM4NDgj26aK40BXaNRzzYZv7xG+09jQiw+hR+kmt6Ccbnitw2POhM2pQ37FySh6SVhRaEW1lz72Wx1WLaJjYwjjicxGbbBmZggo4ZiUq4NMACkZ6MbgsFLq6ZMIdv6KjouSuCRNKSqAls42uZdswJh35lhnPI7Sw3Pre8M9H1sIknKB2iMm4UKgEQwumlizH35Q1fEP/KoRR1DR4O65DLoqnRNGt1kIZ2y5N+v1MqszrbXfHfxYhp/JqHNog2+5JBDbME1+GWKaev9J2XrudXbC5COjVNqOgd4/ehTPrEG8S13O7HYhtPMvLCNxr57LNXkJAprVkIcX/GTIFPJyIiGwv65W1W3r74HR26zHq2S2+M9rK4d0zjL3Ydew3j2USd3AycQeLqY15u26LPK7br0dqMA1ca7c/aplnYBpDNlufELNErpZdVJ3EmJDhosY4EqmpdGzV3rL044rfEf6wtGJpRUVFRDsn6g1YjuzjiDmDkGTT6gKM69JFjbNV5ObRoVXL+B7hYhFGtOyXaQCvLRL1aZSD5FF0PAXj+aIkqBS5L+hQpY1+OErayEu6FxKcDCSH0vEcjCeKkqDwYU4xHcal7YgkyUGCsyuSbLfmw0T1pShrv0MYUxtAkowcbAVJdnVvxpg/WhyI62jzkXTmIdqBIYm8ciTi0gaRdIb+yOkYuta6+pH7IOlMPFpXN1Dk3Doy4j9o3V1SjhTp0nZFkgRzHGij60fORDL6vrWCOslHLBPX0SYhSQ5AwsYmNByNWCYurbEB2f4iBPiR2SzTfErRy6uBEdXV1XT2u5IO49MuQ9acwXBSkDyZjs1pwExREswUuZ/pUKV9T4QKrTlRmoWYY348nkDH5htotSgJ5opcrKN9X4QK7RBk1yPm9EOSvfjM5zOxrN8l4YRX0bFK+5EIFdpsZIn1q3s6cuzyxsICIeWixjAfqS/Qsaz9BuHft/NQoTW+RHoVvUlBFywT1SWzKDJLZmeak2lOrybTQNZ+hZCQX75eu3atSjsKaVIzkFvosfyEzMs8xEoM5bVjO7f2d+o/yXwX8ptK1i5BCFTa9MgHEdk2b3bZ1HJTSsgg3uDHsdupz6BlWXsjQqDSGqchb6MGRz8ZsY1nWFXWhr5FLFBqU/DRaeMwNLQ0T7/EFr64YtPe8A8SHKXWyHL8oLM8lrJXIxXF1p68aNOGFiHBUWuNLKz5WakrRJHR1pw+WliG6bZdG3rjL6QoMbRG8vHSx+aOcmkVKyidiarIjM5BG7r2wz+QDPuKgPOKZ17xq+aXTW3lKIels56PrMDnUm1lsWUVPg27LbocTs6Y6267c9Fb9I+LBaLU7JwDA13Vi7qpnQPB/DzVqjSWTCT0rUuBZm1obGK0CxKjDSdEe01itOGEaMclRDs6nBAt+8/MptcuSIh2IbM2tfZsLm1q7Y2wNql2PJyUptKOvv5dGDnatfBINGs9BR6JZq2XpMEjoVvbBx4J3VpoZP6f2iA0Mpq1sNjQqx0Miw2tWj8kdnRqk+FwQKM2CQon9GlTYXBEm7YDBM5o0rYoxv4VaNG2HYm9K/Fam5LV6xTsWk04/C+LOCax9YczEgAAAABJRU5ErkJggg=="} width="30" height="30" className="d-inline-block align-top" />{' '}
                        Éditeur RÉCIT
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto"></Nav>
                        <Nav activeKey={this.state.device}>
                            <Nav.Link eventKey="xs"><FontAwesomeIcon icon={faMobileAlt} title="XS"/></Nav.Link>
                            <Nav.Link eventKey="sm"><FontAwesomeIcon icon={faTabletAlt} title="SM"/></Nav.Link>
                            <Nav.Link eventKey="md"><FontAwesomeIcon icon={faTabletAlt} title="MD" style={{transform: 'rotate(90deg)'}}/></Nav.Link>
                            <Nav.Link eventKey="lg"><FontAwesomeIcon icon={faLaptop} title="LG"/></Nav.Link>
                            <Nav.Link eventKey="xl"><FontAwesomeIcon icon={faDesktop} title="XL"/></Nav.Link>    
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                   
                <div className="main">
                    <div className="left-area">
                        <Card>
                            <Card.Header onClick={() => this.onCollapse('0')}>Composants</Card.Header>
                            <Collapse in={this.state.collapsed.includes('0')}>
                                <Card.Body><VisualComponentList/></Card.Body>
                            </Collapse>
                        </Card>

                        <Card>
                            <Card.Header onClick={() => this.onCollapse('1')}>Proprietés</Card.Header>
                            <Collapse in={this.state.collapsed.includes('1')}>
                                <Card.Body>
                                    <ComponentProperties element={this.state.selectedElement}/>
                                </Card.Body>
                            </Collapse>
                        </Card>

                        <Card>
                            <Card.Header  onClick={() => this.onCollapse('2')}>Arborescence</Card.Header>
                            <Collapse in={this.state.collapsed.includes('2')}>
                                <Card.Body><TreeStructure canvas={this.canvas} onSelect={this.onSelectElement} /></Card.Body>
                            </Collapse>
                        </Card>
                    </div>
                    
                    <div className="center-area" >
                        <Canvas>
                            <iframe ref={this.canvas} className="canvas" style={this.getDeviceDimension()}></iframe>
                        </Canvas>
                    </div>
                </div>
            </div>;

		return (main);
    }

    onCollapse(index){
        let data = [];
        if(this.state.collapsed.includes(index)){
            data = this.state.collapsed;
            data = data.filter(item => item !== index);
        }
        else{
            data = this.state.collapsed;
            data.push(index);
        }

        this.setState({collapsed: data});
    }

    onNavbarSelect(eventKey){
        this.setState({device: eventKey});
    }

    onSelectElement(el){
        console.log(el)
        if(this.state.selectedElement){            
            this.state.selectedElement.removeAttribute('data-selected');
        }

        if(el.getAttribute('data-selected') === '1'){
            el.removeAttribute('data-selected');

        }
        else{
            el.setAttribute('data-selected', '1');
        }

        this.setState({selectedElement: el});
    }

    onDropElement(el){
        this.forceUpdate();
    }    

    getDeviceDimension(){
        let device = null;

        switch(this.state.device){
            case 'xs': device = {width: 360, height: 1050}; break;
            case 'sm': device = {width: 576, height: 1050}; break;
            case 'md': device = {width: 768, height: 1050}; break;
            case 'lg': device = {width: 992, height: 1050}; break;
            case 'xl':
            default: device = {width: 1200, height: 1050}; 
        }

        return device;
    }
}

class Canvas extends Component
{
    static defaultProps = {
        children: null
    };      

	render(){        
		let main = 
            <div style={{margin: "auto", display: "flex"}}>
                {this.props.children}
            </div>; 

		return (main);
    }
}

class CanvasElement{
    constructor(dom, onSelectCallback, onDropCallback){
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDbClick = this.onDbClick.bind(this);

        this.onSelectCallback = onSelectCallback;
        this.onDropCallback = onDropCallback;

        this.dom = dom;
        this.dom.ondragover = this.onDragOver;
        this.dom.ondrop = this.onDrop;
        this.dom.onclick = this.onClick;
        this.dom.ondblclick = this.onDbClick;
    }

    onClick(event){        
        event.stopPropagation();
        this.onSelectCallback(this.dom);
    }

    onDbClick(event){
        event.stopPropagation();
        this.dom.setAttribute("contenteditable", "true");
    }
    
    onDrop(event){
        // it needs to stop propagation otherwise it will dispatch onFillInSlot in cascade. We want just assign a section to one single slot.
        event.stopPropagation();   

        let componentData = JSON.parse(event.dataTransfer.getData("componentData"));

        //let doc = new DOMParser().parseFromString(content, "text/xml");
        if(componentData.type === 'native'){
            let el = document.createElement(componentData.tagName);
            el.innerText = componentData.name;
            if(componentData.classList){
                el.classList.add(...componentData.classList); // add multiple classes using spread syntax
            }
            new CanvasElement(el, this.onSelectCallback, this.onDropCallback);
            this.dom.appendChild(el);
        }
        
        //let el = React.createElement(component.element, {});
        //ReactDOM.render(el, this.dom);

        this.onDropCallback(this.dom);
    } 
    
    onDragOver(event){
        event.preventDefault(); // Necessary to allows us to drop.
        console.log("hover")
    }
}

class ComponentProperties extends Component{
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

class VisualComponentList extends Component{
    static defaultProps = {
    };

    static data = [
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
        for(let section of VisualComponentList.data){
            for(let item of section.children){
                if(item.tagName === tagName){
                    return item;
                }
            }
        }

        return null;
    }

    render(){
        let main =
            <div className='component-list'>
                {VisualComponentList.data.map((item, index) => {
                    let branch = 
                        <ul key={index}>
                            <li key={index} className='component-section'>{item.name}</li>
                            {item.children.map((item2, index2) => {
                                return (<ComponentItem data={item2} key={index2}/>);
                            })}
                        </ul>

                    return (branch);
                })}
            
            </div>;

        return main;
    }
}

class ComponentItem extends Component
{
    static defaultProps = {
        data: null
    };
    
    constructor(props){
        super(props);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }
	
	render(){
		let main = 
            <li className="component-item" draggable="true" onDragStart={this.onDragStart}  onDragEnd={this.onDragEnd}>
                {this.props.data.name}
            </li>;

		return main;
    }
    
    onDragStart(event){
        event.dataTransfer.setData("componentData", JSON.stringify(this.props.data));
    }
    
    onDragEnd(event){
        console.log('dragend');
    }
}

class TreeStructure extends Component{
    static defaultProps = {
        canvas: null,
        onSelect: null
    };
    
    constructor(props){
        super(props);

        this.onCollapse = this.onCollapse.bind(this);

        this.state = {collapsed: {}};
    }

    render(){
        if(this.props.canvas === null){ return null; }
        if(this.props.canvas.current === null){ return null; }

        let window = this.props.canvas.current.contentWindow || this.props.canvas.current.contentDocument;
        let body = window.document.body;

        let treeView = this.createTreeViewData(body);

        let main = <ul className='tree-view'>{this.renderTreeView(treeView, 0)}</ul>;

        return main;
    }

    renderTreeView(node, key){
        key = key + 1;

        let id = `id${key}`;

        let result = null;
            
        let btn = <Button variant="link" onClick={() => this.props.onSelect(node.dom)}>{` ${node.text}`}</Button>;
        let icon = (this.state.collapsed[id] ? faAngleRight : faAngleDown);

        if(node.children.length > 0){
            result = 
                <li key={key}>
                    <span >
                        <FontAwesomeIcon icon={icon} onClick={(event) => this.onCollapse(event, id)}/>
                        {btn}
                    </span>
                    {!this.state.collapsed[id] &&
                        <ul>
                            {node.children.map((item, index) => {
                                return this.renderTreeView(item, key);
                            })}
                        </ul>
                    }
                </li>
        }
        else{
            result = <li key={key}><span>{btn}</span></li>;
        }
            
        return result;
    }

    createTreeViewData(node){
        let result = {text: node.tagName.toLowerCase(), dom: node, children: []};

        for(let child of node.children){
            let obj = null;
            if(child.children.length > 0){
                obj = this.createTreeViewData(child);
            }
            else{
                obj = {text: child.tagName.toLowerCase(),  dom: child, children: []};
            }
            result.children.push(obj);
        }

        return result;
    }

    onCollapse(event, id){
        event.stopPropagation();
        event.preventDefault();
        console.log(event.currentTarget, id)

        let collapsed = this.state.collapsed;
        collapsed[id] = !collapsed[id] || false;
        this.setState({collapsed: collapsed});
    }
}