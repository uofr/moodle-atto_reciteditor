import React from 'react';
import ReactDOM from 'react-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './libs/components/css/components.scss';
import {RecitRichEditor} from './libs/components/RecitRichEditor';
import {Options} from './Options';
//ReactDOM.render(<RecitEditor />, document.getElementById('root'));

console.log(`${Options.appName()} - v:${Options.appVersion()}`);

// Find all DOM containers
document.addEventListener('DOMContentLoaded', function(){ 
    let items = document.querySelectorAll("[data-recit-rich-editor='placeholder']");
    for(let placeholder of items){
        //const reciteditorid = parseInt(domContainer.dataset.reciteditorid, 10);
        ReactDOM.render(<RecitRichEditor content={placeholder.innerHTML}/>, placeholder);
    }
}, false);