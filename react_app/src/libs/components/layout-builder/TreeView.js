import React, { Component } from 'react';
import { ButtonToolbar, Button, ButtonGroup  } from 'react-bootstrap';
import {faAngleRight, faAngleDown, faArrowUp, faArrowDown, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {HTMLElementData} from './HTMLElementData';
import {UtilsHTML} from '../../utils/Utils';

export class TreeView extends Component{
    static defaultProps = {
        data: null,
        onSelect: null,
        selectedElement: null,
        onDeleteElement: null,
        onMoveNodeUp: null,
        onMoveNodeDown: null,
        view: 'designer'
    };
    
    constructor(props){
        super(props);

        this.onCollapse = this.onCollapse.bind(this);

        this.state = {notCollapsed: {}};
    }

    componentDidUpdate(prevProps, prevState){
        // when the selected element is changed then it collapses all branches
        if(!Object.is(prevProps.selectedElement, this.props.selectedElement)){
            this.setState({notCollapsed: {}});
        }
    }

    render(){
        if(this.props.data === null){ return null; }

        let data = this.props.data;

        if(this.props.view === 'sourceCode'){           
            data = UtilsHTML.assignTagId(this.props.data);
        }
        
        let treeView = this.createTreeViewData(data);

        let main = <ul className='tree-view'>{this.renderTreeView(treeView, 0)}</ul>;

        return main;
    }

    renderTreeView(node, key){
        let id = `id${key}`;

        let result = null;
           
        let selected = (this.props.selectedElement !== null &&  this.props.selectedElement.isSameNode(node.dom));
        let extraClasses = (selected ? 'disabled btn-warning' : '');
        
        let btn =  
            <ButtonToolbar aria-label="Item actions" style={{flexWrap: "nowrap"}}>
                <ButtonGroup>
                    <Button variant="link" className={`p-1 ${extraClasses}`} style={{whiteSpace: "nowrap"}} onClick={() => this.props.onSelect(node.dom)} >{` ${node.text}`}</Button>
                </ButtonGroup>
                {!node.dom.isSameNode(this.props.data) &&
                    <ButtonGroup size="sm" className="btn-group-actions" style={(selected ? {display: 'flex'} : {})}>
                        <Button onClick={() => this.props.onMoveNodeUp(node.dom)}  ><FontAwesomeIcon icon={faArrowUp} title={i18n.get_string('moveelementup')}/></Button>
                        <Button onClick={() => this.props.onMoveNodeDown(node.dom)}><FontAwesomeIcon icon={faArrowDown} title={i18n.get_string('moveelementdown')}/></Button>
                        <Button onClick={() => this.props.onDeleteElement(node.dom)}><FontAwesomeIcon  icon={faTrashAlt} title={i18n.get_string('delete')}/></Button>
                    </ButtonGroup>
                }
            </ButtonToolbar>;

        let icon = (this.state.notCollapsed[id] ? faAngleDown : faAngleRight);

        if(node.children.length > 0){
            result = 
                <li key={key}>
                    <span className="d-flex align-items-center" >
                        <FontAwesomeIcon className="mr-1" icon={icon} onClick={(event) => this.onCollapse(event, id)}/>
                        {btn}
                    </span>
                    {(this.state.notCollapsed[id] || node.dom.contains(this.props.selectedElement)) &&
                        <ul>
                            {node.children.map((item, index) => {
                                key = key + 1
                                return this.renderTreeView(item, key);
                            })}
                        </ul>
                    }
                </li>
        }
        else{
            result = 
                <li key={key}>
                    <span className="d-flex align-items-center">
                        <i style={{marginRight: "12px"}}></i>
                        {btn}
                    </span>
                </li>;
        }
            
        return result;
    }

    createTreeViewData(node){
        let result = {text: this.getNodeDesc(node), dom: node, children: []};

        for(let child of node.children){
            let obj = null;
            if(child.children.length > 0){
                obj = this.createTreeViewData(child);
            }
            else{
                obj = {text: this.getNodeDesc(child),  dom: child, children: []};
            }
            result.children.push(obj);
        }

        return result;
    }

    getNodeDesc(node){
        //let text = node.tagName.charAt(0).toUpperCase() + node.tagName.toLowerCase().slice(1);

        /*let classList = [...node.classList]; // spread syntax 

        if(classList.length > 0){
            text = `${text} (${classList.join(", ")})`;
        }*/
        let elClass = HTMLElementData.getElementClass(null, node);

        return (elClass ? elClass.getDesc(node) : node.tagName.toLowerCase());
    }

    onCollapse(event, id){
        event.stopPropagation();
        event.preventDefault();

        let notCollapsed = this.state.notCollapsed;
        notCollapsed[id] = !notCollapsed[id] || false;
        this.setState({notCollapsed: notCollapsed});
    }
}