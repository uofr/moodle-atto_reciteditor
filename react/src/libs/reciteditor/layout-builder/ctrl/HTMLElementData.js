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
import { faRemoveFormat, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify, faPlus, faMinus, faEllipsisH, faGripLines, faSquare, faRuler, faEllipsisV, faFolder} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Utils, UtilsHTML, i18n, LayoutSpacingEditor, Assets} from '../../RecitEditor';

/**
 * Abstract class
 */
class HTMLElement{
    constructor(name, tagName, type, properties){
        this.name = name || "";
        this.tagName = tagName || "";
        this.type = type || "native";
        this.properties = properties || [];
        this.cssProp = {prefix: "bg"};
        this.visible = true;
        this.collapsePanel = null;
    }

    getDesc(el){
        return this.name;
    }

    create(){ 
        let el = document.createElement(this.tagName);
        return el;
    }

    equal(el){
        if(el === null){ return false; }

        return (el.tagName.toLowerCase() === this.tagName.toLowerCase());
    }

    createElementDZ(desc){
        let el = document.createElement("div");
        el.classList.add("dropping-zone");
        el.innerText = desc || "";
        return el;
    }

    prepareDroppingZones(el){ 
        if(el.children.length > 0){
            el.insertBefore(this.createElementDZ(i18n.get_string('insidebegining')), el.firstChild);    
            el.appendChild(this.createElementDZ(i18n.get_string('insideend')));
        } 
        else{
            el.appendChild(this.createElementDZ(i18n.get_string('inside')));
        }

        el.parentNode.insertBefore(this.createElementDZ(i18n.get_string('before')), el);
        el.parentNode.insertBefore(this.createElementDZ(i18n.get_string('after')), el.nextSibling);
    }
}

class HTMLBodyElement extends HTMLElement{
    constructor(){
        super('Body', 'body', 'native');
        this.visible = false;
    }

    prepareDroppingZones(el){ 
        if(el.children.length > 0){
            el.insertBefore(this.createElementDZ(i18n.get_string('insidebegining')), el.firstChild);    
            el.appendChild(this.createElementDZ(i18n.get_string('insideend')));
        } 
        else{
            el.appendChild(this.createElementDZ(i18n.get_string('inside')));
        }
    }
}

class HTMLHeadingElement extends HTMLElement{
    constructor(name, tagName){
        super(name, tagName, 'native', HTMLElementData.propsAssignmentFacade.text);
    }

    create(){ 
        let el = document.createElement(this.tagName);
        el.innerText = el.tagName.toLowerCase();
        return el;
    }

    prepareDroppingZones(el){        
        el.parentNode.insertBefore(this.createElementDZ(i18n.get_string('before')), el);
        el.parentNode.insertBefore(this.createElementDZ(i18n.get_string('after')), el.nextSibling);
    }
}

class HTMLParagraphElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('paragraph'), 'p', 'native', HTMLElementData.propsAssignmentFacade.text);
    }

    create(){ 
        let el = document.createElement(this.tagName);
        el.innerText = i18n.get_string('paragraph');
        return el;
    }

    prepareDroppingZones(el){        
        el.parentNode.insertBefore(this.createElementDZ(i18n.get_string('before')), el);
        el.parentNode.insertBefore(this.createElementDZ(i18n.get_string('after')), el.nextSibling);
    }
}

class HTMLLinkElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('link'), "a", 'native', [...HTMLElementData.propsAssignmentFacade.buttons, 'link']);
        this.cssProp.prefix = 'btn';
    }

    create(){ 
        let el = document.createElement(this.tagName);
        el.innerText = i18n.get_string('link');
        el.setAttribute('href', '#');
        el.setAttribute('target', '_self');
        return el;
    }
}

class HTMLButtonElement extends HTMLElement{
    constructor(name, tagName, type, properties){
        super(name, tagName, type, properties);
        this.cssProp.prefix = 'btn';
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('btn') && el.tagName.toLowerCase() !== "a");
    }

    create(){ 
        let el = document.createElement("button");
        el.classList.add('btn');
        el.classList.add('btn-primary');
        el.innerHTML = i18n.get_string('button');
        return el;
    }
}

class HTMLButtonCollapseElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('collapsebutton'), 'buttoncollapse', 'bootstrap', [...HTMLElementData.propsAssignmentFacade.controls, 'collapse']);
        this.cssProp.prefix = 'btn';
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('btn-collapse'));
    }

    create(){ 
        let el = document.createElement("button");
        el.classList.add('btn');
        el.classList.add('btn-primary', 'btn-collapse');
        el.setAttribute('data-bs-toggle', 'collapse');
        el.innerHTML = i18n.get_string('collapsebutton');
        return el;
    }
}

class HTMLButtonVideoElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('videobutton'), 'videobtn', 'bootstrap', [...HTMLElementData.propsAssignmentFacade.buttons, 'videobtn']);
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('attoreciteditor_videobtn'));
    }

    create(){ 
        let el = document.createElement("button");
        el.innerHTML = i18n.get_string('videobutton');
        el.classList.add('btn');
        el.classList.add('btn-primary');
        el.classList.add('attoreciteditor_videobtn');
        el.setAttribute('data-videourl', 'https://www.youtube.com/embed/WvljI0VIq-E?rel=0');
        return el;
    }
}

class HTMLMediaElement extends HTMLElement{
    constructor(name, tagName, type, properties){
        super(name, tagName, type, properties);
    }
}

class HTMLAudioElement extends HTMLMediaElement{
    constructor(){
        super(i18n.get_string('audio'), 'audio', 'native', ['bs-general', 'bs-spacingborder', 'htmlattributes', 'source', 'layout']);
    }

    create(){ 
        let el = document.createElement(this.tagName);
        el.setAttribute('controls', '');
        return el;
    }
}

class HTMLVideoElement extends HTMLMediaElement{
    constructor(name, tagName, type){
        super(name, 'video', type, ['bs-general', 'bs-spacingborder', 'htmlattributes', 'videosource', 'layout']);
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('video') || el.classList.contains('video-container'));
    }

    create(){
        let el = document.createElement("div");
        el.classList.add('embed-responsive');
        el.classList.add('embed-responsive-16by9');
        el.classList.add('video-container');
        
        let iframe = document.createElement("iframe");
        iframe.classList.add('embed-responsive-item');
        iframe.classList.add('video');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '1');
        iframe.src = 'https://www.youtube.com/embed/WvljI0VIq-E?rel=0'
        el.appendChild(iframe)
        return el;
    }
}

class HTMLDivElement extends HTMLElement{
    constructor(name, tagName, type, properties){
        super(name || "Div", tagName || "div", type || 'native', properties || HTMLElementData.propsAssignmentFacade.containers);
    }
}

class HTMLEmbedElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('embed'), 'div', 'bootstrap', ['bs-general', 'bs-spacingborder','marginborderpadding', 'layout', 'embed']);
    }

    create(){ 
        let el = document.createElement('div');
        el.classList.add('embedelement');
        return el;
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('embedelement'));
    }
}

class HTMLSpanElement extends HTMLElement{
    constructor(){
        super("Span", "span", 'native', HTMLElementData.propsAssignmentFacade.containers);
    }
}

class HTMLSectionElement extends HTMLElement{
    constructor(){
        super("Section", "section", 'native', HTMLElementData.propsAssignmentFacade.containers);
    }
}

class HTMLGridElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('grid'), 'grid', 'bootstrap', HTMLElementData.propsAssignmentFacade.containers);
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('container') || el.classList.contains('container-fluid'));
    }
    
    create(){
        let el = document.createElement("div");
        el.classList.add("container");
        
        let row = document.createElement("div");
        row.classList.add("row");
        el.appendChild(row);

        
        let col = document.createElement("div");
        col.classList.add("col");
        row.appendChild(col);

        col = document.createElement("div");
        col.classList.add("col");
        row.appendChild(col);

        col = document.createElement("div");
        col.classList.add("col");
        row.appendChild(col);

        return el;
    }
}

class HTMLRowElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('row'), 'row', 'bootstrap', HTMLElementData.propsAssignmentFacade.containers);
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('row') || el.classList.contains('attoreciteditor_row-fluid'));
    }

    create(){
        let el = document.createElement("div");
        el.classList.add("row");
        return el;
    }
}

class HTMLColElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('column'), 'col', 'bootstrap', HTMLElementData.propsAssignmentFacade.containers);
    }

    equal(el){
        if(el === null){ return false; }

        let containsCol = false;
        for (let i = 0; i <= 12; i++){
            if (el.classList.contains('col-'+i)){
                containsCol = true;
            }
        }
        return (el.classList.contains('col') || containsCol);
    }

    create(){
        let el = document.createElement("div");
        el.classList.add("col");
        return el;
    }

    prepareDroppingZones(el){        
        if(el.children.length > 0){
            el.insertBefore(this.createElementDZ(i18n.get_string('insidebegining')), el.firstChild);    
            el.appendChild(this.createElementDZ(i18n.get_string('insideend')));
        } 
        else{
            el.appendChild(this.createElementDZ(i18n.get_string('inside')));
        }
    }
}

class HTMLUListElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('list'), "ul", 'native', HTMLElementData.propsAssignmentFacade.containers);
    }

    create(){
        let el = document.createElement(this.tagName);
        el.innerHTML = "<li>"+i18n.get_string('list')+"</li>";
        return el;
    }
}

class HTMLOListElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('numberedlist'), "ol", 'native', HTMLElementData.propsAssignmentFacade.containers);
    }

    create(){
        let el = document.createElement(this.tagName);
        el.innerHTML = "<li>"+i18n.get_string('numberedlist')+"</li>";
        return el;
    }
}

class HTMLTableElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('table'), 'table', 'nativecomponent', ['table', ...HTMLElementData.propsAssignmentFacade.containers]);
        this.cssProp.prefix = 'table';
    }

    create(){
        let el = document.createElement('table');
        el.classList.add('table')
        let tbody = document.createElement('tbody')
        el.appendChild(tbody)
       
        for (let i = 0; i < 2; i++){
            let row = document.createElement('tr');
            tbody.appendChild(row);
            for (let j = 0; j < 2; j++){
                let tag = 'td';
                if (i == 0) tag = 'th'
                let cell = document.createElement(tag)
                row.appendChild(cell)
            }
        }

        return el;
    }
}

class HTMLTableDataCellElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('tablecell'), "td", 'native', ['tablecell', ...HTMLElementData.propsAssignmentFacade.containers]);
        this.visible = false;
    }

    create(){
        let el = document.createElement(this.tagName);
        el.innerHTML = i18n.get_string('tablecell');
        return el;
    }
}

class HTMLTableHeaderCellElement extends HTMLElement{
    constructor(){
        super("Titre de la table", "th", 'native', ['tablecell', ...HTMLElementData.propsAssignmentFacade.containers]);
        this.visible = false;
    }

    create(){
        let el = document.createElement(this.tagName);
        el.innerHTML = i18n.get_string('tablecell');
        return el;
    }
}

class HTMLTableRowElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('tablerow'), "tr", 'native', HTMLElementData.propsAssignmentFacade.containers);
        this.visible = false;
    }

    create(){
        let el = document.createElement(this.tagName);
        return el;
    }
}

class HTMLLIElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('listitem'), "li", 'native', ['bs-general', 'bs-spacingborder', 'htmlattributes', 'font', 'layout', 'background']);
    }

    create(){
        let el = document.createElement(this.tagName);
        el.innerText = i18n.get_string('listitem');
        return el;
    }
}

class HTMLAlertElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('alert'), "div", 'bootstrap');
        this.cssProp.prefix = "alert";
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('alert'));
    }

    create(){
        let el = document.createElement(this.tagName);
        el.classList.add("alert");
        el.classList.add("alert-primary");
        el.setAttribute("role", "alert");
        return el;
    }
}

class HTMLCardElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('card'), "div", 'bootstrap');
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('card'));
    }

    create(){
        let card = document.createElement("div");
        card.classList.add("card");
        
        let el = document.createElement("div");
        el.classList.add("card-header");
        card.appendChild(el);

        el = document.createElement("div");
        el.classList.add("card-body");
        card.appendChild(el);

        el = document.createElement("div");
        el.classList.add("card-footer");
        card.appendChild(el);

        return card;
    }
}

class HTMLCardBodyElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('cardbody'), "div", 'bootstrap');
        this.visible = false;
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('card-body'));
    }

    create(){
        let el = document.createElement("div");
        el.classList.add("card-body");
        return el;
    }
}

class HTMLCardHeaderElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('cardheader'), "div", 'bootstrap');
        this.visible = false;
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('card-header'));
    }

    create(){
        let el = document.createElement("div");
        el.classList.add("card-header");
        return el;
    }
}

class HTMLCardFooterElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('cardfooter'), "div", 'bootstrap');
        this.visible = false;
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('card-footer'));
    }

    create(){
        let el = document.createElement("div");
        el.classList.add("card-footer");
        return el;
    }
}

class HTMLFlipCardElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('flipcard'), "div", 'nativecomponent');
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('attoreciteditor_flipcard2'));
    }

    create(){
        let card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("attoreciteditor_flipcard2");
        card.classList.add("manual-flip-click");
        let cardinner = document.createElement("div");
        cardinner.classList.add("flipcard-inner");
        card.appendChild(cardinner);
        
        for (let v of ['front', 'back']){
            let face = document.createElement("div");
            face.classList.add(v);
            cardinner.appendChild(face);
            
            let head = document.createElement("div");
            head.classList.add("card-header");
            head.classList.add("bg-primary");
            head.classList.add("text-center");
            face.appendChild(head);

            let head2 = document.createElement("div");
            head.appendChild(head2);
            
            let el = document.createElement("img");
            el.classList.add("w-25");
            el.classList.add("rounded-circle");
            el.classList.add("shadow");
            el.setAttribute("src", `${Assets.ImageEmptyHD}`);
            head2.appendChild(el);
            
            el = document.createElement("h3");
            el.style.color = '#fff';
            el.innerHTML = 'Title '+v;
            head2.appendChild(el);
            
            el = document.createElement("p");
            el.style.color = '#c6c6c6';
            el.innerHTML = 'Lorem';
            head2.appendChild(el);

            el = document.createElement("div");
            el.classList.add("card-body");
            face.appendChild(el);

            el = document.createElement("div");
            el.classList.add("card-footer");
            face.appendChild(el);
        }

        return card;
    }
}

class HTMLFlipCardFrontElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('front'), "div", 'nativecomponent');
        this.collapsePanel = {components: true, properties: false, treeView: false};
        this.visible = false;
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('front'));
    }

    onSelect(el){
        let flipcard = el.parentElement.parentElement;
        flipcard.classList.remove('hover');
    }
}

class HTMLFlipCardBackElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('rear'), "div", 'nativecomponent');
        this.visible = false;
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('back'));
    }

    onSelect(el){
        let flipcard = el.parentElement.parentElement;
        flipcard.classList.add('hover');
    }
}

class HTMLMediaBSElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('media'), "div", 'bootstrap');
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('media'));
    }

    create(){
        let media = document.createElement("div");
        media.classList.add("media");
        
        let el = document.createElement("img");
        el.classList.add("mr-3");
        el.setAttribute("src", `${Assets.ImageEmpty}`);
        media.appendChild(el);

        let body = document.createElement("div");
        body.classList.add("media-body");
        media.appendChild(body);

        el = document.createElement("h5");
        el.classList.add("mt-0");
        el.innerHTML = 'Media heading';
        body.appendChild(el);

        body.innerHTML += "Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.";

        return media;
    }
}

class HTMLMediaBSBodyElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('mediabody'), "div", 'bootstrap');
        this.visible = false;
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('media-body'));
    }
}

class HTMLCarouselElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('carousel'), "div", 'nativecomponent', ['bs-general', 'htmlattributes']);
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('carousel') || el.classList.contains('carousel-inner') || el.classList.contains('carousel-item'));
    }

    create(){
        let slider = document.createElement("div");
        slider.classList.add("carousel");
        slider.classList.add("slide");
        slider.setAttribute("data-ride", "carousel");

        slider.innerHTML = 
            `<div id="carouselInd" class="carousel slide" data-ride="carousel" data-tag-id="3">
        <ol class="carousel-indicators" data-tag-id="4">
            <li data-target="#carouselInd" data-slide-to="0" data-tag-id="5">
            </li>
            <li data-target="#carouselInd" data-slide-to="1" data-tag-id="6">
            </li>
            <li data-target="#carouselInd" data-slide-to="2" data-tag-id="7">
            </li>
        </ol>
        <div class="carousel-inner" data-tag-id="8">
            <div class="carousel-item active" data-tag-id="9">
            <img class="d-block w-100" src="https://picsum.photos/1500/480" alt="First slide" data-tag-id="10">
            <div class="carousel-caption d-none d-md-block" data-tag-id="11">
                <h3 class="h5" data-tag-id="12">
                Titre 1
                </h3>
                <p data-tag-id="13">
                Paragraphe 1
                </p>
            </div>
            </div>
            <div class="carousel-item" data-tag-id="14">
            <img class="d-block w-100" src="https://picsum.photos/1500/480" alt="Second slide" data-tag-id="15">
            <div class="carousel-caption d-none d-md-block" data-tag-id="16">
                <h3 class="h5" data-tag-id="17">
                Titre 2
                </h3>
                <p data-tag-id="18">
                Paragraphe 2
                </p>
            </div>
            </div>
            <div class="carousel-item" data-tag-id="19">
            <img class="d-block w-100" src="https://picsum.photos/1500/480" alt="Third slide" data-tag-id="20">
            <div class="carousel-caption d-none d-md-block" data-tag-id="21">
                <h3 class="h5" data-tag-id="22">
                Titre 3
                </h3>
                <p data-tag-id="23">
                Paragraphe 3
                </p>
            </div>
            </div>
        </div>
        <a class="carousel-control-prev" href="#carouselInd" role="button" data-slide="prev" data-tag-id="24">
            <i class="fa-3x fa fa-arrow-circle-left" data-tag-id="25"></i>
            <span class="sr-only" data-tag-id="26">
                Précédent
                </span>
        </a>
        <a class="carousel-control-next" href="#carouselInd" role="button" data-slide="next" data-tag-id="27">
            <i class="fa-3x fa fa-arrow-circle-right" data-tag-id="28"></i>
            <span class="sr-only" data-tag-id="29">
                Suivant
                </span>
        </a>
        </div>`;

        return slider;
    }

    onSelect(el){
        if(el.classList.contains("carousel-item")){
            let slider = el.parentElement;
            let slides = slider.querySelectorAll('.carousel-item');
            for(let slide of slides){
                slide.classList.remove('active');
            }
            el.classList.add('active');
        }
    }
}

class HTMLCarouselNavElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('carouselnav'), "div", 'nativecomponent', ['bs-general', 'htmlattributes']);
        this.visible = false;
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('carousel-control-prev') || el.classList.contains('carousel-control-next'));
    }
}

class HTMLTabElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('tab'), "div", 'nativecomponent', ['tab', ...HTMLElementData.propsAssignmentFacade.containers]);
        this.cssProp.prefix = 'tab';
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('tabs') || el.classList.contains('carousel-control-next'));
    }

    create(){
        let slider = document.createElement("div");
        slider.classList.add("tabs");

        slider.innerHTML = 
            `
            <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#tab1" role="tab" aria-controls="tab1">
                    Onglet 1
                </a>
                </li>
                <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#tab2" role="tab" aria-controls="tab2">
                    Onglet 2
                </a>
                </li>
                <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#tab3" role="tab" aria-controls="tab3">
                    Onglet 3
                </a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade show active mt-3" id="tab1" role="tabpanel" aria-labelledby="tab1">
                    <p>Contenu de l'onglet 1</p>
                </div>
                <div class="tab-pane fade mt-3" id="tab2" role="tabpanel" aria-labelledby="tab2">
                    <p>Contenu de l'onglet 2</p>
                </div>
                <div class="tab-pane fade mt-3" id="tab3" role="tabpanel" aria-labelledby="tab3">
                    <p>Contenu de l'onglet 3</p>
                </div>
            </div>`;

        return slider;
    }
}

class HTMLAccordionElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('accordion'), "div", 'nativecomponent', ['accordion', ...HTMLElementData.propsAssignmentFacade.containers]);
        this.cssProp.prefix = 'accordion';
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('accordion'));
    }

    create(){
        let slider = document.createElement("div");
        slider.classList.add("accordion");
        slider.id = "accordion-"+ Math.floor(Math.random() * 1000);

        slider.innerHTML = 
            `
            <div class="card">
              <div class="card-header" id="headingOne">
                <h2 class="mb-0">
                  <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Item #1
                  </button>
                </h2>
              </div>
          
              <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#${slider.id}">
                <div class="card-body">
                  Item #1
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header" id="headingTwo">
                <h2 class="mb-0">
                  <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Item #2
                  </button>
                </h2>
              </div>
              <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#${slider.id}">
                <div class="card-body">
                  Item #2
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header" id="headingThree">
                <h2 class="mb-0">
                  <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Item #3
                  </button>
                </h2>
              </div>
              <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#${slider.id}">
                <div class="card-body">
                  Item #3
                </div>
              </div>
            </div>`;

        return slider;
    }
}

class HTMLAccordionNavElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('accordionitem'), "button", 'bootstrap', ['accordion', ...HTMLElementData.propsAssignmentFacade.containers]);
        this.visible = false;
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }
        if(!el.parentElement || 
            !el.parentElement.parentElement || 
            !el.parentElement.parentElement.parentElement || 
            !el.parentElement.parentElement.parentElement.parentElement){ return false; }


        return (el.parentElement.parentElement.parentElement.parentElement.classList.contains('accordion'));
    }
}

class HTMLTabContentElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('tabcontent'), "div", 'bootstrap', ['bs-general', 'htmlattributes']);
        this.cssProp.prefix = 'tab';
        this.visible = false;
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('tab-content'));
    }
}

class HTMLTabPaneElement extends HTMLDivElement{
    constructor(){
        super(i18n.get_string('tabcontent'), "div", 'bootstrap', ['bs-general', 'htmlattributes']);
        this.cssProp.prefix = 'tab';
        this.visible = false;
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('tab-pane'));
    }

    getDesc(el){
        let tab = el.parentElement.parentElement;
        let target = tab.querySelector('[aria-controls="'+el.id+'"]');
        if (!target) return this.name;
        return i18n.get_string('tabcontent')+' '+target.innerText;
    }
}

class HTMLNavElement extends HTMLElement{
    constructor(){
        super("Nav", "nav", 'bootstrap', ['bs-general', 'htmlattributes']);
        this.visible = false;
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('nav'));
    }
}

class HTMLNavItemElement extends HTMLElement{
    constructor(){
        super("NavItem", "li", 'bootstrap', ['bs-general', 'htmlattributes']);
        this.visible = false;
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('nav-item'));
    }
}

class HTMLNavLinkElement extends HTMLElement{
    constructor(){
        super("NavLink", "a", 'bootstrap', [...HTMLElementData.propsAssignmentFacade.buttons, 'link']);
        this.cssProp.prefix = 'btn';
        this.visible = false;
        this.collapsePanel = {components: true, properties: false, treeView: false};
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('nav-link'));
    }

    onSelect(el){
        if(el.parentElement.parentElement.parentElement.classList.contains("tabs")){
            let tab = el.parentElement.parentElement.parentElement;
            let target = el.getAttribute('aria-controls');
            target = tab.querySelector('#'+target);
            if (!target) return;
            let items = tab.querySelectorAll('.tab-pane');
            for(let it of items){
                it.classList.remove('active', 'show');
            }
            items = tab.querySelectorAll('.nav-link');
            for(let it of items){
                it.classList.remove('active', 'show');
            }
            
            el.classList.add('active', 'show');
            target.classList.add('active', 'show');
        }
    }
}

class HTMLHRElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('split'), "hr", 'native', HTMLElementData.propsAssignmentFacade.containers);
    }
}

class HTMLImageElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('image'), "img", 'bootstrap', ['bs-general', 'bs-spacing', 'bs-border', 'htmlattributes', 'source', 'layout']);
    }

    create(){
        let el = document.createElement("img");
        el.setAttribute('src', `${Assets.ImageEmpty}`);
        el.classList.add("img-fluid");
        return el;
    }
}

class HTMLImageWithCaptionElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('imagewithcaption'), "figure", 'bootstrap', ['bs-general', 'bs-spacing', 'bs-border', 'htmlattributes', 'source', 'layout']);
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('attoreciteditor_img-popup'));
    }

    create(){
        let div = document.createElement("figure");
        div.classList.add('figure-caption');
        div.classList.add('text-center');
        
        let el = document.createElement("img");
        el.setAttribute('src', `${Assets.ImageEmpty}`);
        el.classList.add("img-fluid");
        el.classList.add("attoreciteditor_img-popup");
        div.appendChild(el);

        el = document.createElement("figcaption");
        el.innerHTML = "Source : Nom de l'auteur, <span class='font-italic'>titre de la photo ou de l'oeuvre</span> (année), nom de l'institution qui possède l'œuvre.";
        div.appendChild(el);

        return div;
    }
}

class HTMLClickableImageElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('clickableimage'), "div", 'bootstrap', ['bs-general', 'bs-spacing', 'bs-border', 'htmlattributes', 'source', 'layout']);
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('attoreciteditor_imgclick'));
    }

    create(){
        let div = document.createElement("div");
        div.classList.add('attoreciteditor_imgclick');
        
        let el = document.createElement("img");
        el.setAttribute('src', `${Assets.ImageEmpty}`);
        el.classList.add("img-fluid");
        div.appendChild(el);

        let div2 = document.createElement("div");
        div2.classList.add('imgclickcontent');
        el = document.createElement("a");
        el.classList.add('border');
        el.classList.add('border-white');
        el.classList.add('rounded');
        el.classList.add('p-2');
        el.href = '#';
        el.innerHTML = i18n.get_string('getstarted');
        div2.appendChild(el);
        div.appendChild(div2);

        return div;
    }
}

class HTMLIconElement extends HTMLElement{
    constructor(){
        super(i18n.get_string('icon'), "i", 'native', ['icon', 'font', 'bs-general', 'bs-text', 'bs-spacing', 'bs-border', 'htmlattributes']);
    }

    equal(el){
        if(el === null){ return false; }

        return (el.classList.contains('fa') || (el.classList[0] && el.classList[0].includes('icon-')));
    }

    create(){
        let el = document.createElement(this.tagName);
        el.classList.add('fa', 'fa-anchor'); //Default icon
        return el;
    }
}

export class HTMLElementData{

    static propertyList = [
        {
            name: 'layout', description: i18n.get_string('layout'), type: 'styleattr',
            children: [
                {
                    name: 'Width', 
                    text: i18n.get_string('width'),
                    input: { 
                        type: 'minvaluemax', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                            el.style.minWidth = value['min'];
                            el.style.width = value['value'];
                            el.style.maxWidth = value['max'];
                        }
                    },
                    getValue: function(el, data){
                        return {min:el.style.minWidth, value:el.style.width, max:el.style.maxWidth};
                    }
                },
                {
                    name: 'Height', 
                    text: i18n.get_string('height'),
                    input: { 
                        type: 'minvaluemax', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                            el.style.minHeight = value['min'];
                            el.style.height = value['value'];
                            el.style.maxHeight = value['max'];
                        }
                    },
                    getValue: function(el, data){
                        return {min:el.style.minHeight, value:el.style.height, max:el.style.maxHeight};
                    }
                }
            ]
        },
        {
            name: 'font', description: i18n.get_string('font'), type: 'styleattr',
            children: [
                {
                    name: 'alignment', 
                    text: i18n.get_string('align'),
                    input: { 
                        type: 'radio', 
                        options:[
                            {text: <FontAwesomeIcon icon={faRemoveFormat} title={i18n.get_string('default')}/>, value:'default'},
                            {text: <FontAwesomeIcon icon={faAlignLeft} title={i18n.get_string('alignleft')}/>, value:'text-left' },
                            {text: <FontAwesomeIcon icon={faAlignCenter} title={i18n.get_string('aligncenter')}/>, value:'text-center' },
                            {text: <FontAwesomeIcon icon={faAlignRight} title={i18n.get_string('alignright')}/>, value:'text-right' },
                            {text: <FontAwesomeIcon icon={faAlignJustify} title={i18n.get_string('justify')}/>, value:'text-justify' }
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
                            if (el.classList.contains(option.value)){
                                return [option.value];
                            }
                        }
                        
                        return data.input.defaultValue;
                    }
                },
                {
                    name: 'fontsize', 
                    text: i18n.get_string('fontsize'),
                    input: { 
                        type: 'text', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                           el.style.fontSize = value;
                        }
                    },
                    getValue: function(el, data){
                        return el.style.fontSize;
                    }
                },
                {
                    name: 'fontfamily', 
                    text: i18n.get_string('font'),
                    input: { 
                        type: 'combobox',
                        options: [
                            {text: 'Sans-serif', value:'sans-serif'},
                            {text: 'Serif', value:'serif'},
                            {text: 'Monospace', value:'monospace'},
                            {text: 'Cursive', value:'cursive'},
                            {text: 'Fantasy', value:'Fantasy'},
                            ...UtilsHTML.getAvailableFonts(),
                        ],
                        defaultValue: '',
                        onChange: function(el, value, data){
                           el.style.fontFamily = value;
                        }
                    },
                    getValue: function(el, data){
                        return el.style.fontFamily;
                    }
                },
                {
                    name: 'color', 
                    text: i18n.get_string('color'),
                    input: { 
                        type: 'color', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                           el.style.color = value;
                        }
                    },
                    getValue: function(el, data){
                        return (el.style.color ? el.style.color : '#000000');
                    }
                },
            ]
        },
        {
            name: 'background', description: i18n.get_string('background'),  type: 'styleattr',
            children: [
                {
                    name: 'backgroundcolor', 
                    text: i18n.get_string('backgroundcolor'),
                    input: { 
                        type: 'color', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                           el.style.backgroundColor = value;
                        }
                    },
                    getValue: function(el, data){
                        return (el.style.backgroundColor ? el.style.backgroundColor : '#FFFFFF');
                    }
                },
                {
                    name: 'backgroundimage', 
                    text: i18n.get_string('backgroundimage'),
                    input: { 
                        type: 'ImageSrc', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                            if(value.length > 0){
                                el.style.backgroundImage = `url('${value}')`;
                            }
                            else{
                                el.style.backgroundImage = "";
                            }
                        }
                    },
                    getValue: function(el){
                        return (el.style.backgroundImage ? el.style.backgroundImage : '');
                    }
                }
            ]
        },
        {
            name: 'icon', description: i18n.get_string('icon'),  type: 'bootstrap',
            children: [
                {
                    name: 'icon', 
                    text: i18n.get_string('icon'),
                    input: { 
                        type: 'iconselector',
                        text: i18n.get_string('selecticon'),
                        onChange: function(el, value, data){
                           el.setAttribute('class', value);
                        }
                    },
                    getValue: function(el, data){
                        return el.getAttribute('class');
                    }
                },
                {
                    name: 'iconsize',
                    text: i18n.get_string('iconsize'),
                    input: { 
                        type: 'combobox',
                        options:[
                            {text:"fa-lg", value: "fa-lg"},
                            {text:"fa-xs", value: "fa-xs"},
                            {text:"fa-sm", value: "fa-sm"},
                            {text:"fa-1x", value: "fa-1x"},
                            {text:"fa-2x", value: "fa-2x"},
                            {text:"fa-3x", value: "fa-3x"},
                            {text:"fa-4x", value: "fa-4x"},
                            {text:"fa-5x", value: "fa-5x"},
                            {text:"fa-6x", value: "fa-6x"},
                            {text:"fa-7x", value: "fa-7x"},
                            {text:"fa-8x", value: "fa-8x"},
                            {text:"fa-9x", value: "fa-9x"},
                            {text:"fa-10x", value: "fa-10x"},
                            {text:"fa-fw", value: "fa-fw"},
                        
                        ],
                        onChange: function(el, value, data){                       
                            for(let item of data.input.options){
                                el.classList.remove(item.value);
                            }
    
                            if(value.length > 0){
                                el.classList.add(value);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let result = "";
    
                        let classList = [...el.classList]
    
                        for(let item of data.input.options){
                            if(classList.includes(item.value)){
                                result = item.value;
                                break;
                            }
                        }
    
                        return result;
                    }
                }
            ]
        },
        {
            name: 'link', description: i18n.get_string('linkoptions'),  type: 'htmlattr',
            children: [
                {
                    name: 'href', 
                    text: i18n.get_string('href'),
                    input: { 
                        type: 'text', 
                        onChange: function(el, value, data){
                            el.setAttribute('href', value);
                        }
                    },
                    getValue: function(el){
                        return el.getAttribute('href');
                    }
                },
                {
                    name: 'target', 
                    text: i18n.get_string('linkaction'),
                    input: { 
                        type: 'radio', 
                        options:[
                            {text: i18n.get_string('samepage'), value:'_self'},
                            {text: i18n.get_string('newtab'), value:'_blank' },
                        ],
                        onChange: function(el, value, data){
                            el.setAttribute('target', value);
                        }
                    },
                    getValue: function(el, data){
                        return [el.getAttribute('target')];
                    }
                },
            ]
        },
        {
            name: 'source', description: i18n.get_string('source'),  type: 'htmlattr',
            children: [
                {
                    name: 'src', 
                    text: i18n.get_string('source'),
                    input: { 
                        type: 'ImageSrc', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                            el.src = value;
                        }
                    },
                    getValue: function(el){
                        return el.src;
                    }
                }
            ]
        },
        {
            name: 'videobtn', description: i18n.get_string('source'),  type: 'htmlattr',
            children: [
                {
                    name: 'src', 
                    text: i18n.get_string('videourl'),
                    input: { 
                        type: 'text', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                            value = Utils.formatVideoURLEmbed(value);
                            el.setAttribute('data-videourl', value);
                        }
                    },
                    getValue: function(el){
                        return el.getAttribute('data-videourl') || '';
                    }
                }
            ]
        },
        {
            name: 'videosource', description: i18n.get_string('source'),  type: 'htmlattr',
            children: [
                {
                    name: 'src', 
                    text: i18n.get_string('videourl'),
                    input: {
                        type: 'text', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                            let iframe = el;
                            value = Utils.formatVideoURLEmbed(value);
                            if (el.tagName == 'DIV') iframe = el.querySelector('iframe');
                            iframe.src = value;
                        }
                    },
                    getValue: function(el){
                        let iframe = el;
                        if (el.tagName == 'DIV') iframe = el.querySelector('iframe');
                        return iframe.src;
                    }
                }
            ]
        },
        {
            name: 'embed', description: i18n.get_string('properties'),  type: 'htmlattr',
            children: [
                {
                    name: 'src',
                    text: i18n.get_string('htmlcode'),
                    input: {
                        type: 'textarea',
                        defaultValue: '',
                        onChange: function(el, value, data){
                            el.innerHTML = value;
                        }
                    },
                    getValue: function(el){
                        return el.innerHTML;
                    }
                }
            ]
        },
        {
            name: 'tab', description: i18n.get_string('taboptions'),  type: 'bootstrap',
            children: [
                {
                    name: 'style', 
                    text: i18n.get_string('style'),
                    input: {
                        type: 'radio',
                        options:[
                            {text: <FontAwesomeIcon icon={faFolder} title={i18n.get_string('tab')}/>, value:'nav-tabs'},
                            {text: <FontAwesomeIcon icon={faEllipsisH} title={i18n.get_string('pill')}/>, value:'nav-pills'}
                        ],
                        onChange: function(el, value, data){
                            let tab = el;
                            if (el.classList.contains('nav-link')) tab = el.parentElement.parentElement;
                            if (el.classList.contains('tab-pane')) tab = el.parentElement.parentElement.querySelector('.nav');
                            if (el.classList.contains('tabs')) tab = el.querySelector('.nav');
                            
                            if(tab){
                                tab.classList.remove('nav-pills');
                                tab.classList.remove('nav-tabs');
                                tab.classList.add(value);
                            }
                        }
                    },
                    getValue: function(el){
                        let tab = el;
                        if (el.classList.contains('nav-link')) tab = el.parentElement.parentElement;
                        if (el.classList.contains('tab-pane')) tab = el.parentElement.parentElement.querySelector('.nav');
                        if (el.classList.contains('tabs')) tab = el.querySelector('.nav');

                        if (tab && tab.classList.contains('nav-pills')) return 'nav-pills';
                        return '';
                    }
                },
                {
                    name: 'justify',
                    text: i18n.get_string('justify'),
                    input: {
                        type: 'radio',
                        options:[
                            {text: <FontAwesomeIcon icon={faAlignLeft} title={i18n.get_string('left')}/>, value:''},
                            {text: <FontAwesomeIcon icon={faAlignCenter} title={i18n.get_string('center')}/>, value:'justify-content-center'},
                            {text: <FontAwesomeIcon icon={faAlignRight} title={i18n.get_string('right')}/>, value:'justify-content-end'},
                            {text: <FontAwesomeIcon icon={faAlignJustify} title={i18n.get_string('fullwidth')}/>, value:'nav-fill'},
                            {text: <FontAwesomeIcon icon={faEllipsisV} title={i18n.get_string('horizontal')}/>, value:'flex-column'},
                        ],
                        onChange: function(el, value, data){
                            let tab = el;
                            if (el.classList.contains('nav-link')) tab = el.parentElement.parentElement;
                            if (el.classList.contains('tab-pane')) tab = el.parentElement.parentElement.querySelector('.nav');
                            if (el.classList.contains('tabs')) tab = el.querySelector('.nav');
                            
                            if(tab){
                                if (tab.classList.length > 0){
                                    for(let item of data.input.options){
                                        if (item.value.length > 0)
                                            tab.classList.remove(item.value);
                                    }
                                }
                                tab.classList.add(value);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let tab = el;
                        if (el.classList.contains('nav-link')) tab = el.parentElement.parentElement;
                        if (el.classList.contains('tab-pane')) tab = el.parentElement.parentElement.querySelector('.nav');
                        if (el.classList.contains('tabs')) tab = el.querySelector('.nav');

                        for(let item of data.input.options){
                            if (tab.classList.contains(item.value)) return item.value;
                        }
                        return '';
                    }
                },
                {
                    name: 'addtab',
                    text: i18n.get_string('actions'),
                    input: {
                        type: 'buttongroup',
                        options: [
                            {
                                text: <span><FontAwesomeIcon icon={faPlus} title={i18n.get_string('addtab')}/>{i18n.get_string('tab')}</span>,
                                onClick: function(el, value, data){
                                    let tab = el;
                                    if (el.classList.contains('nav-link')) tab = el.parentElement.parentElement;
                                    if (el.classList.contains('tab-pane')) tab = el.parentElement.parentElement.querySelector('.nav');
                                    if (el.classList.contains('tabs')) tab = el.querySelector('.nav');
                                    
                                    let items = tab.parentElement.querySelectorAll('.tab-pane');
                                    for(let it of items){
                                        it.classList.remove('active', 'show');
                                    }
                                    items = tab.parentElement.querySelectorAll('.nav-link');
                                    for(let it of items){
                                        it.classList.remove('active', 'show');
                                    }
                                    
                                    let nav = document.createElement('li');
                                    nav.classList.add('nav-item');
                                    tab.appendChild(nav);
                                    
                                    let link = document.createElement('a');
                                    link.classList.add('nav-link', 'active', 'show');

                                    let tabid = tab.querySelectorAll('.nav-link').length + 1;
                                    link.innerText = `Onglet ${tabid}`;
                                    tabid = `tab${tabid}`;

                                    link.setAttribute('data-toggle', 'tab');
                                    link.setAttribute('role', 'tab');
                                    link.setAttribute('href', '#'+tabid);
                                    link.setAttribute('aria-controls', tabid);
                                    nav.appendChild(link)

                                    let content = tab.parentElement.querySelector('.tab-content');
                                    let div = document.createElement('div');
                                    div.classList.add('tab-pane', 'fade', 'mt-3', 'active', 'show');
                                    div.setAttribute('role', 'tabpanel');
                                    div.setAttribute('id', tabid);
                                    div.setAttribute('aria-labelledby', tabid);
                                    div.innerHTML = "<p>Contenu "+tabid+"</p>";
                                    content.appendChild(div);
                    
                                    return {action: 'insert', nodes: [nav,content]};
                                }
                            }
                        ]
                    },
                    getValue: function(el, data){
                        return el;
                    }
                },
            ]
        },
        {
            name: 'accordion', description: i18n.get_string('accordionoptions'),  type: 'bootstrap',
            children: [
                {
                    name: 'addaccordion',
                    text: i18n.get_string('actions'),
                    input: {
                        type: 'buttongroup',
                        options: [
                            {
                                text: <span><FontAwesomeIcon icon={faPlus} title={i18n.get_string('add')}/>{i18n.get_string('accordion')}</span>,
                                onClick: function(el, value, data){
                                    let tab = el;
                                    if (el.classList.contains('btn')) tab = el.parentElement.parentElement.parentElement.parentElement;
                                    
                                    let items = tab.parentElement.querySelectorAll('.collapse');
                                    for(let it of items){
                                        it.classList.remove('active', 'show');
                                    }
                                    let id = items.length + 1;
                                    
                                    let nav = document.createElement('div');
                                    nav.classList.add('card');
                                    tab.appendChild(nav);
                                    nav.innerHTML = `
                                    <div class="card-header" id="heading${id}">
                                      <h2 class="mb-0">
                                        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${id}" aria-expanded="false" aria-controls="collapse${id}">
                                          Item #${id}
                                        </button>
                                      </h2>
                                    </div>
                                    <div id="collapse${id}" class="collapse" aria-labelledby="heading${id}" data-parent="#${el.id}">
                                      <div class="card-body">
                                        Item #${id}
                                      </div>
                                    </div>`;
                                    
                    
                                    return {action: 'insert', nodes: [nav]};
                                }
                            }
                        ]
                    },
                    getValue: function(el, data){
                        return el;
                    }
                },
            ]
        },
        /*{
            name: 'collapse', description: 'Collapse',  type: 'htmlattr',
            children: [{
                name: 'collapse target',
                text: "ID de l'élément cible",
                input: { 
                    type: 'text',
                    defaultValue: '',
                    onChange: function(el, value, data){
                        el.setAttribute('data-bs-target', value);
                    }
                },
                getValue: function(el, data){
                    return el.getAttribute('data-bs-target');
                }
            },]
        },*/
        {
            name: 'marginborderpadding', description: i18n.get_string('layoutspacing'),  type: 'styleattr',
            children: [{
                name: 'layoutspacing',
                text: i18n.get_string('spacing'),
                input: { 
                    type: 'layoutspacingeditor',
                    getFlags: function(){
                        return {showLabel: false};
                    },
                    defaultValue: '',
                    onChange: function(el, value, data){
                        el.style[value.name] = value.value;
                    }
                },
                getValue: function(el, data){
                    let list = {};
                    for (let c of LayoutSpacingEditor.styleKeys){
                        if (el.style[c]){
                            list[c] = el.style[c];
                        }else{
                            list[c] = '';
                        }
                    }
                    return list;
                }
            },
            {
                name: 'borderstyle', 
                text: i18n.get_string('borderstyle'),
                input: { 
                    type: 'radio',
                    options:[
                        {text: <FontAwesomeIcon className="mr-1" icon={faRemoveFormat} title="Default"/>, value:''},
                        {text: <FontAwesomeIcon className="mr-1" icon={faSquare} title="Solide"/>, value:'solid'},
                        {text: <FontAwesomeIcon className="mr-1" icon={faRuler} title="Barré"/>, value:'dashed' },
                        {text: <FontAwesomeIcon className="mr-1" icon={faEllipsisH} title="Pointillé"/>, value:'dotted' },
                        {text: <FontAwesomeIcon className="mr-1" icon={faGripLines} title="Double"/>, value:'double' }
                    ],
                    onChange: function(el, value, data){
                        el.style.borderStyle = value;
                    }
                },
                getValue: function(el, data){
                    return [el.style.borderStyle];
                }
            },]
        },
        {
            name: 'bs-spacing', description: i18n.get_string('spacing'),  type: 'bootstrap',
            children: [{
                name: 'margin',
                text: i18n.get_string('margin'),
                input: { 
                    type: 'layoutspacing',
                    options: [
                        {name: "mt", nbItems: 6}, 
                        {name: "mr", nbItems: 6}, 
                        {name: "mb", nbItems: 6}, 
                        {name: "ml", nbItems: 6}, 
                        {name: "m", nbItems: 6}
                    ],
                    onChange: function(el, value, data){
                        if(value.oldValue.length > 0){
                            el.classList.remove(value.oldValue);
                        }
                        
                       
                        if(value.newValue.length > 0){
                            el.classList.add(value.newValue);
                        }
                    }
                },
                getValue: function(el, data){
                    let result = [];

                    for(let i = 0; i <= 5; i++){
                        for(let item of data.input.options){
                            let className = `${item.name}-${i}`;
                            if(el.classList.contains(className)){
                                result.push(className);
                            }
                        }
                    }
                    return result;
                },
            },{
                name: 'padding',
                text: i18n.get_string('padding'),
                input: { 
                    type: 'layoutspacing',
                    options: [
                        {name: "pt", nbItems: 6}, 
                        {name: "pr", nbItems: 6}, 
                        {name: "pb",nbItems: 6}, 
                        {name: "pl", nbItems: 6}, 
                        {name: "p", nbItems: 6}
                    ],
                    onChange: function(el, value, data){
                        if(value.oldValue.length > 0){
                            el.classList.remove(value.oldValue);
                        }
                        
                       
                        if(value.newValue.length > 0){
                            el.classList.add(value.newValue);
                        }
                    }
                },
                getValue: function(el, data){
                    let result = [];

                    for(let i = 0; i <= 5; i++){
                        for(let item of data.input.options){
                            let className = `${item.name}-${i}`;
                            if(el.classList.contains(className)){
                                result.push(className);
                            }
                        }
                    }
                    return result;
                }
            }
            ]
        },                
        {
            name: 'bs-border', description: i18n.get_string('border'),  type: 'bootstrap',
            children: [{
                name: 'border',
                text: i18n.get_string('border'),
                input: { 
                    type: 'layoutspacing',
                    options: [
                        {name: "border-top", nbItems: 1}, 
                        {name: "border-right", nbItems: 1}, 
                        {name: "border-bottom",nbItems: 1}, 
                        {name: "border-left", nbItems: 1}, 
                        {name: "border", nbItems: 6}
                    ],
                    onChange: function(el, value, data){
                        if(value.oldValue.length > 0){
                            el.classList.remove('border');
                            el.classList.remove(value.oldValue);
                        }
                        
                        if(value.newValue.length > 0){
                            el.classList.add('border');
                            el.classList.add(value.newValue);
                        }
                    }
                },
                getValue: function(el, data){
                    let result = [];

                    for(let i = 0; i <= 5; i++){
                        for(let item of data.input.options){
                            let className = `${item.name}-${i}`;
                            if(el.classList.contains(className)){
                                result.push(className);
                            }
                        }
                    }
                    return result;
                }
            },
            {
                name: 'bordercolor',
                text: i18n.get_string('bordercolor'),
                input: { 
                    type: 'colorselector',
                    getFlags: function(){
                        return {prefix: 'border-', fetchFromTheme: true};
                    },
                    options:[
                        {text:"", value: "primary"},
                        {text:"", value: "secondary"},
                        {text:"", value: "success"},
                        {text:"", value: "danger"},
                        {text:"", value: "warning"},
                        {text:"", value: "info"},
                        {text:"", value: "light"},
                        {text:"", value: "dark"},
                        {text:"", value: "white"}
                    
                    ],
                    onChange: function(el, value, data){                       
                        for(let item of data.input.options){
                            el.classList.remove(`border-${item.value}`);
                        }

                        if(value.length > 0){
                            el.classList.add(`border-${value}`);
                        }
                    }
                },
                getValue: function(el, data){
                    let result = "";

                    let classList = [...el.classList]

                    for(let item of data.input.options){
                        if(classList.includes(`border-${item.value}`)){
                            result = item.value;
                            break;
                        }
                    }

                    return result;
                }
            },
            {
                name: 'borderradius',
                text: i18n.get_string('borderradius'),
                input: { 
                    type: 'combobox',
                    options:[
                        {text:"Rounded", value: "rounded"},
                        {text:"Rounded-Top", value: "rounded-top"},
                        {text:"Rounded-Right", value: "rounded-right"},
                        {text:"Rounded-Bottom", value: "rounded-bottom"},
                        {text:"Rounded-Left", value: "rounded-left"},
                        {text:"Rounded-Circle", value: "rounded-circle"},
                        {text:"Rounded-Pill", value: "rounded-pill"},
                        {text:"Rounded-0", value: "rounded-0"},
                    
                    ],
                    onChange: function(el, value, data){                       
                        for(let item of data.input.options){
                            el.classList.remove(item.value);
                        }

                        if(value.length > 0){
                            el.classList.add(value);
                        }
                    }
                },
                getValue: function(el, data){
                    let result = "";

                    let classList = [...el.classList]

                    for(let item of data.input.options){
                        if(classList.includes(item.value)){
                            result = item.value;
                            break;
                        }
                    }

                    return result;
                }
            }
            ]
        },
        {
            name: 'bs-general', description: i18n.get_string('basic'),  type: 'bootstrap',
            children: [
                {
                    name: 'classlist', 
                    text: i18n.get_string('classlist'),
                    input: { 
                        type: 'multipleselect',
                        getFlags: function(){
                            return {autoAdd: true, showLabel: true};
                        },
                        options: [], 
                        defaultValue: '',
                        onChange: function(el, value, data){
                            el.className = value.join(' ');
                        }
                    },
                    getValue: function(el, data){
                        let list = [];
                        for (let c of el.classList){
                            list.push({value:c, text:c});
                        }
                        return list;
                    }
                },
                {
                    name: 'background',
                    text: i18n.get_string('backgroundcolor'),
                    input: { 
                        type: 'colorselector',
                        getFlags: function(el) {
                            let elClass = HTMLElementData.getElementClass(null, el);
                            let prefix = (elClass ? `${elClass.cssProp.prefix}` : 'bg');
                            return {fetchFromTheme: true, prefix: `${prefix}-`};
                        },
                        options:[
                            {text:"", value: "primary"},
                            {text:"", value: "secondary"},
                            {text:"", value: "success"},
                            {text:"", value: "danger"},
                            {text:"", value: "warning"},
                            {text:"", value: "info"},
                            {text:"", value: "light"},
                            {text:"", value: "dark"},
                            {text:"", value: "white"}
                        
                        ],
                        onChange: function(el, value, data){
                            let elClass = HTMLElementData.getElementClass(null, el);
                            let prefix = (elClass ? `${elClass.cssProp.prefix}` : 'bg');
                            let middlefix = '';

                            for(let item of data.input.options){
                                if (el.classList.contains(`${prefix}-${item.value}`)){
                                    el.classList.remove(`${prefix}-${item.value}`);
                                }
                                if (el.classList.contains(`${prefix}-outline-${item.value}`)){
                                    el.classList.remove(`${prefix}-outline-${item.value}`);
                                    middlefix = '-outline';
                                }
                            }

                            if(value.length > 0){
                                el.classList.add(`${prefix}${middlefix}-${value}`);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let result = "";
                        let elClass = HTMLElementData.getElementClass(null, el);
                        let prefix = (elClass ? `${elClass.cssProp.prefix}` : 'bg');

                        let classList = [...el.classList]

                        for(let item of data.input.options){
                            if(classList.includes(`${prefix}-${item.value}`)){
                                result = item.value;
                                break;
                            }
                            if(classList.includes(`${prefix}-outline-${item.value}`)){
                                result = item.value.replace('outline-', '');
                                break;
                            }
                        }

                        return result;
                    }
                },               
                {
                    name: 'shadow',
                    text: i18n.get_string('shadow'),
                    input: { 
                        type: 'radio',
                        options:[
                            {text: <FontAwesomeIcon icon={faRemoveFormat} title={i18n.get_string('removeformat')}/>, value:'default'},
                            {text:i18n.get_string('none'), value: "shadow-none"},
                            {text:"SM", value: "shadow-sm"},
                            {text:"REG", value: "shadow"},
                            {text:"LG", value: "shadow-lg"}
                        ],
                        defaultValue: ['default'],
                        onChange: function(el, value, data){
                            for(let item of data.input.options){
                                el.classList.remove(item.value);
                            }

                            if((value.length > 0) && (value !== data.input.defaultValue[0])){
                                el.classList.add(value);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let result = data.input.defaultValue;

                        let classList = [...el.classList]

                        for(let item of data.input.options){
                            if(classList.includes(item.value)){
                                result = [item.value];
                                break;
                            }
                        }

                        return result;
                    }
                }
            ]
        },
        {
            name: 'bs-text', description: i18n.get_string('text'),  type: 'bootstrap',
            children: [
                {
                    name: 'color',
                    text: i18n.get_string('color'),
                    input: { 
                        type: 'colorselector',
                        getFlags: function(){
                            return {prefix: 'text-', fetchFromTheme: true};
                        },
                        options:[
                            {text:"", value: "primary"},
                            {text:"", value: "secondary"},
                            {text:"", value: "success"},
                            {text:"", value: "danger"},
                            {text:"", value: "warning"},
                            {text:"", value: "info"},
                            {text:"", value: "light"},
                            {text:"", value: "dark"},
                            {text:"", value: "white"}
                        
                        ],
                        onChange: function(el, value, data){
                            for(let item of data.input.options){
                                el.classList.remove(`text-${item.value}`);
                            }

                            if(value.length > 0){
                                el.classList.add(`text-${value}`);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let result = "";

                        let classList = [...el.classList]

                        for(let item of data.input.options){
                            if(classList.includes(`text-${item.value}`)){
                                result = item.value;
                                break;
                            }
                        }

                        return result;
                    }
                },
                {
                    name: 'alignment', 
                    text: i18n.get_string('alignment'),
                    input: { 
                        type: 'radio', 
                        options:[
                            {text: <FontAwesomeIcon icon={faRemoveFormat} title={i18n.get_string('default')}/>, value:'default'},
                            {text: <FontAwesomeIcon icon={faAlignLeft} title={i18n.get_string('left')}/>, value:'text-left' },
                            {text: <FontAwesomeIcon icon={faAlignCenter} title={i18n.get_string('center')}/>, value:'text-center' },
                            {text: <FontAwesomeIcon icon={faAlignRight} title={i18n.get_string('right')}/>, value:'text-right' },
                            {text: <FontAwesomeIcon icon={faAlignJustify} title={i18n.get_string('justify')}/>, value:'text-justify' }
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
                            if (el.classList.contains(option.value)){
                                return [option.value];
                            }
                        }
                        
                        return data.input.defaultValue;
                    }
                },
                {
                    name: 'resposivesize', 
                    text: i18n.get_string('responsivesize'),
                    input: { 
                        type: 'radio', 
                        options:[
                            {text: <FontAwesomeIcon icon={faRemoveFormat} title={i18n.get_string('default')}/>, value:'default'},
                            {text: 'SM', value:'sm' },
                            {text: 'MD', value:'md' },
                            {text: 'LG', value:'lg' },
                            {text: 'XL', value:'xl' }
                        ],
                        defaultValue: ['default'],
                        onChange: function(el, value, data){
                            let sufix = ['left', 'right', 'center', 'justify'];
                            let className = null;

                            if(el.classList.length > 0){
                                for(let option of data.input.options){
                                    for(let s of sufix){
                                        if(el.classList.contains(`text-${s}`)){
                                            className = `text-${value}-${s}`;
                                        }

                                        el.classList.remove(`text-${option.value}-${s}`);
                                    }
                                }
                            }
                            
                            if(data.input.defaultValue.join() === value){
                                return;
                            }

                            if(className !== null){
                                el.classList.add(className);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let sufix = ['left', 'right', 'center', 'justify'];

                        for(let option of data.input.options){
                            for(let s of sufix){
                                if (el.classList.contains(`text-${option.value}-${s}`)){
                                    return [option.value];
                                }
                            }
                        }
                        
                        return data.input.defaultValue;
                    }
                }
            ]
        },
        {
            name: 'bs-button', description: i18n.get_string('button'),  type: 'bootstrap',
            children: [
                {
                    name: 'btnblock',
                    text: i18n.get_string('buttonfullwidth'),
                    input: { 
                        type: 'radio',
                        options:[
                            {text:i18n.get_string('yes'), value: "btn-block"},
                            {text:i18n.get_string('no'), value: ""}                       
                        ],
                        onChange: function(el, value, data){
                            if(el.classList.contains("btn-block")){
                                el.classList.remove("btn-block");
                            }

                            if(value.length > 0){
                                el.classList.add(value);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let result = "";
                        
                        if(el.classList.contains("btn-block")){
                            result = "btn-block";
                        }

                        return result;
                    }
                },
                {
                    name: 'btnoutline',
                    text: i18n.get_string('outline'),
                    input: { 
                        type: 'radio',
                        options:[
                            {text:i18n.get_string('yes'), value: true},
                            {text:i18n.get_string('no'), value: false}
                        
                        ],
                        onChange: function(el, value, data){
                            if (value == false){
                                for (let c of el.classList){
                                    if (c.includes('btn-outline')){
                                        let classN = c.replace('outline-', '');
                                        el.classList.remove(c);
                                        el.classList.add(classN);
                                    }
                                }
                            }else{
                                for (let c of el.classList){
                                    if (c.includes('btn-')){
                                        let classN = c.replace('btn-', 'btn-outline-');
                                        el.classList.remove(c);
                                        el.classList.add(classN);
                                    }
                                }
                            }
                        }
                    },
                    getValue: function(el, data){
                        for (let c of el.classList){
                            if (c.includes('btn-outline')){
                                return true;
                            }
                        }
                        return false;
                    }
                },
                {
                    name: 'btnsize',
                    text: i18n.get_string('size'),
                    input: { 
                        type: 'radio',
                        options:[
                            {text:<FontAwesomeIcon icon={faRemoveFormat}/>, value: ""},
                            {text:i18n.get_string('big'), value: "btn-lg"},
                            {text:i18n.get_string('small'), value: "btn-sm"},
                        ],
                        onChange: function(el, value, data){                       
                            for(let item of data.input.options){
                                if (item.value.length > 0){
                                    el.classList.remove(item.value);
                                }
                            }
    
                            if(value.length > 0){
                                el.classList.add(value);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let result = "";
    
                        let classList = [...el.classList]
    
                        for(let item of data.input.options){
                            if(classList.includes(item.value)){
                                result = item.value;
                                break;
                            }
                        }
    
                        return result;
                    }
                },
            ]
        },
        {
            name: 'htmlattributes', description: i18n.get_string('htmlattributes'),  type: 'htmlattr',
            children: [
                {
                    name: 'id', 
                    text: i18n.get_string('id'),
                    input: { 
                        type: 'text', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                            el.setAttribute("id",  value);
                        }
                    },
                    getValue: function(el){
                        return el.getAttribute("id") || "";
                    }
                },
            ]
        },
        {
            name: 'table', description: i18n.get_string('table'),  type: 'bootstrap',
            children: [{
                name: 'tableaction',
                text: i18n.get_string('actions'),
                input: { 
                    type: 'buttongroup',
                    options: [ 
                        {
                            text: <span><FontAwesomeIcon icon={faPlus}/>{" Colonne"}</span>, 
                            onClick: function(el){
                                let table = el;                                
                                let result = UtilsHTML.tableAddCol(table);
                                return {action: 'insert', nodes: result};
                            }
                        },
                        {
                            text: <span><FontAwesomeIcon icon={faPlus}/>{" Ligne"}</span>, 
                            onClick: function(el){
                                let result = {action: '', nodes: null};
                                let table = el;
                                result.nodes = UtilsHTML.tableAddRow(table);

                                if(result.nodes.length > 0){
                                    result.action = 'insert';
                                }

                                return result;
                            }
                        }
                    ]
                },
                getValue: function(el, data){
                    return el;
                }
            },
            {
                name: 'tableborder',
                text: i18n.get_string('border'),
                input: { 
                    type: 'radio',
                    options: [
                        {text: i18n.get_string('no'), value:0},
                        {text: i18n.get_string('yes'), value:1},
                    ],
                    onChange: function(el, value, data){
                        if(value == 1){
                            el.border = true;
                        }else{
                            el.removeAttribute('border');
                        }
                    }
                },
                getValue: function(el, data){
                    return el.border ? 1 : 0;
                }
            },
            {
                name: 'tablestriped',
                text: i18n.get_string('striped'),
                input: { 
                    type: 'radio',
                    options: [
                        {text: i18n.get_string('no'), value:0},
                        {text: i18n.get_string('yes'), value:1},
                    ],
                    onChange: function(el, value, data){
                        if(value == 1){
                            el.classList.add('table-striped');
                        }else{
                            el.classList.remove('table-striped');
                        }
                    }
                },
                getValue: function(el, data){
                    return el.classList.contains('table-striped') ? 1 : 0;
                }
            },
            ],
        },
        {
            name: 'tablecell', description: i18n.get_string('table'),  type: 'bootstrap',
            children: [{
                name: 'tableaction',
                text: i18n.get_string('actions'),
                input: { 
                    type: 'buttongroup',
                    options: [ 
                        {
                            text: <span><FontAwesomeIcon icon={faMinus}/>{i18n.get_string('line')}</span>, 
                            onClick: function(el){
                                let table = el.parentElement.parentElement;
                                for (let row of table.rows){
                                    
                                    try{
                                        el.deleted = true;
                                        row.deleteCell(el.cellIndex);
                                    }
                                    catch(ex){
                                        console.log(ex);
                                    }
                                    
                                }
                                //deleteRow
                                return {action: 'delete', nodes: null};;
                            }
                        },
                        {
                            text: <span><FontAwesomeIcon icon={faPlus}/>{i18n.get_string('column')}</span>, 
                            onClick: function(el){
                                let table = el.parentElement.parentElement;
                                let result = UtilsHTML.tableAddCol(table);
                                return {action: 'insert', nodes: result};
                            }
                        },
                        {
                            text: <span><FontAwesomeIcon icon={faPlus}/>{i18n.get_string('line')}</span>, 
                            onClick: function(el){
                                let result = {action: '', nodes: null};
                                let table = UtilsHTML.getTableFromCell(el);
                                
                                if(table === null){
                                    return result;
                                }
                                
                                result.nodes = UtilsHTML.tableAddRow(table);

                                if(result.nodes.length > 0){
                                    result.action = 'insert';
                                }
                                
                                return result;
                            }
                        }
                    ]
                },
                getValue: function(el, data){
                    return el;
                }
            }]
        }
    ];

    static propsAssignmentFacade = {
        text: ['bs-general', 'bs-text', 'bs-spacing', 'bs-border', 'htmlattributes', 'marginborderpadding', 'font', 'layout', 'background'],
        controls: ['bs-general', 'bs-text', 'bs-spacing', 'bs-border', 'htmlattributes', 'marginborderpadding', 'font', 'layout', 'background'],
        buttons: ['bs-general', 'bs-button', 'bs-spacing', 'bs-border', 'htmlattributes', 'marginborderpadding', 'font'],
        containers: ['bs-general', 'bs-text', 'bs-spacing', 'bs-border', 'htmlattributes', 'layout', 'background']
    }

    static elementList = [
        {
            name: i18n.get_string('text'),
            children: [
                new HTMLHeadingElement("H1", 'h1'),
                new HTMLHeadingElement("H2", 'h2'),
                new HTMLHeadingElement("H3", 'h3'),
                new HTMLHeadingElement("H4", 'h4'),
                new HTMLHeadingElement("H5", 'h5'),
                new HTMLHeadingElement("H6", 'h6'),
                new HTMLParagraphElement(),
            ]
        },
        {
            name: i18n.get_string('control'), 
            children: [
                new HTMLButtonElement(i18n.get_string('button'), 'button', 'bootstrap', HTMLElementData.propsAssignmentFacade.buttons),
                new HTMLButtonCollapseElement(),
                new HTMLLinkElement(),
                new HTMLAudioElement(),
                new HTMLVideoElement(i18n.get_string('video'), null, 'bootstrap'),
                new HTMLButtonVideoElement(),
                new HTMLEmbedElement(),
                new HTMLNavElement(),
                new HTMLNavItemElement(),
                new HTMLNavLinkElement()
            ]
        },
        {
            name: i18n.get_string('container'), 
            children: [
                new HTMLBodyElement(),
                new HTMLDivElement(),
                new HTMLSpanElement(),
                new HTMLSectionElement(),
                new HTMLGridElement(),
                new HTMLRowElement(),
                new HTMLColElement(),
                new HTMLUListElement(),
                new HTMLOListElement(),
                new HTMLLIElement(),
                new HTMLAlertElement(),
                new HTMLCardElement(),
                new HTMLCardBodyElement(),
                new HTMLCardHeaderElement(),
                new HTMLCardFooterElement(),
                new HTMLMediaBSElement(),
                new HTMLMediaBSBodyElement(),
                new HTMLHRElement()
            ]
        },
        {
            name: i18n.get_string('nativecomponents'), 
            children: [
                new HTMLCarouselElement(),
                new HTMLCarouselNavElement(),
                new HTMLAccordionElement(),
                new HTMLTabElement(),
                new HTMLAccordionNavElement(),
                new HTMLFlipCardElement(),
                new HTMLFlipCardFrontElement(),
                new HTMLFlipCardBackElement(),
                new HTMLTabPaneElement(),
                new HTMLTabContentElement(),
                new HTMLTableElement(),
                new HTMLTableDataCellElement(),
                new HTMLTableHeaderCellElement(),
                new HTMLTableRowElement(),
            ]
        },
        {
            name: i18n.get_string('image'), 
            children: [
                new HTMLImageElement(),
                new HTMLImageWithCaptionElement(),
                new HTMLClickableImageElement(),
                new HTMLIconElement()
            ]
        },
    ];

    static elementListSortByName = function(){
        HTMLElementData.elementList.sort((a,b) =>{
            return a.name.toString().localeCompare(b.name.toString());
        })
 
        for(let item of HTMLElementData.elementList){
            item.children.sort((a,b) =>{
                return a.name.toString().localeCompare(b.name.toString());
            })
        }
    }

    static elementListSortbyType = function(){
        if (HTMLElementData.elementListSortedbyType){
            return HTMLElementData.elementListSortedbyType;
        }

        let list = [];
        for(let cat of HTMLElementData.elementList){
            if (cat.name == i18n.get_string('nativecomponents')){
                for (let item of cat.children){
                    list.push(item);
                }
            }
        }

        let list2 = [];
        for(let cat of HTMLElementData.elementList){
            if (cat.name != i18n.get_string('nativecomponents')){
                for (let item of cat.children){
                    list2.push(item);
                }
            }
        }
        
        list2.sort((a,b) =>{
            return a.type.toString().localeCompare(b.type.toString());
        })

        HTMLElementData.elementListSortedbyType = [...list, ...list2];
        return HTMLElementData.elementListSortedbyType;
    }

    static getElementClass(data, el){
        data = data || null;
        el = el || null;
        
        // it gives priority to bootstrap
        let list = HTMLElementData.elementListSortbyType();

        for(let item of list){
            if(item.equal(el)){
                return item;
            }
            else if (data !== null && data.name === item.name){
                return item;
            }
        }

        return null;
    }

    static createElement(componentData){
        let el = null;

        if(componentData.type === 'native' || componentData.type === 'bootstrap' || componentData.type == 'nativecomponent'){
            let component = HTMLElementData.getElementClass(componentData);
            el = component.create();
        }
        else if((componentData.type === 'c') || (componentData.type === 'l')){
            let html = componentData.htmlStr || componentData.htmlstr; //Save file sometimes void caps
            if (!html){
                alert(i18n.get_string('invalidcomponent'));
                console.log(componentData);
                return;
            }
            el = new DOMParser().parseFromString(html, "text/html");
            el = el.body.firstChild;
        }
        else{
            console.log(`Component type not found: ${componentData}`);
        }

        return el;
    }
}