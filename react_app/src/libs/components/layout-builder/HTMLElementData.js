import React from 'react';
import { faRemoveFormat, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify, faPlus, faMinus, faEllipsisH, faGripLines, faSquare, faRuler, faEllipsisV, faFolder} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LayoutSpacingEditor, Assets} from '../Components';
import Utils, {UtilsHTML} from '../../utils/Utils';

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
            name: 'icon', description: 'Icône',  type: 'bootstrap',
            children: [
                {
                    name: 'icon', 
                    text: "Icône",
                    input: { 
                        type: 'iconselector',
                        text: 'Selectionner icône',
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
                    text: "Taille des icônes",
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
            name: 'link', description: 'Link Options',  type: 'htmlattr',
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
                            {text: "Nouvel onglet", value:'_blank' },
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
            name: 'videobtn', description: 'Source',  type: 'htmlattr',
            children: [
                {
                    name: 'src', 
                    text: 'URL du vidéo',
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
            name: 'videosource', description: 'Source',  type: 'htmlattr',
            children: [
                {
                    name: 'src', 
                    text: 'URL du vidéo',
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
            name: 'tab', description: 'Paramètres d\'onglet',  type: 'bootstrap',
            children: [
                {
                    name: 'style', 
                    text: 'Style',
                    input: {
                        type: 'radio',
                        options:[
                            {text: <FontAwesomeIcon icon={faFolder} title="Onglet"/>, value:'nav-tabs'},
                            {text: <FontAwesomeIcon icon={faEllipsisH} title="Pastille"/>, value:'nav-pills'}
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

                        if (tab.classList.contains('nav-pills')) return 'nav-pills';
                        return '';
                    }
                },
                {
                    name: 'justify',
                    text: 'Justifier',
                    input: {
                        type: 'radio',
                        options:[                            
                            {text: <FontAwesomeIcon icon={faAlignLeft} title="Left"/>, value:''},
                            {text: <FontAwesomeIcon icon={faAlignCenter} title="Center"/>, value:'justify-content-center'},
                            {text: <FontAwesomeIcon icon={faAlignRight} title="Right"/>, value:'justify-content-end'},
                            {text: <FontAwesomeIcon icon={faAlignJustify} title="Pleine largeur"/>, value:'nav-fill'},
                            {text: <FontAwesomeIcon icon={faEllipsisV} title="Horizontal"/>, value:'flex-column'},
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
                    text: 'Actions',
                    input: {
                        type: 'button',
                        text: <span><FontAwesomeIcon icon={faPlus} title="Ajouter une onglet"/>{" Onglet"}</span>,
                        onChange: function(el, value, data){
                            let tab = el;
                            if (el.classList.contains('nav-link')) tab = el.parentElement.parentElement;
                            if (el.classList.contains('tab-pane')) tab = el.parentElement.parentElement.querySelector('.nav');
                            if (el.classList.contains('tabs')) tab = el.querySelector('.nav');
                            
                            let nav = document.createElement('li');
                            nav.classList.add('nav-item');
                            tab.appendChild(nav);
                            
                            let link = document.createElement('a');
                            link.classList.add('nav-link');

                            let tabid = tab.querySelectorAll('.nav-link').length + 1;
                            link.innerText = `Onglet ${tabid}`;
                            tabid = `tab${tabid}`;

                            link.setAttribute('data-toggle', 'tab');
                            link.setAttribute('role', 'tab');
                            link.setAttribute('href', '#'+tabid);
                            link.setAttribute('arial-controls', tabid);
                            nav.appendChild(link)

                            let content = tab.parentElement.querySelector('.tab-content');
                            let div = document.createElement('div');
                            div.classList.add('tab-pane', 'fade', 'mt-3');
                            div.setAttribute('role', 'tabpanel');
                            div.setAttribute('id', tabid);
                            div.setAttribute('arial-labelledby', tabid);
                            div.innerText = tabid;
                            content.appendChild(div);
                        }
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
            name: 'marginborderpadding', description: 'Marge - Bordure - Padding',  type: 'styleattr',
            children: [{
                name: 'layoutspacing',
                text: "Espacement",
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
            name: 'bs-spacing', description: 'Espacement',  type: 'bootstrap',
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
            }
            ]
        },                
        {
            name: 'bs-border', description: 'Bordure',  type: 'bootstrap',
            children: [{
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
            },
            {
                name: 'borderradius',
                text: "Angles des coins",
                input: { 
                    type: 'combobox',
                    options:[
                        {text:"Rounded", value: "rounded"},
                        {text:"Rounded-Top", value: "rounded-top"},
                        {text:"Rounded-Right", value: "rounded-right"},
                        {text:"Rounded-Bottom", value: "rounded-bottom"},
                        {text:"Rounded-Left", value: "rounded-left"},
                        {text:"Rounded-Circle", value: "rounded-circle"},
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
            name: 'bs-general', description: "De base",  type: 'bootstrap',
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
                            let bs = HTMLElementData.mapBootstrapComponents(el);

                            for(let item of data.input.options){
                                el.classList.remove(`${bs.prefix}-${item.value}`);
                            }

                            if(value.length > 0){
                                el.classList.add(`${bs.prefix}-${value}`);
                            }
                        }
                    },
                    getValue: function(el, data){
                        let result = "";
                        let bs = HTMLElementData.mapBootstrapComponents(el);

                        let classList = [...el.classList]

                        for(let item of data.input.options){
                            if(classList.includes(`${bs.prefix}-${item.value}`)){
                                result = item.value;
                                break;
                            }
                        }

                        return result;
                    }
                },
                {
                    name: 'btnblock',
                    text: "Btn Block",
                    input: { 
                        type: 'radio',
                        options:[
                            {text:"Oui", value: "btn-block"},
                            {text:"Non", value: ""}
                        
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
                    name: 'shadow',
                    text: "Ombre",
                    input: { 
                        type: 'radio',
                        options:[
                            {text: <FontAwesomeIcon icon={faRemoveFormat} title="Remove Format"/>, value:'default'},
                            {text:"None", value: "shadow-none"},
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
            name: 'bs-text', description: "Texte",  type: 'bootstrap',
            children: [
                {
                    name: 'color',
                    text: "Couleur",
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
                    text: 'Alignement',
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
                    name: 'resposivesize', 
                    text: 'Responsive Size',
                    input: { 
                        type: 'radio', 
                        options:[
                            {text: <FontAwesomeIcon icon={faRemoveFormat} title="Défaut"/>, value:'default'},
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
            name: 'htmlattributes', description: 'Attributs HTML',  type: 'htmlattr',
            children: [
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
                },
            ]
        },
        {
            name: 'table', description: 'Table',  type: 'bootstrap',
            children: [{
                name: 'tableaction',
                text: "Actions",
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
                text: "Bordure",
                input: { 
                    type: 'radio',
                    options: [
                        {text: "Non", value:0},
                        {text: "Oui", value:1},
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
                text: "Barré",
                input: { 
                    type: 'radio',
                    options: [
                        {text: "Non", value:0},
                        {text: "Oui", value:1},
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
            name: 'tablecell', description: 'Table',  type: 'bootstrap',
            children: [{
                name: 'tableaction',
                text: "Actions",
                input: { 
                    type: 'buttongroup',
                    options: [ 
                        {
                            text: <span><FontAwesomeIcon icon={faMinus}/>{" Colonne"}</span>, 
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
                            text: <span><FontAwesomeIcon icon={faPlus}/>{" Colonne"}</span>, 
                            onClick: function(el){
                                let table = el.parentElement.parentElement;
                                let result = UtilsHTML.tableAddCol(table);
                                return {action: 'insert', nodes: result};
                            }
                        },
                        {
                            text: <span><FontAwesomeIcon icon={faPlus}/>{" Ligne"}</span>, 
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
        containers: ['bs-general', 'bs-text', 'bs-spacing', 'bs-border', 'htmlattributes', 'layout', 'background'],

    }

    static elementList = [
        {name: 'Texte', children: [
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
            {name: "Paragraphe", type: 'native', tagName: 'p', properties:  HTMLElementData.propsAssignmentFacade.text,
                init:function(el){
                    el.innerText = "Paragraphe";
                }
            }
        ]},
        {name: 'Contrôle', children: [
            {name: "Bouton", type: 'bootstrap', tagName: 'button', properties: HTMLElementData.propsAssignmentFacade.controls,
                create: function(){
                    let el = document.createElement("button");
                    el.classList.add('btn');
                    el.classList.add('btn-primary');
                    el.innerHTML = "Bouton";
                    return el;
                },
            },
            {name: "Bouton collapse", type: 'bootstrap', tagName: 'buttoncollapse', properties: [...HTMLElementData.propsAssignmentFacade.controls, 'collapse'],
                create: function(){
                    let el = document.createElement("button");
                    el.classList.add('btn');
                    el.classList.add('btn-primary', 'btn-collapse');
                    el.setAttribute('data-bs-toggle', 'collapse');
                    el.innerHTML = "Bouton collapse";
                    return el;
                },
            },
            {name: "Lien", type: 'native', tagName: 'a', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'link', 'font', 'layout', 'background'],
                init:function(el){
                    el.innerText = "Lien";
                    el.setAttribute('href', '#');
                    el.setAttribute('target', '_self');
                },
            },
            {name: "Audio", type: 'native', tagName: 'audio', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'source', 'layout'],
                init:function(el){
                     el.setAttribute('controls', '');
                }, 
            },
            {name: "Vidéo", type: 'bootstrap', tagName: 'video', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'videosource', 'layout'],
                create: function(){
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
                },
            },
            {name: "Bouton vidéo", type: 'bootstrap', tagName: 'videobtn', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'videobtn', 'font', 'layout', 'background'],
                create: function(){
                    let el = document.createElement("button");
                    el.innerHTML = 'Bouton vidéo';
                    el.classList.add('btn');
                    el.classList.add('btn-primary');
                    el.classList.add('videobtn');
                    el.setAttribute('data-videourl', 'https://www.youtube.com/embed/WvljI0VIq-E?rel=0');
                    return el;
                },
            },
            {name: "iFrame", type: 'native', tagName: 'iframe', properties: ['marginborderpadding', 'source', 'layout'],
                init:function(el){
                    el.width = "320";
                    el.height = "240";
                }
            }
        ]},
        {name: 'Containeurs', children: [
            {name: "Div", type: 'native', tagName: 'div', properties: HTMLElementData.propsAssignmentFacade.containers,
                init:function(el){
                }, 
            },  
            {name: "Span", type: 'native', tagName: 'span', properties: HTMLElementData.propsAssignmentFacade.containers,
                init:function(el){}, 
            },  
            {name: "Section", type: 'native', tagName: 'section', properties: HTMLElementData.propsAssignmentFacade.containers,
                init:function(el){}, 
            },         
            {name: "Grille", type: 'bootstrap', tagName: 'grid', properties: HTMLElementData.propsAssignmentFacade.containers,
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
            {name: "Liste", type: 'native', tagName: 'ul', properties:  HTMLElementData.propsAssignmentFacade.containers,
                init:function(el){
                    el.innerHTML = "<li>Liste</li>";
                }
            },
            {name: "Liste ordonnée", type: 'native', tagName: 'ol', properties:  HTMLElementData.propsAssignmentFacade.containers,
                init:function(el){
                    el.innerHTML = "<li>Liste</li>";
                }
            },
            {name: "Table", type: 'bootstrap', tagName: 'table', properties:  ['table', ...HTMLElementData.propsAssignmentFacade.containers],
                create:function(){
                    let el = document.createElement('table');
                    el.classList.add('table')
                    let tbody = document.createElement('tbody')
                    el.appendChild(tbody)
                   
                    for (let i = 0; i < 5; i++){
                        let row = document.createElement('tr');
                        tbody.appendChild(row);
                        for (let j = 0; j < 5; j++){
                            let tag = 'td';
                            if (i == 0) tag = 'th'
                            let cell = document.createElement(tag)
                            row.appendChild(cell)
                        }
                    }

                    return el;
                }
            },
            {name: "Cellule de table", type: 'native', tagName: 'td', properties:  ['tablecell', ...HTMLElementData.propsAssignmentFacade.containers],
                init:function(el){
                    el.innerHTML = "Cell";
                }
            },
            {name: "Élément de liste", type: 'native', tagName: 'li', properties: ['bs-general', 'bs-spacingborder', 'htmlattributes', 'font', 'layout', 'background'],
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
            {name: "Card", type: 'bootstrap', tagName: 'card', properties:  HTMLElementData.propsAssignmentFacade.containers,
                create: function(){
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
            },
            {name: "Carte pivotante", type: 'bootstrap', tagName: 'flipcard', properties:  HTMLElementData.propsAssignmentFacade.containers,
                create: function(){
                    let card = document.createElement("div");
                    card.classList.add("card");
                    card.classList.add("flipcard2");
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
                },
                onSelect: function(el){
                    let card = el.parentElement.parentElement;
                    if(el.classList.contains("back")){
                        card.classList.add('hover');
                    }else{
                        card.classList.remove('hover');
                    }
                }
            },
            {name: "Media", type: 'bootstrap', tagName: 'media', properties:  HTMLElementData.propsAssignmentFacade.containers,
                create: function(){
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
            },
            {name: "Carousel", type: 'bootstrap', tagName: 'slider', properties:  HTMLElementData.propsAssignmentFacade.containers,
                create: function(){
                    let slider = document.createElement("div");
                    slider.classList.add("carousel");
                    slider.classList.add("slide");
                    slider.setAttribute("data-ride", "carousel");

                    slider.innerHTML = 
                        `<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel" data-tag-id="3">
                    <ol class="carousel-indicators" data-tag-id="4">
                      <li data-target="#carouselExampleIndicators" data-slide-to="0" data-tag-id="5">
                      </li>
                      <li data-target="#carouselExampleIndicators" data-slide-to="1" data-tag-id="6">
                      </li>
                      <li data-target="#carouselExampleIndicators" data-slide-to="2" data-tag-id="7">
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
                    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev" data-tag-id="24">
                      <i class="fa-3x fa fa-arrow-circle-left" data-tag-id="25"></i>
                      <span class="sr-only" data-tag-id="26">
                            Précédent
                          </span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next" data-tag-id="27">
                      <i class="fa-3x fa fa-arrow-circle-right" data-tag-id="28"></i>
                      <span class="sr-only" data-tag-id="29">
                            Suivant
                          </span>
                    </a>
                  </div>`;

                    return slider;
                },
                onSelect: function(el){
                    if(el.classList.contains("carousel-item")){
                        let slider = el.parentElement;
                        let slides = slider.querySelectorAll('.carousel-item');
                        for(let slide of slides){
                            slide.classList.remove('active');
                        }
                        el.classList.add('active');
                    }
                }
            },
            {name: "Onglet", type: 'bootstrap', tagName: 'tab', properties: [...HTMLElementData.propsAssignmentFacade.containers, 'tab'],
                create: function(){
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
                                Contenu de l'onglet 1
                            </div>
                            <div class="tab-pane fade mt-3" id="tab2" role="tabpanel" aria-labelledby="tab2">
                                Contenu de l'onglet 2
                            </div>
                            <div class="tab-pane fade mt-3" id="tab3" role="tabpanel" aria-labelledby="tab3">
                                Contenu de l'onglet 3
                            </div>
                        </div>`;

                    return slider;
                },
                onSelect: function(el){
                    if(el.classList.contains("tab-pane")){
                        let slider = el.parentElement.parentElement;
                        let slides = slider.querySelectorAll('.tab-pane');
                        for(let slide of slides){
                            slide.classList.remove('active', 'show');
                        }
                        el.classList.add('active', 'show');
                    }
                }
            },
            {name: "Séparateur", type: 'native', tagName: 'hr', properties: HTMLElementData.propsAssignmentFacade.containers}
        ]},
        {name: 'Images', children: [
            {name: "Image", type: 'bootstrap', tagName: 'img', properties: ['bs-general', 'bs-spacing', 'bs-border', 'htmlattributes', 'source', 'layout'],
                create:function(){
                    let el = document.createElement("img");
                    el.setAttribute('src', `${Assets.ImageEmpty}`);
                    el.classList.add("img-fluid");
                    return el;
                },
            },
            {name: "Image avec légende", type: 'bootstrap', tagName: 'imgpopup', properties: ['bs-general', 'bs-spacing', 'bs-border', 'htmlattributes', 'source', 'layout'],
                create:function(){
                    let div = document.createElement("figure");
                    div.classList.add('figure-caption');
                    div.classList.add('text-center');
                    
                    let el = document.createElement("img");
                    el.setAttribute('src', `${Assets.ImageEmpty}`);
                    el.classList.add("img-fluid");
                    el.classList.add("img-popup");
                    div.appendChild(el);

                    el = document.createElement("figcaption");
                    el.innerHTML = "Source : Nom de l'auteur, <span class='font-italic'>titre de la photo ou de l'oeuvre</span> (année), nom de l'institution qui possède l'œuvre.";
                    div.appendChild(el);

                    return div;
                },
            },
            {name: "Image cliquable", type: 'bootstrap', tagName: 'imgclick', properties: ['bs-general', 'bs-spacing', 'bs-border', 'htmlattributes', 'source', 'layout'],
                create:function(){
                    let div = document.createElement("div");
                    div.classList.add('imgclick');
                    
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
                    el.innerHTML = 'Commencer';
                    div2.appendChild(el);
                    div.appendChild(div2);

                    return div;
                },
            },
            {name: "Icône", type: 'native', tagName: 'i', properties: ['bs-general', 'bs-text', 'bs-spacing', 'bs-border', 'htmlattributes', 'icon', 'font'],
                init:function(el){
                    el.classList.add('fa', 'fa-anchor');//Default icon
                },
            }
        ]},
    ];

    static elementListSort = function(){
        HTMLElementData.elementList.sort((a,b) =>{
            return a.name.toString().localeCompare(b.name.toString());
        })

        for(let item of HTMLElementData.elementList){
            item.children.sort((a,b) =>{
                return a.name.toString().localeCompare(b.name.toString());
            })
        }
    }

    static getElementData(data, el){
        data = data || null;
        el = el || null;

        let tagName = (data !== null ?  data.tagName : el.tagName.toLowerCase());

        // bootstrap components
        if(el !== null){
            let bootstrapData = HTMLElementData.mapBootstrapComponents(el);
            if (bootstrapData && bootstrapData.tagName){
                tagName = bootstrapData.tagName;
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
        else if((componentData.type === 'c') || (componentData.type === 'l')){
            let html = componentData.htmlStr || componentData.htmlstr; //Save file sometimes void caps
            if (!html){
                alert('Erreur: invalid component');
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

    static mapBootstrapComponents(el){
        let result = {text: el.tagName, prefix: el.tagName.toLowerCase()};
        result.text = result.text.charAt(0).toUpperCase() + result.text.toLowerCase().slice(1);

        if(el.classList.contains('container')){
            result.text = 'Container';
            result.tagName = 'grid';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('container-fluid')){
            result.text = 'Container';
            result.tagName = 'grid';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('row')){
            result.text = 'Ligne';
            result.tagName = 'grid';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('col') || el.classList.contains('col-12')){
            result.text = 'Col';
            result.tagName = 'grid';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('card')){
            result.text = 'Card';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('flipcard2')){
            result.text = 'Carte pivotante';
            result.tagName = 'flipcard';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('video')){
            result.text = 'Vidéo';
            result.tagName = 'video';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('video-container')){
            result.text = 'Container de vidéo';
            result.tagName = 'video';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('embed-responsive')){
            result.text = 'Embed';
            result.tagName = 'div';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('videobtn')){
            result.text = 'Bouton vidéo';
            result.tagName = 'videobtn';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('front')){
            result.text = 'Devant';
            result.tagName = 'flipcard';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('back')){
            result.text = 'Arrière';
            result.tagName = 'flipcard';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('card-header')){
            result.text = 'Header';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('card-body')){
            result.text = 'Body';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('card-footer')){
            result.text = 'Footer';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('alert')){
            result.text = 'Alerte';
            result.prefix = 'alert';
        }
        else if(el.classList.contains('fa') || (el.classList[0] && el.classList[0].includes('icon-'))){
            result.text = 'Icône';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('btn-collapse')){
            result.text = 'Bouton collapse';
            result.tagName = 'buttoncollapse';
            result.prefix = 'btn';
        }
        else if(el.classList.contains('btn')){
            result.text = 'Bouton';
            result.tagName = 'button';
            result.prefix = 'btn';
        }
        else if(el.classList.contains('tabs')){
            result.text = 'Onglets';
            result.tagName = 'tab';
            result.prefix = 'tab';
        }
        else if(el.classList.contains('tab-content')){
            result.text = 'Contenu Tabs';
            result.tagName = 'tab';
            result.prefix = 'tab';
        }
        else if(el.classList.contains('tab-pane')){
            result.text = 'Contenu onglet #'+el.id;
            result.tagName = 'tab';
            result.prefix = 'tab';
        }
        else if(el.classList.contains('nav')){
            result.text = 'Nav';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('nav-item')){
            result.text = 'NavItem';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('nav-link')){
            result.text = 'Onglet #'+el.getAttribute('aria-controls');
            result.prefix = 'btn';
        }
        else if(el.className.search('border-') >=0){
            result.text = 'Bordure';
            result.prefix = 'border';
        }
        else if(el.classList.contains('img-popup')){
            result.text = 'Image modal';
            result.tagName = 'imgpopup'
            result.prefix = 'bg';
        }
        else if(el.classList.contains('imgclick')){
            result.text = 'Image cliquable';
            result.tagName = 'div'
            result.prefix = 'bg';
        }
        else if(el.classList.contains('media')){
            result.text = 'Media';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('media-body')){
            result.text = 'Media Body';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('carousel') || el.classList.contains('carousel-inner') || el.classList.contains('carousel-item')){
            result.text = 'Carousel';
            result.tagName = 'slider';
            result.prefix = 'bg';
        }
        else if(el.classList.contains('carousel-control-prev') || el.classList.contains('carousel-control-next')){
            result.text = 'Carousel Navigation';
            result.prefix = 'bg';
        }
        else if(el.tagName == 'TH'){
            result.text = 'Table Heading';
            result.prefix = 'bg';
            result.tagName = 'td';
        }
        else if(el.tagName == 'TD'){
            result.text = 'Table Cell';
            result.prefix = 'bg';
            result.tagName = 'td';
        }
        else if(el.tagName == 'TR'){
            result.text = 'Table Row';
            result.prefix = 'bg';
            result.tagName = 'tr';
        }
        /*else if(el.className.search('text-') >=0 ){
            result.text = 'Text';
            result.prefix = 'text';
        }*/
        else{
            result.prefix = 'bg';
        }

        return result;
    }
}

HTMLElementData.elementListSort();

