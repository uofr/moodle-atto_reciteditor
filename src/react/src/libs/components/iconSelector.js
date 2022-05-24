// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto HTML editor
 *
 * @package    atto_reciteditor
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */

import React, { Component } from 'react';
import { Button, Modal, FormControl } from 'react-bootstrap';
import { faIcons} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Utils, {UtilsMoodle } from '../utils/Utils';
import {Assets} from '../components/Components';
import {IFrame} from './iframe';
import { i18n } from '../utils/i18n';

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
        this.buildIconList();
    }

    buildIconList(){
        this.icons = {Fontello: [], FontAwesome: []};
        let cssRules = UtilsMoodle.getThemeMoodleCssRules();

        for (let c of cssRules){
            if (c.cssText.includes('content:') && c.selectorText){
                if (c.selectorText.startsWith('.fa-')){//FontAwesome
                    let css = c.selectorText.replace('::before', '')
                    css = css.replace(':before', '').substr(1);
                    this.icons.FontAwesome.push({name: css.replace('fa-', ''), css: 'fa '+css});
                }
                if (c.selectorText.startsWith('.icon-')){//Fontello
                    let css = c.selectorText.replace('::before', '').substr(1);
                    this.icons.Fontello.push({name: css.replace('icon-', ''), css: css});
                }
                if (c.selectorText.startsWith('.recitfad-')){// recitfad old custom
                    let css = c.selectorText.replace('::before', '').substr(1);
                    this.icons.Fontello.push({name: css.replace('recitfad-', ''), css: css});
                }
            }
        }
    }

    render() {
        let items = this.getIconTable();

        let main = 
            <Button key="1" name={this.props.name} size="sm" variant="primary" onClick={this.handleShow} disabled={this.props.disabled}>
                <FontAwesomeIcon icon={faIcons}/>{` ${this.props.text}`}
            </Button>;
        
        let modal = <Modal key="2" dialogClassName='iconselectormodal' show={this.state.modal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.get_string('selecticon')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormControl className={"InputText mb-3"} type="text" value={this.state.search} onChange={this.onSearch} placeholder={"Recherche"} />
            <IFrame style={{width: '100%', height: '70vh', border: '0'}}>
                <div style={{width: '100%', height: '100%', backgroundColor: '#fff'}}>
                    <link rel="stylesheet" href={UtilsMoodle.getThemeMoodleUrl()}/>
                    <div style={{backgroundColor: '#fff'}}>
                        {items}
                    </div>
                </div>
            </IFrame>
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
                content.push(<div key={key} style={{ width: '70px', height: '62px', textAlign: 'center', cursor: 'pointer', fontSize: '10px', margin: '20px', marginBottom: '30px'}} onClick={() => this.onChange(val.css)}>
                    <i className={val.css} style={{fontSize:'40px'}}></i>
                    <br/>{val.name}
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
            for (let val of this.icons[cat]) {
                if (!search || val.css.includes(search)){
                    iconList[cat].push({name: val.name, css: val.css});
                }
            }
        }
        return iconList;
    }  
}