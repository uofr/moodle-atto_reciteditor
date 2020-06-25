import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './libs/components/css/components.scss';
import {RecitEditor} from './libs/components/RecitEditor';

//ReactDOM.render(<RecitEditor />, document.getElementById('root'));

// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.recit-editor-placeholder')
  .forEach(domContainer => {
    // Read the comment ID from a data-* attribute.
    const reciteditorid = parseInt(domContainer.dataset.reciteditorid, 10);

    ReactDOM.render(
        React.createElement(RecitEditor, { reciteditorid: reciteditorid }), domContainer
    );
  });
