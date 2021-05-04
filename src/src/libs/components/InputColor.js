import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
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
    }
    
    render() {       
        let value = Utils.RGBToHex(this.props.value);

        let main = <Form.Control size={this.props.size} name={this.props.name} type="color" value={value} 
                            onChange={this.onChange} disabled={this.props.disabled} style={{width: "80px"}}/>
        return (main);
    }   
    
    onChange(event){ 
        let eventData = {
            target: {name: this.props.name, value: event.target.value}
        };

        this.props.onChange(eventData)
    }   
}
