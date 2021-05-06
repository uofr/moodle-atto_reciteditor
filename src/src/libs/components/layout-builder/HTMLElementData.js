import React from 'react';
import { faRemoveFormat, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify, faPlus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageEmpty from '../assets/empty.jpg';

export class HTMLElementData{

    static propertyList = [
        {
            name: 'layout', description: 'Layout',
            children: [
                {
                    name: 'width', 
                    text: 'Largeur',
                    input: { 
                        type: 'text', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                           el.style.width = value;
                        }
                    },
                    getValue: function(el, data){
                        return el.style.width;
                    }
                },
                {
                    name: 'height', 
                    text: 'Hauteur',
                    input: { 
                        type: 'text', 
                        defaultValue: '',
                        onChange: function(el, value, data){
                           el.style.height = value;
                        }
                    },
                    getValue: function(el, data){
                        return el.style.height;
                    }
                },
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
            name: 'basic', description: 'De base', 
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
        
    ];

    static elementList = [
        {name: 'Text', children: [
            {
                name: "H1", type: 'native', tagName: 'h1', properties: ['font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H2", type: 'native', tagName: 'h2', properties: ['font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H3", type: 'native', tagName: 'h3', properties: ['font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H4", type: 'native', tagName: 'h4', properties: ['font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H5", type: 'native', tagName: 'h5', properties: ['font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {
                name: "H6", type: 'native', tagName: 'h6', properties: ['font', 'layout', 'background'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {name: "Paragraph", type: 'native', tagName: 'p', properties: ['font', 'layout', 'background'],
                init:function(el){
                    el.innerText = "Paragraph";
                }
            },
            {name: "Unordered list", type: 'native', tagName: 'ul', properties: ['font', 'layout', 'background'],
                init:function(el){
                    el.innerHTML = "<li>List</li>";
                }
            },
            {name: "Ordered list", type: 'native', tagName: 'ol', properties: ['font', 'layout', 'background'],
                init:function(el){
                    el.innerHTML = "<li>List</li>";
                }
            },
            {name: "List Item", type: 'native', tagName: 'li', properties: ['font', 'layout', 'background'],
                init:function(el){
                    el.innerText = "Item";
                }
            },
        ]},
        {name: 'Controls', children: [
            {name: "Button", type: 'native', tagName: 'button', properties: ['font', 'layout', 'background'],
                init:function(el){
                    el.innerText = el.tagName.toLowerCase();
                    el.classList.add('btn');
                    el.classList.add('btn-primary');
                },
            },
            {name: "Link", type: 'native', tagName: 'a', properties: ['link', 'font', 'layout', 'background'],
                init:function(el){
                    el.innerText = "Link";
                    el.setAttribute('href', '#');
                    el.setAttribute('target', '_self');
                },
            },
            {name: "Audio", type: 'native', tagName: 'audio', properties: ['basic', 'layout'],
                init:function(el){
                     el.setAttribute('controls', '');
                }, 
            },
            {name: "Video", type: 'native', tagName: 'video', properties: ['basic', 'layout'],
                init:function(el){
                    el.width = "320";
                    el.height = "240";
                    el.setAttribute('controls', ''); 
                    //el.setAttribute('src', 'https://recitfad.ca/moodledocs/images/image206.png'); //video placeholder?
                },
            }
        ]},
        {name: 'Containers', children: [
            {name: "Div", type: 'native', tagName: 'div', properties: ['layout', 'background'],
                init:function(el){
                }, 
            },           
            {name: "Grid", type: 'bootstrap', tagName: 'grid', properties: ['grid', 'layout', 'background'],
                create: function(){
                    let el = document.createElement("div");
                    el.classList.add("container");
                    
                    let row = document.createElement("div");
                    row.classList.add("row");
                    el.appendChild(row);

                    let col = document.createElement("div");
                    col.classList.add("col");
                    col.innerHTML = "Col 1";
                    row.appendChild(col);

                    col = document.createElement("div");
                    col.classList.add("col");
                    col.innerHTML = "Col 2";
                    row.appendChild(col);

                    col = document.createElement("div");
                    col.classList.add("col");
                    col.innerHTML = "Col 3";
                    row.appendChild(col);

                    return el;
                }
            },
            {name: "Ligne", type: 'bootstrap', tagName: 'row', properties: ['layout', 'background'],
                create: function(){
                    let el = document.createElement("div");
                    el.classList.add("row");
                    return el;
                }
            },
            {name: "Colonne", type: 'bootstrap', tagName: 'col', properties: ['layout', 'background'],
                create: function(){
                    let el = document.createElement("div");
                    el.classList.add("col");
                    return el;
                }
            },
            {name: "Séparateur", type: 'native', tagName: 'hr', properties: ['layout', 'background']}
        ]},
        {name: 'Images', children: [
            {name: "Image", type: 'native', tagName: 'img', properties: ['basic', 'layout'],
                init:function(el){
                    el.setAttribute('src', `.${ImageEmpty}`);
                },
            },
            {name: "Icon", type: 'native', tagName: 'i', properties: ['icon', 'font'],
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