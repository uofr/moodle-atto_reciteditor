import React, { Component } from 'react';
import { Button, Modal, FormControl } from 'react-bootstrap';
//import './assets/fontello/css/fontello.css';
//import './assets/fontawesome/css/fontello.css';
//import fontData from './assets/fontello/config.json';
//import faData from './assets/fontawesome/config.json';
import { faIcons} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Assets} from './Components';

export class IconSelector extends Component {
    static defaultProps = {
        name: '',
        text: '',
        value: '',
        lib: 'fa',
        disabled: false,
    };
    
    constructor(props){
        super(props);
        
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {modal:false, search: ''};
        this.icons = {'Fontello': Assets.FontelloData, FontAwesome: Assets.FontAwesomeData};
    }


    
    render() {
        let items = this.getIconTable();

        let main = 
            <Button key="1" name={this.props.name} size="sm" variant="primary" onClick={this.handleShow} disabled={this.props.disabled}>
                <FontAwesomeIcon icon={faIcons}/>{` ${this.props.text}`}
            </Button>;
        
        let modal = <Modal key="2" show={this.state.modal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Icons</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflowY: 'scroll', maxHeight: '50vh'}}>
            <FormControl className={"InputText mb-3"} type="text" value={this.state.search} onChange={this.onSearch} placeholder={"Recherche"} />
            <div className={"IconSelector"}>
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
       
        let key = 0;
        for (let cat in icons){
            items.push(<h3 key={key}>{cat}</h3>)
            key++;
            let content = [];
            for (let val of icons[cat]){
                content.push(<div key={key} className="IconItem" onClick={() => this.onChange(this.icons[cat].css_prefix_text+val.css)}>
                    <i className={this.icons[cat].css_prefix_text+val.css} style={{fontSize:'40px'}}></i>
                    <br/>{val.css}
                </div>);
                key++;
            }
            items.push(<div key={key} className={"d-flex flex-wrap mb-3"}>{content}</div>);
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
        for (let cat in this.icons){
            iconList[cat] = [];
            for (let val of this.icons[cat].glyphs) {
                if (!search || val.css.includes(search)){
                    var code = ""+ String.fromCharCode(val.code)+"";
                    iconList[cat].push( {value: this.icons[cat].css_prefix_text+ val.css, text: code + " " + val.css, css: val.css} );
                }
            }
        }
        return iconList;
    }  
}
