import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './libs/components/css/components.scss';
import {RecitEditor} from './libs/components/RecitEditor';

//ReactDOM.render(<RecitEditor />, document.getElementById('root'));

// Find all DOM containers
document.addEventListener('DOMContentLoaded', function(){ 
    let items = document.querySelectorAll("[data-recit-editor='placeholder']");
    for(let placeholder of items){
        //const reciteditorid = parseInt(domContainer.dataset.reciteditorid, 10);
        ReactDOM.render(<RecitEditor content={placeholder.innerHTML}/>, placeholder);
    }
}, false);