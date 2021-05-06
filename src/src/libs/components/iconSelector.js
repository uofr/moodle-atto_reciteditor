import React, { Component } from 'react';
import { Button, Modal, FormControl } from 'react-bootstrap';
import Utils from '../utils/Utils';
import './assets/fontello/css/fontello.css';
import fontData from './assets/fontello/config.json';

export class IconSelector extends Component {
    static defaultProps = {
        name: '',
        text: '',
        value: '',
        disabled: false,
    };
    
    constructor(props){
        super(props);
        
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {modal:false, search: ''};
    }


    
    render() {
        let items = this.getIconTable();

        let main = <Button key="1" name={this.props.name} variant="info" onClick={this.handleShow} disabled={this.props.disabled}>{this.props.text}</Button>;
        
        let modal = <Modal key="2" show={this.state.modal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Icons</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflowY: 'scroll', maxHeight: '75vh'}}>
            <FormControl className={"InputText"} type="text" value={this.state.search} onChange={this.onSearch} placeholder={"Recherche"} style={{marginLeft: '15px', width: '91%'}}/>
            <div className={"d-flex flex-wrap"}>
                {items}
            </div>
        </Modal.Body>
      </Modal>;
        return [modal, main];
    }

    handleClose(){
        this.setState({modal:false})
    }

    handleShow(){
        this.setState({modal:true})
    }

    onSearch(event){
        this.setState({search:event.target.value});
    }

    getIconTable(){
        let icons = this.getIconList(this.state.search);
        let items = [];
        let style = {
            'width': '70px',
            'height': '62px',
            'textAlign': 'center',
            'cursor': 'pointer',
            'fontSize': '10px',
            'border': '1px solid #c6c6c6',
            'margin': '20px',
            'marginBottom': '30px',
        }
        let key = 0;
        for (let val of icons){
            items.push(<div key={key} style={style} onClick={() => this.onChange(fontData.css_prefix_text+val.css)}>
                <i className={fontData.css_prefix_text+val.css} style={{fontSize:'40px'}}></i>
                <br/>{val.css}
            </div>);
            key++;
        }
        return items;
    }
    
    onChange(val){ 
        let eventData = {
            target: {value: val}
        };

        this.props.onChange(eventData);
        this.handleClose();
    }
    
    getIconList(search){
        let iconList = [];
        for (let val of fontData.glyphs) {
            if (!search || val.css.includes(search)){
                var code = ""+ String.fromCharCode(val.code)+"";
                iconList.push( {value: fontData.css_prefix_text+ val.css, text: code + " " + val.css, css: val.css} );
            }
        }
        return iconList;
    }  
}
