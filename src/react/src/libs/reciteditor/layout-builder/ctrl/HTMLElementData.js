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
 import { i18n } from '../../RecitEditor';
 import {BsBackgroundProperty, BsBackgroundImageProperty, BsShadowProperty, BsIconProperty, BsIconSizeProperty, BsMarginProperty, BsPaddingProperty, HTMLClassProperty,
            HTMLWidthProperty, HTMLHeightProperty, HTMLFontSizeProperty, HTMLFontFamilyProperty, HTMLColorProperty, HTMLBackgroundProperty, HTMLHrefProperty, HTMLTargetProperty, 
            HTMLSourceProperty, HTMLIdProperty, HTMLVideoButtonProperty, HTMLEmbedProperty, HTMLPropertiesData, BsTabProperty, BsTabJustifyProperty, BsAddTabProperty, HTMLMarginBorderPaddingProperty, BsAddAccordionProperty, BsBorderProperty, BsBorderColorProperty, BsBorderStyleProperty, BsBorderRadiusProperty, BsTextColorProperty, BsTextAlignmentProperty, BsBtnBlockProperty, BsBtnOutlineProperty, BsBtnSizeProperty, BsTableActionProperty, BsTableBorderProperty, BsTableStripedProperty, BsTableCellActionProperty, HTMLAltProperty, HTMLOuterHTMLProperty} from './HTMLProperties';
 import {HTMLHeadingElement, HTMLParagraphElement, HTMLButtonElement, HTMLButtonCollapseElement, HTMLLinkElement, HTMLAudioElement, HTMLVideoElement, HTMLButtonVideoElement, HTMLEmbedElement,
            HTMLNavElement, HTMLNavItemElement, HTMLNavLinkElement,
            HTMLBodyElement, HTMLDivElement, HTMLSpanElement, HTMLSectionElement, HTMLGridElement, HTMLRowElement, HTMLColElement, HTMLUListElement, HTMLOListElement, HTMLLIElement,
            HTMLAlertElement, HTMLCardElement, HTMLCardBodyElement, HTMLCardHeaderElement, HTMLCardFooterElement,
            HTMLMediaBSElement, HTMLMediaBSBodyElement, HTMLHRElement, HTMLCarouselElement, HTMLCarouselNavElement, HTMLAccordionElement, HTMLTabElement, HTMLAccordionNavElement, HTMLFlipCardElement,
            HTMLFlipCardFrontElement, HTMLFlipCardBackElement, HTMLTabPaneElement, HTMLTabContentElement, HTMLTableElement, HTMLTableDataCellElement, HTMLTableHeaderCellElement, HTMLTableRowElement,
            HTMLImageElement, HTMLImageWithCaptionElement, HTMLClickableImageElement, HTMLIconElement, HTMLIframeElement, HTMLHorizontalBarElement} from './HTMLElements';

export class HTMLElementData{
    static propertyList = {
        bootstrap: [
            {
                name: 'bs-background', description: i18n.get_string('background'), 
                children: [
                    new BsBackgroundProperty(),
                    new BsBackgroundImageProperty(),
                    new BsShadowProperty()
                ]
            },
            {
                name: 'icon', description: i18n.get_string('icon'), 
                children: [
                    new BsIconProperty(),
                    new BsIconSizeProperty(),
                    new BsTextColorProperty
                ]
            },            
            {
                name: 'bs-general', description: i18n.get_string('class'), 
                children: [
                    new HTMLClassProperty()
                ]
            },
            {
                name: 'bs-spacing', description: i18n.get_string('spacing'), 
                children: [
                    new BsMarginProperty(),
                    new BsPaddingProperty()
                ]
            },
            {
                name: 'bs-border', description: i18n.get_string('border'), 
                children: [
                    new BsBorderProperty(),
                    new BsBorderColorProperty(),
                    new BsBorderStyleProperty(),
                    new BsBorderRadiusProperty()
                ]
            },
            {
                name: 'bs-text', description: i18n.get_string('text'), 
                children: [
                    new BsTextColorProperty(),
                    new BsTextAlignmentProperty()
                ]
            },
            {
                name: 'bs-button', description: i18n.get_string('button'), 
                children: [
                    new BsBackgroundProperty(),
                    new BsBtnBlockProperty(),
                    new BsBtnOutlineProperty(),
                    new BsBtnSizeProperty()
                ]
            },
            {
                name: 'bs-table', description: i18n.get_string('table'), 
                children: [
                    new BsTableActionProperty(),
                    new BsTableBorderProperty(),
                    new BsTableStripedProperty()
                ]
            },
            {
                name: 'bs-tablecell', description: i18n.get_string('table'), 
                children: [
                    new BsTableCellActionProperty()
                ]
            },
            {
                name: 'tab', description: i18n.get_string('taboptions'), 
                children: [
                    new BsTabProperty(),
                    new BsTabJustifyProperty(),
                    new BsAddTabProperty()
                ]
            },
            {
                name: 'accordion', description: i18n.get_string('accordionoptions'), 
                children: [
                    new BsAddAccordionProperty()
                ]
            },
        ],
        html: [
            {
                name: 'layout', description: i18n.get_string('layout'), 
                children: [
                    new HTMLWidthProperty(),
                    new HTMLHeightProperty(),
                    new HTMLMarginBorderPaddingProperty()
                ]
            },
            {
                name: 'font', description: i18n.get_string('font'), 
                children: [
                    new HTMLFontSizeProperty(),
                    new HTMLFontFamilyProperty(),
                    new HTMLColorProperty()
                ]
            },
            {
                name: 'background', description: i18n.get_string('background'), 
                children: [
                   new HTMLBackgroundProperty()
                ]
            },
            {
                name: 'link', description: i18n.get_string('linkoptions'), 
                children: [
                    new HTMLHrefProperty(),
                    new HTMLTargetProperty()
                ]
            },
            {
                name: 'source', description: i18n.get_string('source'), 
                children: [
                    new HTMLSourceProperty()
                ]
            },
            {
                name: 'outerhtml', description: i18n.get_string('source'), 
                children: [
                    new HTMLOuterHTMLProperty()
                ]
            },
            {
                name: 'alt', description: i18n.get_string('description'), 
                children: [
                    new HTMLAltProperty()
                ]
            },
            {
                name: 'htmlattributes', description: i18n.get_string('htmlattributes'), 
                children: [
                    new HTMLIdProperty(),
                    new HTMLClassProperty()
                ]
            },
            {
                name: 'videobtn', description: i18n.get_string('source'), 
                children: [
                    new HTMLVideoButtonProperty()
                ]
            },
            {
                name: 'videosource', description: i18n.get_string('source'), 
                children: [
                    new HTMLVideoButtonProperty()
                ]
            },
            {
                name: 'embed', description: i18n.get_string('properties'), 
                children: [
                    new HTMLEmbedProperty()
                ]
            },
        ],
        bookmark: []
    };  

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
                new HTMLUListElement(),
                new HTMLOListElement(),
                new HTMLLIElement(),
            ]
        },
        {
            name: i18n.get_string('media'), 
            children: [
                new HTMLImageElement(),
                new HTMLImageWithCaptionElement(),
                new HTMLClickableImageElement(),
                new HTMLVideoElement(i18n.get_string('video'), null, 'bootstrap'),
                new HTMLIframeElement(),
                new HTMLButtonVideoElement(),
                new HTMLIconElement(),
                new HTMLAudioElement(),
                new HTMLEmbedElement()
            ]
        },
        {
            name: i18n.get_string('navigation'), 
            children: [
                new HTMLButtonElement(i18n.get_string('button'), 'a', 'bootstrap', HTMLPropertiesData.propsAssignmentFacade.buttons),
                new HTMLButtonVideoElement(),
                new HTMLLinkElement(),
                new HTMLNavElement(),
                new HTMLNavItemElement(),
                new HTMLNavLinkElement()
            ]
        },
        {
            name: i18n.get_string('nativecomponents'), 
            children: [
                new HTMLAccordionElement(),
                new HTMLAccordionNavElement(),
                new HTMLCarouselElement(),
                new HTMLCarouselNavElement(),
                new HTMLFlipCardElement(),
                new HTMLFlipCardFrontElement(),
                new HTMLFlipCardBackElement(),
                new HTMLTabElement(),
                new HTMLTabPaneElement(),
                new HTMLTabContentElement(),
                new HTMLTableElement(),
                new HTMLTableDataCellElement(),
                new HTMLTableHeaderCellElement(),
                new HTMLTableRowElement(),
                new HTMLAlertElement(),
                new HTMLCardElement(),
                new HTMLCardBodyElement(),
                new HTMLCardHeaderElement(),
                new HTMLCardFooterElement(),
                new HTMLMediaBSElement(),
                new HTMLMediaBSBodyElement(),
                new HTMLHRElement(),
                new HTMLHorizontalBarElement()
            ]
        },
        {
            name: i18n.get_string('grid'), 
            children: [
                new HTMLBodyElement(),
                new HTMLDivElement(),
                new HTMLSpanElement(),
                new HTMLSectionElement(),
                new HTMLGridElement(),
                new HTMLRowElement(),
                new HTMLColElement(),
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