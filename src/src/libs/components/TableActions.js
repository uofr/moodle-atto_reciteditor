import React, { Component } from 'react';
import { Form, ButtonGroup, Button } from 'react-bootstrap';

export class TableActions extends Component {
    static defaultProps = {        
        onChange: null,
        style: null,
        className: "",
        showRmCol: false,
    };
    
    constructor(props){
        super(props);
        
        this.onClick = this.onClick.bind(this);
    }
    
    render() {

        let main = 
                <ButtonGroup>
                    {this.props.showRmCol && <Button onClick={() => this.onClick('rmcol')}>Supprimer colonne</Button>}
                    <Button onClick={() => this.onClick('addcol')}>Ajouter colonne</Button>
                    <Button onClick={() => this.onClick('addline')}>Ajouter ligne</Button>
                </ButtonGroup>    
        return (main);
    }   
    
    onClick(event){
        this.props.onChange({target:{value:event}});
    }
}
