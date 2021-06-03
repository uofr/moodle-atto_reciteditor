import React, { Component } from 'react';
import {ButtonGroup, Button } from 'react-bootstrap';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                    {this.props.showRmCol && <Button onClick={() => this.onClick('rmcol')}><FontAwesomeIcon icon={faMinus}/>{" Colonne"}</Button>}
                    <Button onClick={() => this.onClick('addcol')}><FontAwesomeIcon icon={faPlus}/>{" Colonne"}</Button>
                    <Button onClick={() => this.onClick('addline')}><FontAwesomeIcon icon={faPlus}/>{" Ligne"}</Button>
                </ButtonGroup>    
        return (main);
    }   
    
    onClick(event){
        this.props.onChange({target:{value:event}});
    }
}
