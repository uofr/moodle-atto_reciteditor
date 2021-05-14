import React from 'react';
import { faRemoveFormat, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify, faPlus, faEllipsisH, faGripLines, faSquare, faRuler} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageEmpty from '../assets/empty.jpg';
import { LayoutSpacingEditor} from '../Components';
import Utils from '../../utils/Utils';

export class HTMLElementData{

    static propertyList = [
        {
            name: 'layout', description: 'Layout', type: 'styleattr',
            children: [
                {
                    name: 'Width', 
                    text: 'Largeur',
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
                    text: 'Hauteur',
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
            name: 'font', description: 'Police de caractère', type: 'styleattr',
            children: [
                {
                    name: 'alignment', 
                    text: 'Alignment',
                    input: { 
                        type: 'radio', 
                        options:[
                            {text: <FontAwesomeIcon icon={faRemoveFormat} title="Défaut"/>, value:'default'},
                            {text: <FontAwesomeIcon icon={faAlignLeft} title="Left"/>, value:'text-left' },
                            {text: <FontAwesomeIcon icon={faAlignCenter} title="Center"/>, value:'text-center' },
                            {text: <FontAwesomeIcon icon={faAlignRight} title="Right"/>, value:'text-right' },
                            {text: <FontAwesomeIcon icon={faAlignJustify} title="Justify"/>, value:'text-justify' }
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
                    text: 'Taille',
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
                    text: 'Police',
                    input: { 
                        type: 'combobox',
                        options: [
                            {text: 'Sans-serif', value:'sans-serif'},
                            {text: 'Serif', value:'serif'},
                            {text: 'Monospace', value:'monospace'},
                            {text: 'Cursive', value:'cursive'},
                            {text: 'Fantasy', value:'Fantasy'},
                            ...Utils.getAvailableFonts(),
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
                    text: 'Couleur',
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
            name: 'background', description: 'Background',  type: 'styleattr',
            children: [
                {
                    name: 'backgroundcolor', 
                    text: "Couleur de l'arrière plan",
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
            ]
        },
        {
            name: 'icon', description: 'Icon',  type: 'styleattr',
            children: [
                {
                    name: 'icon', 
                    text: "Icon",
                    input: { 
                        type: 'iconselector',
                        text: 'Select icon',
                        onChange: function(el, value, data){
                           el.setAttribute('class', value);
                        }
                    },
                    getValue: function(el, data){
                        return el.getAttribute('class');
                    }
                },
            ]
        },
        {
            name: 'link', description: 'Link Options',  type: 'styleattr',
            children: [
                {
                    name: 'href', 
                    text: 'HREF',
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
                    text: 'Action du lien',
                    input: { 
                        type: 'radio', 
                        options:[
                            {text: "Même page", value:'_self'},
                            {text: "Nouvelle onglet", value:'_blank' },
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
            name: 'source', description: 'Source',  type: 'htmlattr',
            children: [
                {
                    name: 'src', 
                    text: 'Source',
                    input: { 
                        type: 'text', 
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
            name: 'marginborderpadding', description: 'Marge - Bordure - Padding',  type: 'styleattr',
            children: [{
                name: 'layoutspacing',
                text: "Layout Spacing",
                input: { 
                    type: 'layoutspacingeditor',
                    flags: {showLabel: false},
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
                text: 'Style de la bordure',
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
            name: 'bs-spacingborder', description: 'Espacement - Bordure',  type: 'bootstrap',
            children: [{
                name: 'margin',
                text: "Marge",
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
                text: "Espacement",
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
            },{
                name: 'border',
                text: "Bordure",
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
                text: "Couleur de bordure",
                input: { 
                    type: 'colorselector',
                    options:[
                        {text:"", value: "primary"},
                        {text:"", value: "secondary"},
                        {text:"", value: "success"},
                        {text:"", value: "danger"},
                        {text:"", value: "warning"},
                        {text:"", value: "info"},
                        {text:"", value: "light"},
                        {text:"", value: "dark"}
                    
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
            }
            ]
        },
        {
            name: 'bs-general', description: "De base",  type: 'bootstrap',
            children: [
                {
                    name: 'background',
                    text: "Couleur de l'arrière plan",
                    input: { 
                        type: 'colorselector',
                        options:[
                            {text:"", value: "primary"},
                            {text:"", value: "secondary"},
                            {text:"", value: "success"},
                            {text:"", value: "danger"},
                            {text:"", value: "warning"},
                            {text:"", value: "info"},
                            {text:"", value: "light"},
                            {text:"", value: "dark"}
                        
                        ],
                        onChange: function(el, value, data){
                            let bs = HTMLElementData.getBootstrapComponents(el);

                            for(let item of data.input.options){
                                el.classList.remove(`${bs.value}-${item.value}`);
                            }

                            if(value.length > 0){
                                el.classList.add(`${bs.value}-${value}`);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let result = "";
                        let bs = HTMLElementData.getBootstrapComponents(el);

                        let classList = [...el.classList]

                        for(let item of data.input.options){
                            if(classList.includes(`${bs.value}-${item.value}`)){
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
            name: 'htmlattributes', description: 'Attributs HTML',  type: 'htmlattr',
            children: [
                {
                    name: 'classlist', 
                    text: "Liste des classes",
                    input: { 
                        type: 'multipleselect',
                        flags: {autoAdd: true, showLabel: true},
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
                    name: 'id', 
                    text: 'ID',
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
                }
            ]
        }
    ];

    static propsAssignmentFacade = {
        text: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'marginborderpadding', 'font', 'layout', 'background'],
        controls: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'marginborderpadding', 'font', 'layout', 'background'],
        containers: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'layout', 'background'],

    }

    static elementList = [
        {name: 'Text', children: [
            {
                name: "H1", type: 'native', tagName: 'h1', properties: HTMLElementData.propsAssignmentFacade.text,
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H2", type: 'native', tagName: 'h2', properties: HTMLElementData.propsAssignmentFacade.text,
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H3", type: 'native', tagName: 'h3',  properties: HTMLElementData.propsAssignmentFacade.text,
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H4", type: 'native', tagName: 'h4', properties:  HTMLElementData.propsAssignmentFacade.text,
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H5", type: 'native', tagName: 'h5', properties:  HTMLElementData.propsAssignmentFacade.text,
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H6", type: 'native', tagName: 'h6', properties:  HTMLElementData.propsAssignmentFacade.text,
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {name: "Paragraph", type: 'native', tagName: 'p', properties:  HTMLElementData.propsAssignmentFacade.text,
                init:function(el){
                    el.innerText = "Paragraph";
                }
            }
        ]},
        {name: 'Controls', children: [
            {name: "Button", type: 'bootstrap', tagName: 'button', properties: HTMLElementData.propsAssignmentFacade.controls,
                create: function(){
                    let el = document.createElement("button");
                    el.classList.add('btn');
                    el.classList.add('btn-primary');
                    return el;
                },
            },
            {name: "Link", type: 'native', tagName: 'a', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'link', 'font', 'layout', 'background'],
                init:function(el){
                    el.innerText = "Link";
                    el.setAttribute('href', '#');
                    el.setAttribute('target', '_self');
                },
            },
            {name: "Audio", type: 'native', tagName: 'audio', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'source', 'layout'],
                init:function(el){
                     el.setAttribute('controls', '');
                }, 
            },
            {name: "Video", type: 'native', tagName: 'video', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'source', 'layout'],
                init:function(el){
                    el.width = "320";
                    el.height = "240";
                    el.setAttribute('controls', ''); 
                    //el.setAttribute('src', 'https://recitfad.ca/moodledocs/images/image206.png'); //video placeholder?
                },
            },
            {name: "iFrame", type: 'native', tagName: 'iframe', properties: ['marginborderpadding', 'source', 'layout'],
                init:function(el){
                    el.width = "320";
                    el.height = "240";
                }
            }
        ]},
        {name: 'Containers', children: [
            {name: "Div", type: 'native', tagName: 'div', properties: HTMLElementData.propsAssignmentFacade.containers,
                init:function(el){
                }, 
            },           
            {name: "Grid", type: 'bootstrap', tagName: 'grid', properties: HTMLElementData.propsAssignmentFacade.containers,
                create: function(){
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
            },
            {name: "Ligne", type: 'bootstrap', tagName: 'row', properties:  HTMLElementData.propsAssignmentFacade.containers,
                create: function(){
                    let el = document.createElement("div");
                    el.classList.add("row");
                    return el;
                }
            },
            {name: "Colonne", type: 'bootstrap', tagName: 'col', properties:  HTMLElementData.propsAssignmentFacade.containers,
                create: function(){
                    let el = document.createElement("div");
                    el.classList.add("col");
                    return el;
                }
            },
            {name: "Unordered list", type: 'native', tagName: 'ul', properties:  HTMLElementData.propsAssignmentFacade.containers,
                init:function(el){
                    el.innerHTML = "<li>List</li>";
                }
            },
            {name: "Ordered list", type: 'native', tagName: 'ol', properties:  HTMLElementData.propsAssignmentFacade.containers,
                init:function(el){
                    el.innerHTML = "<li>List</li>";
                }
            },
            {name: "List Item", type: 'native', tagName: 'li', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'font', 'layout', 'background'],
                init:function(el){
                    el.innerText = "Item";
                }
            },
            {name: "Alerte", type: 'bootstrap', tagName: 'alert', properties:  HTMLElementData.propsAssignmentFacade.containers,
                create: function(){
                    let el = document.createElement("div");
                    el.classList.add("alert");
                    el.classList.add("alert-primary");
                    el.setAttribute("role", "alert");
                    return el;
                }
            },
            {name: "Séparateur", type: 'native', tagName: 'hr', properties: HTMLElementData.propsAssignmentFacade.containers}
        ]},
        {name: 'Images', children: [
            {name: "Image", type: 'native', tagName: 'img', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'source', 'layout'],
                init:function(el){
                    el.setAttribute('src', `.${ImageEmpty}`);
                },
            },
            {name: "Icon", type: 'native', tagName: 'i', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'icon', 'font'],
                init:function(el){
                    el.classList.add('icon-emo-happy-1');//TODO: Default icon
                },
            }
        ]},
    ];

    static getElementData(data, el){
        data = data || null;
        el = el || null;

        let tagName = (data !== null ?  data.tagName : el.tagName.toLowerCase());

        // bootstrap components
        if(el !== null){
            if(el.classList.contains('row') || el.classList.contains('col') || el.classList.contains('container')){
                tagName = "grid";
            }
        }

        for(let section of HTMLElementData.elementList){
            for(let item of section.children){
                if(item.tagName === tagName){
                    return item;
                }
            }
        }

        return null;
    }

    static createElement(componentData){
        let el = null;
        if(componentData.type === 'native'){
            el = document.createElement(componentData.tagName);
            let component = HTMLElementData.getElementData(componentData);
            if (component.init){
                component.init(el);
            }
        }
        else if(componentData.type === 'bootstrap'){
            let component = HTMLElementData.getElementData(componentData);
            el = component.create();
        }
        else if(componentData.type === 'custom'){
            el = new DOMParser().parseFromString(componentData.htmlString, "text/html");
            el = el.body.firstChild;
        }
        else{
            console.log(`Component type not found: ${componentData}`);
        }

        return el;
    }

    static getBootstrapComponents(el){
        let result = {text: el.tagName, value: el.tagName.toLowerCase()};
        result.text = result.text.charAt(0).toUpperCase() + result.text.toLowerCase().slice(1);

        if(el.classList.contains('container')){
            result.text = 'Container';
            result.value = 'container';
        }
        else if(el.classList.contains('container-fluid')){
            result.text = 'Container';
            result.value = 'container-fluid';
        }
        else if(el.classList.contains('row')){
            result.text = 'Row';
            result.value = 'row';
        }
        else if(el.classList.contains('col')){
            result.text = 'Col';
            result.value = 'col';
        }
        else if(el.classList.contains('alert')){
            result.text = 'Alert';
            result.value = 'alert';
        }
        else if(el.classList.contains('btn')){
            result.text = 'Button';
            result.value = 'btn';
        }
        else if(el.className.search('border') >=0 ){
            result.text = 'Border';
            result.value = 'border';
        }

        return result;
    }
}