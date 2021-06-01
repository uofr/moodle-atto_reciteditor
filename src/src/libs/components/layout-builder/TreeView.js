import React, { Component } from 'react';
import {  Button  } from 'react-bootstrap';
import {faAngleRight, faAngleDown} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {HTMLElementData} from './HTMLElementData';
import {UtilsHTML} from '../../utils/Utils';

export class TreeView extends Component{
    static defaultProps = {
        data: null,
        onSelect: null,
        selectedElement: null,
        view: 'drawner'
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
           
        let selected = (this.props.selectedElement === node.dom ? 'disabled btn-warning' : '');

        if(selected){
            //node.dom.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            
            console.log(node.dom.scrollHeight , node.dom.getBoundingClientRect())
        }

        let btn = <Button variant="link" className={`p-1 ${selected}`} onClick={() => this.props.onSelect(node.dom)} >{` ${node.text}`}</Button>;
        let icon = (this.state.notCollapsed[id] ? faAngleDown : faAngleRight);

        if(node.children.length > 0){
            result = 
                <li key={key}>
                    <span >
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
            result = <li key={key}><span>{btn}</span></li>;
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
        let bs = HTMLElementData.mapBootstrapComponents(node);

        return bs.text;
    }

    onCollapse(event, id){
        event.stopPropagation();
        event.preventDefault();

        let notCollapsed = this.state.notCollapsed;
        notCollapsed[id] = !notCollapsed[id] || false;
        this.setState({notCollapsed: notCollapsed});
    }
}