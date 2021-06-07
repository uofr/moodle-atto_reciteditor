import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { faRemoveFormat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Utils from '../utils/Utils';

export class InputColor extends Component {
    static defaultProps = {
        name: "",
        value: '#000000',
        onChange: null,
        disabled: false,
        size: ""
    };
    
    constructor(props){
        super(props);
        
        this.onChange = this.onChange.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.state = {value:this.props.value};
    }
    
    render() {       
        let value = Utils.RGBToHex(this.state.value);

        let main = 
            <div style={{display: "inline-flex"}}>
                <Form.Control size={this.props.size} name={this.props.name} type="color" value={value} 
                                onChange={this.onChange} onBlur={this.onBlur} disabled={this.props.disabled} style={{width: "80px"}}/>
                <Button className="ml-1" size='sm' variant={'primary'} onClick={this.onReset} title={"Supprimer le format"}><FontAwesomeIcon icon={faRemoveFormat}/></Button>
            </div>
        return (main);
    }   
    
    onChange(event){ 
        let eventData = {
            target: {name: this.props.name, value: event.target.value}
        };

        this.setState({value:event.target.value});

        if (this.props.onChange){
            this.props.onChange(eventData);
        }
    }
    
    onBlur(event){ 
        let eventData = {
            target: {name: this.props.name, value: this.state.value}
        };

        if (this.props.onBlur){
            this.props.onBlur(eventData);
        }
    }

    onReset(){
        let eventData = {
            target: {name: this.props.name, value: ''}
        };

        this.props.onChange(eventData)
    }
}
