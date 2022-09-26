import { faParagraph, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { i18n, UtilsString } from './Utils';

export class TextEditorModal extends React.Component {
    static defaultProps = {
        onClose: null,
        onSave: null,
        value: ''
    };    

    constructor(props){
        super(props);

        this.onDataChange = this.onDataChange.bind(this);
        this.editorRef = React.createRef();

        this.state = {value: props.value};
        this.initModules();
        console.log(props.value)
    }

    render(){
        let main = 
            <Modal show={true} onHide={this.props.onClose} size='lg' backdrop="static" keyboard={false} >
                <Modal.Body>
                    <div id="cktoolbar">
                        <span className="ql-formats">
                            <button className="ql-bold"></button>
                            <button className="ql-italic"></button>
                            <button className="ql-underline"></button>
                            <button className="ql-strike"></button>
                        </span>
                        <span className="ql-formats">
                            <select className="ql-color" />
                            <select className="ql-background" />
                        </span>
                        <span className="ql-formats">
                            <button className="ql-list" value="ordered"></button>
                            <button className="ql-list" value="bullet"></button>
                        </span>
                        <span className='ql-formats'>
                            <select className="ql-header" defaultValue={''} onChange={(e) => e.persist()}>
                                <option value="2"></option>
                                <option value="3"></option>
                                <option value="4"></option>
                                <option value="5"></option>
                                <option></option>
                            </select>
                        </span>
                        <span className="ql-formats">
                            <button className="ql-clean"></button>
                            <button className="ql-nonbreakingspace" title={i18n.get_string('nonbreakingspace')}>
                                <FontAwesomeIcon icon={faParagraph}/>
                            </button>
                        </span>
                    </div>
                    <ReactQuill style={{height:'250px'}} theme="snow" value={this.state.value} onChange={this.onDataChange} modules={this.modules} ref={this.editorRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onClose}><FontAwesomeIcon icon={faTimes} title={i18n.get_string('cancel')}/> {i18n.get_string('cancel')}</Button>
                    <Button variant="success" onClick={() => this.onSave()}><FontAwesomeIcon icon={faSave} title={i18n.get_string('save')}/> {i18n.get_string('save')}</Button>
                </Modal.Footer>
            </Modal>;
            
        return main;
    }

    onDataChange(val){
        this.setState({value: val});
    }

    onSave(){
        let val = this.state.value.replace(/<p(\s+[a-z0-9\-_\'\"=]+)*><\/p>/ig, '');//Remove empty tags
        this.props.onSave(val);
    }

    initModules(){
        let that = this;
        this.modules = {
            toolbar: {
                container: '#cktoolbar',
                handlers: {
                    "nonbreakingspace": function (value) {
                        let val = EditorModuleNonBreakingSpace.process(that.state.value);
                        that.setState({value: val});
                    }
                }
            }
        }
    }
}

class EditorModuleNonBreakingSpace {
    static process(text){
        let el = document.createElement('div');
        el.innerHTML = text;
        
        EditorModuleNonBreakingSpace.replaceNonBreakingSpace(el);

        return el.innerHTML;
    }

    static replaceNonBreakingSpace(el){
        for (let t of el.childNodes){
    

            if (t.innerHTML){
                t.innerHTML = UtilsString.replaceNonBreakingSpace(t.innerHTML)
            }else{
                t.data = UtilsString.replaceNonBreakingSpace(t.textContent)
            }
        }
    }
}