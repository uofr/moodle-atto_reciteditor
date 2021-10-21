import React, { Component } from 'react';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import {faArrowsAlt, faEdit, faBold, faArrowUp,faArrowDown, faTrashAlt, faClone, faSave, faTimes, faItalic, faUnderline, faStrikethrough, faPuzzlePiece} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {HTMLElementData} from './HTMLElementData';
import {BtnSetCssProp} from '../ButtonsBar';
import {TemplateForm} from './ComponentsCollection';
import { UtilsHTML } from '../../utils/Utils';

export class Canvas extends Component
{
    static defaultProps = {
        children: null,
        style: null
    };      

	render(){     
        let style = {margin: "auto", display: "flex"};
        style = this.props.style;

		let main = 
            <div style={style}>
                {this.props.children}
            </div>; 

		return (main);
    }
}

export class CanvasElement{
    static draggingItem = null;

    constructor(dom, onSelectCallback, onDropCallback, onEditNodeText){
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        //this.onDragStart = this.onDragStart.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDblClick = this.onDblClick.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this); 
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onSelectCallback = onSelectCallback;
        this.onDropCallback = onDropCallback;
        this.onEditNodeText = onEditNodeText;

        this.dom = dom;
        this.dom.ondragover = this.onDragOver;
        this.dom.ondragenter = this.onDragEnter;
        this.dom.ondragleave = this.onDragLeave;
      //  this.dom.ondragstart = this.onDragStart;
        this.dom.ondrop = this.onDrop;
        this.dom.onclick = this.onClickHandler;
        this.dom.onmouseover = this.onMouseOver;
        this.dom.onmouseout = this.onMouseOut;

        this.clickCounter = 0;
        this.droppingZoneAfter = document.createElement("div");
        this.droppingZoneAfter.classList.add("dropping-zone");

        for(let child of this.dom.childNodes){
            CanvasElement.create(child, this.onSelectCallback, this.onDropCallback, this.onEditNodeText);
        }
    }

    static create(el, onSelectElement, onDropElement, onEditNodeText){
        return new CanvasElement(el, onSelectElement, onDropElement, onEditNodeText);
    }

    onClickHandler(event){        
        event.preventDefault(); // Cancel the default action (in case of href)
        event.stopPropagation();
        this.clickCounter++;
        let that = this;

        if(event.detail === 1){
            setTimeout(() => {
                if(that.clickCounter === 1){
                    that.onClick();
                }
                that.clickCounter = 0;
            }, 250);
        }
        else if (event.detail === 2) {
            this.onDblClick();
            this.clickCounter = 0;
        }
    }

    onClick(){
        if(!this.dom.hasAttribute("contenteditable")){
            this.onSelectCallback(this.dom);
        }
    }

    onDblClick(){
        this.onEditNodeText(this.dom);
    }

    onDrop(event){
        // it needs to stop propagation otherwise it will dispatch onFillInSlot in cascade. We want just assign a section to one single slot.
        event.stopPropagation();   

        let eventData = event.dataTransfer.getData("componentData");
        
        let el = null;
        if(eventData.length > 0){
            let componentData = JSON.parse(eventData);
            el = HTMLElementData.createElement(componentData);
            CanvasElement.create(el, this.onSelectCallback, this.onDropCallback, this.onEditNodeText);
        }
        else if (CanvasElement.draggingItem !== null){
            el = CanvasElement.draggingItem;
            CanvasElement.draggingItem = null;
        }
        
        if(el !== null){
            if(event.target.classList.contains('dropping-zone')){
                try{
                    event.target.replaceWith(el);
                }
                catch(err){
                    console.log(err)
                }
            }
            else if(event.currentTarget.tagName.toLowerCase() === "body"){
                //this.dom.appendChild(el);
                event.currentTarget.appendChild(el);
            }
            else{
                console.log(`Fail to drop: `, event.target);
            }
        }
        
        //let el = React.createElement(component.element, {});
        //ReactDOM.render(el, this.dom);

        this.onDropCallback(this.dom);     

        return false;
    } 
    
    onDragOver(event){
        event.preventDefault(); // Necessary to allows us to drop.
        if(!event.target.classList.contains('dropping-zone-hover') && event.target.classList.contains('dropping-zone')){
            event.target.classList.add('dropping-zone-hover');
        }
        return false;
    }

    onDragEnter(event){
        // do not cascate the event towards the parents
        //event.preventDefault();
        //event.stopPropagation();

        if((this.dom.firstElementChild !== null) && (this.dom.firstElementChild.classList.contains("dropping-zone"))){
            return;
        }

        // it flags the hovering event when dragging (because when dragging mouseover is not dispatched)
        this.dom.setAttribute("data-hovering", "1");

        let that = this;
        // wait 1 second to add the dropping zone
        window.setTimeout(() => {
            // if the user moved the mouse then we do not add the dropping zone
            if(!that.dom.hasAttribute("data-hovering")){ return; }

            if(that.dom.children.length > 0){
                that.dom.setAttribute("data-dragging", "1");
                that.dom.insertBefore(that.createDroppingZone("À l'intérieur au début"), that.dom.firstChild);    
            } 

            that.dom.appendChild(that.createDroppingZone("À l'intérieur à la fin"));

            that.dom.parentNode.insertBefore(that.createDroppingZone('Avant'), that.dom);
            that.dom.parentNode.insertBefore(that.createDroppingZone('Après'), that.dom.nextSibling);
        }, 1000);
    }

    onDragLeave(event){
        //console.log('leave')
        //this.dom.classList.remove('dropping-zone');
        event.preventDefault();

        if(event.target.classList.contains('dropping-zone-hover')){
            event.target.classList.remove('dropping-zone-hover');
        }

        this.dom.removeAttribute("data-hovering");
    }

    /*onDragStart(event){
        event.stopPropagation();

        //let data = HTMLElementData.getElementData(null, this.dom);
        //event.dataTransfer.setData("componentData", JSON.stringify(data));
        CanvasElement.draggingItem = this.dom;
    }*/

    createDroppingZone(desc){
        let el = document.createElement("div");
        el.classList.add("dropping-zone");
        el.innerText = desc || "";
        return el;
    }

    onMouseOver(event){
        event.stopPropagation();
        event.preventDefault();
        this.dom.setAttribute("data-hovering", "1");
    }

    onMouseOut(event){
        this.dom.removeAttribute("data-hovering");
    }
}

export class FloatingMenu extends Component{
    static defaultProps = {
        posCanvas: null,
        selectedElement: null,
        onDragElement: null,
        onEdit: null,
        onMoveNodeUp: null,
        onMoveNodeDown: null,
        onDeleteElement: null,
        onCloneNode: null,
        onSaveTemplate: null,
        device: null
    };      

    constructor(props){
        super(props);

        this.showModal = this.showModal.bind(this);
        this.onSaveTemplate = this.onSaveTemplate.bind(this);

        this.state = {showModal: false};
    }

    render(){
        
        if(this.props.posCanvas === null){ return null;}
        if(this.props.selectedElement === null){ return null;}
        if(this.props.device === null){ return null;}
        if(this.props.selectedElement.getAttribute('contenteditable') === 'true'){ return null; }

        let style = {display: 'block', top: 0, left: 0};

        let posCanvas = this.props.posCanvas;
        let posEl = UtilsHTML.getBoundingClientRect(this.props.selectedElement, this.props.device.scale);

        style.top = Math.max(posCanvas.top + posEl.top - 32, 0);
        style.left = posCanvas.left + posEl.left;

        let main =  
            <div className='floating-menu' style={style}>
                <ButtonToolbar aria-label="Toolbar with Button groups">
                    <ButtonGroup size="sm">
                        <Button onDragStart={this.props.onDragElement} draggable="true" style={{cursor: 'grab'}}><FontAwesomeIcon  icon={faArrowsAlt} title="Glisser"/></Button>
                        <Button onClick={this.props.onEdit}><FontAwesomeIcon  icon={faEdit} title="Éditer"/></Button>
                        <Button onClick={() => this.showModal(true)}><FontAwesomeIcon icon={faPuzzlePiece} title="Créer un composant"/></Button>
                        <Button onClick={this.props.onMoveNodeUp}  ><FontAwesomeIcon icon={faArrowUp} title="Déplacer l'élément vers le haut"/></Button>
                        <Button onClick={this.props.onMoveNodeDown}><FontAwesomeIcon icon={faArrowDown} title="Déplacer l'élément vers le bas"/></Button>
                        <Button onClick={this.props.onCloneNode}><FontAwesomeIcon icon={faClone} title="Dupliquer"/></Button>
                        <Button onClick={this.props.onDeleteElement}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                    </ButtonGroup>
                </ButtonToolbar>
                {this.state.showModal && <TemplateForm onClose={() => this.showModal(false)} onSave={this.onSaveTemplate}/>}
            </div>
            //disabled={this.props.selectedElement.previousSibling === null}
        return main;
    }

    showModal(show){
        this.setState({showModal: show});
    }

    onSaveTemplate(data){
        this.props.onSaveTemplate(data.name, 'c');
        this.showModal(false);
    }
}

export class NodeTextEditing extends Component{
    static defaultProps = {
        posCanvas: null,
        selectedElement: null,
        window: null,
        device: null
    };      

    constructor(props){
        super(props);
    }

    render(){
        if(this.props.posCanvas === null){ return null;}
        if(this.props.selectedElement === null){ return null;}
        if(this.props.device === null){ return null;}
        if(this.props.selectedElement.getAttribute('contenteditable') !== 'true'){ return null; }
        
        let style = {position: 'absolute', display: 'block', top: 0, left: 0};

        let posCanvas = this.props.posCanvas;
        let posEl = UtilsHTML.getBoundingClientRect(this.props.selectedElement, this.props.device.scale);

        style.top = Math.max(posCanvas.top + posEl.top - 32, 0);
        style.left = posCanvas.left + posEl.left;

        let main =  
                <div style={style}>
                   <ButtonToolbar >
                        <ButtonGroup size="sm">
                            <BtnSetCssProp window={this.props.window} variant="primary" cssProp="font-weight" defaultValue="normal" value="bold"  icon={faBold}  title="Gras"/>
                            <BtnSetCssProp window={this.props.window} variant="primary" cssProp="font-style" defaultValue="normal" value="italic"  icon={faItalic}  title="Italique"/>
                            <BtnSetCssProp window={this.props.window} variant="primary" cssProp="text-decoration" defaultValue="normal" value="underline"  icon={faUnderline}  title="Souligné"/>
                            <BtnSetCssProp window={this.props.window} variant="primary" cssProp="text-decoration" defaultValue="normal" value="line-through"  icon={faStrikethrough}  title="Barré"/>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>;

        return main;
    }
}
