import React from 'react';
import ReactDOM from 'react-dom';
import {RecitRichEditor} from './libs/components/Components';
import {UtilsMoodle} from './libs/utils/Utils';
import {Options} from './Options';

// Find all DOM containers
/*document.addEventListener('DOMContentLoaded', function(){ 
    let items = document.querySelectorAll("[data-recit-rich-editor='placeholder']");
    for(let i = 0; i < items.length; i++){
        //const reciteditorid = parseInt(domContainer.dataset.reciteditorid, 10);
        let placeholder = items[i];
        let name = placeholder.getAttribute("id") || `recitRichEditor${i}`;
        console.log(name);
        ReactDOM.render(<RecitRichEditor ref={(instance) => {window.name = instance}} content={placeholder.innerHTML}/>, placeholder);
    }
}, false);*/

if(process.env.NODE_ENV === "development"){    
    // Bootstrap is loaded only in dev mode because Moodle already has Bootstrap files
    //React.lazy(() => import('bootstrap/dist/css/bootstrap.min.css'));
    console.log(`Dev: ${Options.appName()} - v:${Options.appVersion()}`); 
    let attoInterface = UtilsMoodle.getAttoInterface();
    ReactDOM.render(<RecitRichEditor content={attoInterface.getContent()} onSaveAndClose={attoInterface.setContent} />, document.getElementById('root')); 
}
else{
    /*window.RecitRichEditorCreateInstance = function(placeholder, onChange){
        let name = placeholder.getAttribute("id") || `recit_rich_editor_${Date.now()}`;
        console.log(`${Options.appName()} - v:${Options.appVersion()}`, name); 
        ReactDOM.render(<RecitRichEditor name={name} content={placeholder.innerHTML} onChange={onChange}/>, placeholder);
    }*/
    console.log(`Prod: ${Options.appName()} - v:${Options.appVersion()}`); 
    let attoInterface = UtilsMoodle.getAttoInterface();
    ReactDOM.render(<RecitRichEditor content={attoInterface.getContent()} onSaveAndClose={attoInterface.setContent}/>, document.getElementById('root')); 
}

