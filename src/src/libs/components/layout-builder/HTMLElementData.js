import React from 'react';
import { faRemoveFormat, faAlignLeft, faAlignCenter, faAlignRight} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class HTMLElementData{
    static propertyList = [
        {
            name: 'text', description: 'Text Options', 
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
                            {text: <FontAwesomeIcon icon={faAlignRight} title="Right"/>, value:'text-right' }
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
                            if (el.classList.contains(option)){
                                return option;
                            }
                        }
                        return false;
                    }
                },
            ]
        },
        {
            name: 'link', description: 'Link Options', 
            children: [
                {
                    name: 'href', 
                    text: 'Link',
                    input: { 
                        type: 'text', 
                        defaultValue: ['#'],
                        onCommit: function(el, value, data){
                            el.href = value;
                        }
                    },
                    getValue: function(el){
                        return el.href;
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
                        defaultValue: ['_self'],
                        onChange: function(el, value, data){
                            el.target = value;
                        }
                    },
                    getValue: function(el){
                        return el.target;
                    }
                },
            ]
        },
        {
            name: 'audio', description: 'Audio Options', 
            children: [
                {
                    name: 'src', 
                    text: 'Source de l\'audio',
                    input: { 
                        type: 'text', 
                        defaultValue: [''],
                        onCommit: function(el, value, data){
                            el.src = value;
                        }
                    },
                    getValue: function(el){
                        return el.src;
                    }
                },
            ]
        },
        {
            name: 'image', description: 'Image Options', 
            children: [
                {
                    name: 'src', 
                    text: 'Source de l\'image',
                    input: { 
                        type: 'text', 
                        defaultValue: [''],
                        onCommit: function(el, value, data){
                            el.src = value;
                        }
                    },
                    getValue: function(el){
                        return el.src;
                    }
                },
                {
                    name: 'height', 
                    text: 'Hauteur de l\'image',
                    input: { 
                        type: 'number', 
                        defaultValue: [''],
                        onChange: function(el, value, data){
                            el.height = value;
                        }
                    },
                    getValue: function(el){
                        return el.height;
                    }
                },
                {
                    name: 'width', 
                    text: 'Largeur de l\'image',
                    input: { 
                        type: 'number', 
                        defaultValue: [''],
                        onChange: function(el, value, data){
                            el.width = value;
                        }
                    },
                    getValue: function(el){
                        return el.width;
                    }
                },
            ]
        },
        {
            name: 'video', description: 'Video Options', 
            children: [
                {
                    name: 'src', 
                    text: 'Source du vidéo',
                    input: { 
                        type: 'text', 
                        defaultValue: [''],
                        onCommit: function(el, value, data){
                            el.src = value;
                        }
                    },
                    getValue: function(el){
                        return el.src;
                    }
                },
                {
                    name: 'height', 
                    text: 'Hauteur du vidéo',
                    input: { 
                        type: 'number', 
                        defaultValue: [''],
                        onChange: function(el, value, data){
                            el.height = value;
                        }
                    },
                    getValue: function(el){
                        return el.height;
                    }
                },
                {
                    name: 'width', 
                    text: 'Largeur du vidéo',
                    input: { 
                        type: 'number', 
                        defaultValue: [''],
                        onChange: function(el, value, data){
                            el.width = value;
                        }
                    },
                    getValue: function(el){
                        return el.width;
                    }
                },
            ]
        },
    ];

    static elementList = [
        {name: 'Text', children: [
            {
                name: "Heading", type: 'native', tagName: 'h1', properties: ['text'],
                init: function (el) {
                    el.innerText = el.tagName.toLowerCase();
                },
            },
            {name: "Paragraph", type: 'native', tagName: 'p', init:function(el){
                el.innerText = el.tagName.toLowerCase();
            }, properties: ['text']}
        ]},
        {name: 'Controls', children: [
            {name: "Button", type: 'native', tagName: 'button', properties: ['text'],
                init:function(el){
                    el.innerText = el.tagName.toLowerCase();
                    el.classList.add('btn');
                    el.classList.add('btn-primary');
                },
            },
            {name: "Link", type: 'native', tagName: 'a', init:function(el){
                el.innerText = el.tagName.toLowerCase();
                el.href = '#';
            }, properties: ['text', 'link']},

            {name: "Audio", type: 'native', tagName: 'audio', init:function(el){
                el.setAttribute('controls', '1')
            }, properties: ['audio']},
        ]},
        {name: 'Containers', children: [
            {name: "Div", type: 'native', tagName: 'div', properties: []},
            {name: "Séparateur", type: 'native', tagName: 'hr', properties: []}
        ]},
        {name: 'Images', children: [
            {name: "Image", type: 'native', tagName: 'img', init:function(el){
                el.setAttribute('src', "data:image/jpeg;base64,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");
            }, properties: ['image']},
            {name: "Video", type: 'native', tagName: 'video', init:function(el){
                //el.setAttribute('src', 'https://recitfad.ca/moodledocs/images/image206.png'); //video placeholder?
            }, properties: ['video']},
        ]},
    ];

    static getElement(tagName){
        for(let section of HTMLElementData.elementList){
            for(let item of section.children){
                if(item.tagName === tagName){
                    return item;
                }
            }
        }

        return null;
    }
}