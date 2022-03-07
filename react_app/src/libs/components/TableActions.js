import React, { Component } from 'react';
import {ButtonGroup, Button } from 'react-bootstrap';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n } from '../utils/i18n';

export class TableActions extends Component {
    static defaultProps = {        
        onChange: null,
        showRmCol: false,
    };
    
    constructor(props){
        super(props);
        
        this.onClick = this.onClick.bind(this);
    }
    
    render() {

        let main = 
                <ButtonGroup size='sm'>
                    {this.props.showRmCol && <Button onClick={() => this.onClick('rmcol')}><FontAwesomeIcon icon={faMinus}/>{" "+i18n.get_string('column')}</Button>}
                    <Button onClick={() => this.onClick('addcol')}><FontAwesomeIcon icon={faPlus}/>{" "+i18n.get_string('column')}</Button>
                    <Button onClick={() => this.onClick('addline')}><FontAwesomeIcon icon={faPlus}/>{" "+i18n.get_string('line')}</Button>
                </ButtonGroup>    
        return (main);
    }   
    
    onClick(event){
        this.props.onChange({target:{value:event}});
    }
}
