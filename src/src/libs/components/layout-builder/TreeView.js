import React, { Component } from 'react';
import {  Button  } from 'react-bootstrap';
import {faAngleRight, faAngleDown} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class TreeView extends Component{
    static defaultProps = {
        canvas: null,
        onSelect: null,
        selectedElement: null
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
        let id = `id${key}`;

        let result = null;
           
        let selected = (this.props.selectedElement === node.dom ? 'disabled btn-warning' : '');
        let btn = <Button variant="link" className={`p-0 ${selected}`} onClick={() => this.props.onSelect(node.dom)} >{` ${node.text}`}</Button>;
        let icon = (this.state.collapsed[id] ? faAngleRight : faAngleDown);

        if(node.children.length > 0){
            result = 
                <li key={key}>
                    <span >
                        <FontAwesomeIcon className="mr-1" icon={icon} onClick={(event) => this.onCollapse(event, id)}/>
                        {btn}
                    </span>
                    {!this.state.collapsed[id] &&
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