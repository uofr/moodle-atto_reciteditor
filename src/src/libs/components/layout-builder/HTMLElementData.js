import React from 'react';
import { faRemoveFormat, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify, faPlus, faEllipsisH, faGripLines, faSquare, faRuler} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageEmpty from '../assets/empty.jpg';
import { LayoutSpacingEditor} from '../Components';
import Utils from '../../utils/Utils';

export class HTMLElementData{

    static propertyList = [
        {
            name: 'layout', description: 'Layout',
            children: [
                {
                    name: 'Width', 
                    text: 'Largeur',
                    input: { 
                        type: 'minvaluemax', 
                        defaultValue: '',
                        flags: {showLabel: false},
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
                        flags: {showLabel: false},
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
            name: 'font', description: 'Police de caractère', 
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
                        options: Utils.getAvailableFonts(),
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
            name: 'background', description: 'Background', 
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
            name: 'icon', description: 'Icon', 
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
            name: 'link', description: 'Link Options', 
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
            name: 'source', description: 'Source', 
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
            name: 'cssclasslist', description: 'Liste des classes CSS', 
            children: [{
                name: 'classlist', 
                text: "Liste des classes",
                input: { 
                    type: 'multipleselect',
                    flags: {autoAdd: true, showLabel: false},
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
            }]
        },
        {
            name: 'marginborderpadding', description: 'Marge - Bordure - Padding', 
            children: [{
                name: 'layoutspacing',
                text: "Layout Spacing",
                input: { 
                    type: 'layoutspacing',
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
                        {text: <FontAwesomeIcon className="mr-1" icon={faGripLines} title="Double"/>, value:'double' },
                    ],
                    onChange: function(el, value, data){
                        el.style.borderStyle = value;
                    }
                },
                getValue: function(el, data){
                    return [el.style.borderStyle];
                }
            },]
        }
    ];

    static elementList = [
        {name: 'Text', children: [
            {
                name: "H1", type: 'native', tagName: 'h1', properties: ['cssclasslist', 'marginborderpadding', 'font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H2", type: 'native', tagName: 'h2', properties: ['cssclasslist', 'marginborderpadding', 'font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H3", type: 'native', tagName: 'h3', properties: ['cssclasslist', 'marginborderpadding', 'font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H4", type: 'native', tagName: 'h4', properties: ['cssclasslist', 'marginborderpadding', 'font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H5", type: 'native', tagName: 'h5', properties: ['cssclasslist', 'marginborderpadding', 'font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H6", type: 'native', tagName: 'h6', properties: ['cssclasslist', 'marginborderpadding', 'font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {name: "Paragraph", type: 'native', tagName: 'p', properties: ['cssclasslist', 'marginborderpadding', 'font', 'layout', 'background'],
                init:function(el){
                    el.innerText = "Paragraph";
                }
            }
        ]},
        {name: 'Controls', children: [
            {name: "Button", type: 'bootstrap', tagName: 'button', properties: ['cssclasslist', 'marginborderpadding', 'font', 'layout', 'background'],
                create: function(){
                    let el = document.createElement("button");
                    el.classList.add('btn');
                    el.classList.add('btn-primary');
                    return el;
                },
            },
            {name: "Link", type: 'native', tagName: 'a', properties: ['cssclasslist', 'marginborderpadding', 'link', 'font', 'layout', 'background'],
                init:function(el){
                    el.innerText = "Link";
                    el.setAttribute('href', '#');
                    el.setAttribute('target', '_self');
                },
            },
            {name: "Audio", type: 'native', tagName: 'audio', properties: ['cssclasslist', 'marginborderpadding', 'source', 'layout'],
                init:function(el){
                     el.setAttribute('controls', '');
                }, 
            },
            {name: "Video", type: 'native', tagName: 'video', properties: ['cssclasslist', 'marginborderpadding', 'source', 'layout'],
                init:function(el){
                    el.width = "320";
                    el.height = "240";
                    el.setAttribute('controls', ''); 
                    //el.setAttribute('src', 'https://recitfad.ca/moodledocs/images/image206.png'); //video placeholder?
                },
            }
        ]},
        {name: 'Containers', children: [
            {name: "Div", type: 'native', tagName: 'div', properties: ['cssclasslist', 'marginborderpadding', 'layout', 'background'],
                init:function(el){
                }, 
            },           
            {name: "Grid", type: 'bootstrap', tagName: 'grid', properties: ['cssclasslist', 'marginborderpadding', 'layout', 'background'],
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
            {name: "Ligne", type: 'bootstrap', tagName: 'row', properties: ['cssclasslist', 'marginborderpadding', 'layout', 'background'],
                create: function(){
                    let el = document.createElement("div");
                    el.classList.add("row");
                    return el;
                }
            },
            {name: "Colonne", type: 'bootstrap', tagName: 'col', properties: ['cssclasslist', 'marginborderpadding', 'layout', 'background'],
                create: function(){
                    let el = document.createElement("div");
                    el.classList.add("col");
                    return el;
                }
            },
            {name: "Unordered list", type: 'native', tagName: 'ul', properties: ['cssclasslist', 'marginborderpadding', 'layout', 'background'],
                init:function(el){
                    el.innerHTML = "<li>List</li>";
                }
            },
            {name: "Ordered list", type: 'native', tagName: 'ol', properties: ['cssclasslist', 'marginborderpadding', 'layout', 'background'],
                init:function(el){
                    el.innerHTML = "<li>List</li>";
                }
            },
            {name: "List Item", type: 'native', tagName: 'li', properties: ['cssclasslist', 'marginborderpadding', 'font', 'layout', 'background'],
                init:function(el){
                    el.innerText = "Item";
                }
            },
            {name: "Séparateur", type: 'native', tagName: 'hr', properties: ['cssclasslist', 'marginborderpadding', 'layout', 'background']}
        ]},
        {name: 'Images', children: [
            {name: "Image", type: 'native', tagName: 'img', properties: ['cssclasslist', 'marginborderpadding', 'source', 'layout'],
                init:function(el){
                    el.setAttribute('src', `.${ImageEmpty}`);
                },
            },
            {name: "Icon", type: 'native', tagName: 'i', properties: ['cssclasslist', 'marginborderpadding', 'icon', 'font'],
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
}