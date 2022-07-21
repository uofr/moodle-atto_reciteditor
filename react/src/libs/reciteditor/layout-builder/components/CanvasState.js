// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto HTML editor
 *
 * @package    atto_reciteditor
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */

 import React from 'react';
 import {Canvas, CanvasElement, FloatingMenu, NodeTextEditing, SourceCodeEditor, Assets, HTMLElementData, UtilsHTML, UtilsMoodle} from '../../RecitEditor';

class CanvasState{
    constructor(mainView){
        this.mainView = mainView;

        this.onInit = this.onInit.bind(this);
        this.onSelectElement = this.onSelectElement.bind(this);
        this.onDeleteElement = this.onDeleteElement.bind(this);
        this.onMoveNodeUp = this.onMoveNodeUp.bind(this);
        this.onMoveNodeDown = this.onMoveNodeDown.bind(this);
        this.onCloneNode = this.onCloneNode.bind(this);
        this.onInsertNode = this.onInsertNode.bind(this);
        this.onEditNodeText = this.onEditNodeText.bind(this);
        this.onLoadFrame = this.onLoadFrame.bind(this);
        this.htmlCleaning = this.htmlCleaning.bind(this);
        this.onReplaceNonBreakingSpace = this.onReplaceNonBreakingSpace.bind(this);
        this.onKey = this.onKey.bind(this);

        this.onLoadFrame();
    }

    onLoadFrame(){} // Abstract method
    onInit(iframe){}
    render(show, selectedElement){}
    onDragEnd(){}
    getData(htmlCleaning){}
    setData(value){}
    onBeforeChange(value, flags){}
    onContentChange(value, flags){}
    onAfterChange(value, flags){}
    onDeleteElement(selectedElement){}
    onMoveNodeUp(selectedElement){}
    onMoveNodeDown(selectedElement){}
    onCloneNode(selectedElement){}
    onInsertNode(elems){}
    onEditNodeText(selectedElement){}
    onReplaceNonBreakingSpace(selectedElement){}
    onKey(e, editingElement){}

    onCollapse(collapsed){ 
        if (typeof collapsed == 'undefined') return false
        return collapsed;
    }

    onSelectElement(el, selectedElement, collapsed){ 
        let result = {el: el, collapsed: collapsed };
        return result;
    }  

    htmlCleaning(htmlDoc){
        htmlDoc = htmlDoc || null;
        if(htmlDoc === null){
            return;
        }

        // remove the class dropping-zone of all elements
        let items = htmlDoc.querySelectorAll(".dropping-zone, .dropping-zone-hover, [contenteditable], [data-hovering], [data-selected], [draggable]");

        items.forEach(function(item) {
            //item.classList.remove('dropping-zone');
            if(item.classList.contains("dropping-zone")){
                item.remove();
            }
            else if(item.classList.contains("dropping-zone-hover")){
                item.classList.remove('dropping-zone-hover');
            }
            
            item.removeAttribute("data-hovering");
            item.removeAttribute("contenteditable");
            item.removeAttribute("data-selected");
            item.removeAttribute("draggable");
        });
    }

    getStyle(width){
        let style = {width: width || this.mainView.props.device.width, height: this.mainView.props.device.height};
        if(this.mainView.props.device.height > window.innerHeight){
            style.transform = `scale(${this.mainView.props.device.scale})`;
            style.transformOrigin = "0 0";
        } 

        return style;
    }
}

export class SourceCodeDesignerState extends CanvasState{
    constructor(mainView, designerState, sourceCodeState){
        super(mainView)
        this.designer = designerState;
        this.sourceCode = sourceCodeState;
    }


    render(view, selectedElement){
        this.view = view;
        this.selectedElement = selectedElement;

        let col = "";
        let sourceCodeWidth = null;
        let sourceCodeHeight = null;
        if (view == 'sourceCodeDesigner'){
            col = "col-md-6";
            sourceCodeWidth = "100%";
            sourceCodeHeight = "95vh";
        }

        let main = <>
            <div className={col}>
                {this.designer.render((view === 'designer' || view == 'sourceCodeDesigner'), selectedElement)}
            </div>
            <div className={col}>
                {this.sourceCode.render((view === 'sourceCode' || view == 'sourceCodeDesigner'), selectedElement, sourceCodeWidth, sourceCodeHeight)}
            </div>
           </>

        return main;
    }
    
    onContentChange(val, origin){
        if (origin == 'designer'){
            this.sourceCode.setData(val)
        }else if (origin == 'sourceCode'){
            this.designer.setData(val)
        }

    }

    getData(){
        return this.designer.getData(true);
    }

    setData(data){
        this.designer.setData(data);
        this.sourceCode.setData(data);
        return true;
    }

    onDragEnd(){
        this.designer.onDragEnd();
    }

    onSelectElement(el, selectedElement, collapsed){
        this.sourceCode.onSelectElement(el, selectedElement, collapsed);
        let result = this.designer.onSelectElement(el, selectedElement, collapsed);
        return result
    }

    onDeleteElement(el){
        this.designer.onDeleteElement(el);
    }

    onReplaceNonBreakingSpace(el){
        this.designer.onReplaceNonBreakingSpace(el);
    }

    onMoveNodeUp(el){
        this.designer.onMoveNodeUp(el);
    }

    onKey(e, selectedElement){
        this.sourceCode.onKey(e, selectedElement);
        this.designer.onKey(e, selectedElement);
    }

    onMoveNodeDown(el){
        this.designer.onMoveNodeDown(el);
    }

    onCloneNode(el){
        this.designer.onCloneNode(el);
    }

    onInsertNode(elems){
        this.designer.onInsertNode(elems);
    }

    onEditNodeText(el){
        this.designer.onEditNodeText(el);
    }

    onCollapse(collapse){
        let collapsed = this.designer.onCollapse(collapse);
        return collapsed
    }
}

export class DesignerState extends CanvasState{
    constructor(mainView, historyManager){
        super(mainView);

        this.iFrame = null;
        this.window = null;
        this.historyManager = historyManager;
        this.onKey = this.onKey.bind(this);
    }

    onLoadFrame(){
        let iframe = window.document.getElementById("designer-canvas");
        if(iframe){
            this.onInit(iframe);
            return;
        }
        else{
            console.log("Loading designer iframe...");
            setTimeout(this.onLoadFrame, 500);
        }
    }

    onInit(iframe){
        this.iFrame = iframe;
        this.window = this.iFrame.contentWindow || this.iFrame.contentDocument;
        let head = this.window.document.head;
        let doc = this.window.document;
        let body = this.window.document.body;
        let style = UtilsMoodle.getThemeMoodleCssRules();
        let el = null;
        
        if (style.url.length > 0){
            for (let url of style.url){            
                el = doc.createElement("link");
                el.setAttribute("href", url);
                el.setAttribute("rel", "stylesheet");
                head.appendChild(el);
            }
        }

        if (style.rules.length > 0){
            el = doc.createElement("style");
            el.setAttribute("title", "theme-moodle");
            el.innerHTML = UtilsHTML.cssRules2Str(style.rules);
            head.appendChild(el);
        }

        el = doc.createElement("link");
		el.setAttribute("href", `${Assets.CanvasDesignerCSS}`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);


        // pure JS
        CanvasElement.create(body, this.mainView.onSelectElement, this.mainView.onDragEnd, this.mainView.onEditNodeText);

        // React JS
        //body.appendChild(doc.firstChild);        

        body.onkeyup = this.mainView.onKey;
    }

    render(show, selectedElement, width){
        let posCanvas = (this.iFrame === null ? null : this.iFrame.getBoundingClientRect());        
 
        let main = 
            <Canvas style={{display: (show ? 'flex' : 'none') }}>
                <iframe id="designer-canvas" className="canvas" style={this.getStyle(width)}></iframe>
                <FloatingMenu posCanvas={posCanvas} selectedElement={selectedElement} onDragElement={this.mainView.onDragStart} onEdit={this.mainView.onEditNodeText}
                            onDeleteElement={this.mainView.onDeleteElement} onMoveNodeUp={this.mainView.onMoveNodeUp} onMoveNodeDown={this.mainView.onMoveNodeDown} 
                             onCloneNode={this.mainView.onCloneNode} onSaveTemplate={this.mainView.onSaveTemplate} device={this.mainView.props.device} />
                <NodeTextEditing posCanvas={posCanvas} window={this.window} selectedElement={selectedElement} onReplaceNonBreakingSpace={this.mainView.onReplaceNonBreakingSpace} device={this.mainView.props.device}/>
            </Canvas>;

        return main; 
    }

    onSelectElement(el, selectedElement, collapsed){
        let result = {el: el, collapsed: collapsed};

        if((result.el !== null) && (result.el.tagName.toLowerCase() === 'body')){ 
            result.el = null;
        }

        // if the selected element receives another click then it deselects it
        if(Object.is(result.el, selectedElement)){
            this.htmlCleaning(this.window.document);
            
            result.collapsed.components = false;
            result.collapsed.properties = true;
            result.el = null;
        }
       /* else if(selectedElement !== null){ 
            this.htmlCleaning();
            
            result.collapsed.components = false;
            result.collapsed.properties = true;
            result.el = null;
            return result; 
        }*/
        else{
            this.htmlCleaning(this.window.document);

            if (selectedElement && selectedElement.innerHTML != this.editingElementText){
                this.onAfterChange()
            }

            result.collapsed.components = true;
            result.collapsed.properties = false;

            if(result.el !== null){
                if(result.el.getAttribute('data-selected') === '1'){
                    result.el.removeAttribute('data-selected');
                    result.el.removeAttribute('draggable');
                }
                else{
                    result.el.setAttribute('data-selected', '1');
                    result.el.setAttribute('draggable', 'true');
    
                    let elClass = HTMLElementData.getElementClass(null, result.el);
                    if (elClass && elClass.onSelect){
                        elClass.onSelect(result.el);
                    }
                    if (elClass && elClass.collapsePanel){
                        result.collapsed.components = elClass.collapsePanel.components;
                        result.collapsed.properties = elClass.collapsePanel.properties;
                        result.collapsed.treeView = elClass.collapsePanel.treeView;
                    }
                }
            }
    
        }

        return result;
    }

    onCollapse(collapsed){
        collapsed.components = false;
        collapsed.properties = true;
        collapsed.treeView = false;
        return collapsed;
    }

    onBeforeChange(){
        if (this.historyManager){
            this.historyManager.onContentChange(this.getData());
        }
    }

    onAfterChange(){
        this.mainView.onContentChange(this.getData(), 'designer')
    }
    
    onDragEnd(){
        this.onBeforeChange();
        this.htmlCleaning(this.window.document);
        this.onAfterChange();
    }

    onDeleteElement(el){
        if(!el){ return; } // Element does not exist
        if(el.isSameNode(this.window.document.body)){ return; }

        this.onBeforeChange();
        el.remove();
        this.onAfterChange();
    }

    onReplaceNonBreakingSpace(el){
        if(!el){ return; } // Element does not exist
        if(el.isSameNode(this.window.document.body)){ return; }

        this.onBeforeChange()
        let regex = new RegExp(/(\u00AB|\u2014)(?:\s+)?|(?:\s+)?([\?!:;\u00BB])/g);
        el.innerHTML = el.innerHTML.replace("&nbsp; ", "");//Revert old nbsp
        el.innerHTML = el.innerHTML.replace("&nbsp;", "");//Revert old nbsp
        el.innerHTML = el.innerHTML.replace(regex, "$1&nbsp;$2");
        this.onAfterChange();
    }
    
    onMoveNodeUp(el){
        if(el.isSameNode(this.window.document.body)){ return; }

        let parent = el.parentElement;

        this.onBeforeChange()
        if(el.isSameNode(parent.firstElementChild)){
            if(!parent.isSameNode(this.window.document.body)){
                parent.parentElement.insertBefore(el, parent);
            }
        }
        else{
            parent.insertBefore(el, el.previousElementSibling);
        }
        
        this.onAfterChange();
    }

    onMoveNodeDown(el){
        if(el.isSameNode(this.window.document.body)){ return; }

        let parent = el.parentElement;
        this.onBeforeChange()
        if(el.isSameNode(parent.lastElementChild)){
            if(!parent.isSameNode(this.window.document.body)){
                parent.parentElement.insertBefore(el, parent.nextElementSibling);
            }
        }
        else{
            parent.insertBefore(el.nextElementSibling, el);
        }

        this.onAfterChange();
    }

    onCloneNode(selectedElement){
        if(selectedElement.isSameNode(this.window.document.body)){ return; }

        this.onBeforeChange();
        let parent = selectedElement.parentElement;
        let el = selectedElement.cloneNode(true)
        el.removeAttribute("data-selected");
        el.removeAttribute("contenteditable");
        parent.appendChild(el);
        CanvasElement.create(el, this.mainView.onSelectElement, this.mainView.onDragEnd, this.mainView.onEditNodeText);
        this.onAfterChange();
    }

    onInsertNode(elems){
        this.onBeforeChange();

        for(let el of elems){
            CanvasElement.create(el, this.mainView.onSelectElement, this.mainView.onDragEnd, this.mainView.onEditNodeText);
        }
        this.onAfterChange();
    }
   
    getData(htmlCleaning){
        if(this.window === null){ return null; }

        if(htmlCleaning){
            this.htmlCleaning(this.window.document);
        }

        return this.window.document.body.innerHTML;
    }

    getBody(){
        if(this.window === null){ return null; }

        return this.window.document.body;
    }

    setData(value){
        let that = this;

        let loading = function(){
            if(that.window){
                let body = that.window.document.body;
                body.innerHTML = value;
                CanvasElement.create(body, that.mainView.onSelectElement, that.mainView.onDragEnd, that.mainView.onEditNodeText);
            }
            else{
                console.log("Loading designer canvas...");
                setTimeout(loading, 500);
            }
        }
        setTimeout(loading, 500);
    }

    onEditNodeText(selectedElement){ 
        let that = this;     
      
        let setCaretToEnd = function(el) {
            el.focus();
            
            let range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(true);
            let sel = that.window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          
            // set scroll to the end if multiline
            el.scrollTop = el.scrollHeight; 
        }    

        if(selectedElement === null){
            return;
        }

        selectedElement.setAttribute('contenteditable', 'true');
        this.editingElementText = selectedElement.innerHTML;
        setCaretToEnd(selectedElement);
    }

    onKey(e, editingElement) {
        if (e.keyCode === 46) {//del
            console.log(editingElement)
            if (!editingElement || editingElement.getAttribute('contenteditable') != 'true') {
                this.mainView.onDeleteElement(null);
            }
        }

        if (e.ctrlKey && e.keyCode == 90){//ctrl z
            this.historyManager.onUndo(this.mainView.setData, this.mainView.getData());
        }
    }
}

export class SourceCodeState extends CanvasState{
    constructor(mainView){
        super(mainView);

        this.onAfterChange = this.onAfterChange.bind(this);

        this.queryStr = "";
        this.data = "";
    }

    render(show, selectedElement, width, height){
        let style = {
            width: width || Math.min(this.mainView.props.device.width, window.innerWidth - 380 - 10), 
            height: height || Math.min(this.mainView.props.device.height, window.innerHeight - 56 - 10), 
            display: (show ? 'block' : 'none'),
            overflowY: 'auto'
        };
        return <SourceCodeEditor queryStr={this.queryStr} style={style} value={this.data} onChange={this.onAfterChange}/>
    }

    onAfterChange(value){
        this.data = value;
        this.mainView.onContentChange(value, 'sourceCode')
    }

    htmlCleaning(){
        let htmlDoc = new DOMParser().parseFromString(this.data, "text/html");
        super.htmlCleaning(htmlDoc);
        return htmlDoc.body.innerHTML;
    }

    getData(htmlCleaning){
        let result = this.data;

        if(htmlCleaning){
            result = this.htmlCleaning();
        }
        
        return UtilsHTML.removeTagId(result);
    }

    setData(value, el){
        el = el || null;

        if(el !== null){
            this.queryStr = el.getAttribute("data-tag-id") || "";
        }        
        
        this.data = UtilsHTML.assignTagId(value);
    }

    onSelectElement(el, selectedElement, collapsed){ 
        this.queryStr = el.getAttribute("data-tag-id") || "";
        let result = {el: el, collapsed: collapsed };
        return result;
    }

    onCollapse(collapsed){ 
        collapsed.components = true;
        collapsed.properties = true;
        collapsed.treeView = false;
        return collapsed;
    }
}

export class PreviewState extends CanvasState{
    constructor(mainView){
        super(mainView);

        this.iFrame = null;
    }

    onLoadFrame(){
        let iframe = window.document.getElementById("preview-canvas");
        if(iframe){
            this.onInit(iframe);
            return;
        }
        else{
            console.log("Loading preview iframe...");
            setTimeout(this.onLoadFrame, 500);
        }
    }

    onInit(iframe){
        this.iFrame =  iframe.contentWindow || iframe.contentDocument;
        let head = this.iFrame.document.head;
        let doc = this.iFrame.document;
        let style = UtilsMoodle.getThemeMoodleCssRules();
        let el = null

        if (style.rules.length > 0){
            el = doc.createElement("style");
            el.innerHTML = UtilsHTML.cssRules2Str(style.rules);
            head.appendChild(el);
        }

        if (style.url.length > 0){
            for (let url of style.url){            
                el = doc.createElement("link");
                el.setAttribute("href", url);
                el.setAttribute("rel", "stylesheet");
                head.appendChild(el);
            }
        }

        el = doc.createElement("link");
		el.setAttribute("href", `${Assets.CanvasCSS}`);
		el.setAttribute("rel", "stylesheet");
		head.appendChild(el);

        el = doc.createElement("script");
		el.setAttribute("src", `${Assets.JqueryJS}`);
		el.setAttribute("type", "text/javascript");
		head.appendChild(el);

        let bsJs = doc.createElement("script");
		bsJs.setAttribute("src", `${Assets.BootstrapJS}`);
		bsJs.setAttribute("type", "text/javascript");
        el.onload = () => head.appendChild(bsJs); //Wait until jQuery is loaded
        
        this.iFrame.addEventListener("click", function(e) {//Prevent links from working on preview
            if (e.target.tagName == 'A' || e.target.tagName == 'BUTTON'){
                if((e.target.host.toString().length > 0) && (e.target.host !== window.location.host)){
                    e.preventDefault();
                }
            }
        });
    }

    render(show, selectedElement){
        let main = 
            <Canvas style={{display: (show ? 'flex' : 'none') }}> 
                <iframe id="preview-canvas" className="canvas" style={this.getStyle()}></iframe>
            </Canvas>;
        return main;
    }

    onSelectElement(el, selectedElement, collapsed){
        let result = {el: null, collapsed: collapsed};
        return result;
    }

    htmlCleaning(){
        super.htmlCleaning(this.iFrame.document);
        
        //Clean up popups before returning html
        let popup = this.iFrame.document.body.querySelectorAll('.r_popup-overlay');
        for (let el of popup){
            el.remove();
        }
    }

    getData(htmlCleaning){
        this.htmlCleaning();
        return this.iFrame.document.body.innerHTML;
    }

    setData(value){
        let body = this.iFrame.document.body;
        body.innerHTML = value;
    }
}