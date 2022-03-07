import React, { Component } from 'react';
import {faTint} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n } from '../utils/i18n';


export class LayoutSpacingEditor extends Component {
    static styleKeys = ['marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth', 'borderColor'];
    static defaultProps = {
        name: "",
        values: {},
        onChange: null,
    };
    
    constructor(props){
        super(props);
        
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onBorderClick = this.onBorderClick.bind(this);
        this.colorRef = React.createRef()
        this.borderRef = React.createRef()
    }
    
    render() {

        let main = <div className="layoutspacing_layout-onion">
        <div className="layoutspacing_margin">
           <label>{i18n.get_string('margin')}</label>
           <input type="text" name="marginTop" className="layoutspacing_top" placeholder="-" value={this.props.values.marginTop} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
           <input type="text" name="marginRight" className="layoutspacing_right" placeholder="-" value={this.props.values.marginRight} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
            <input type="text" name="marginBottom" className="layoutspacing_bottom" placeholder="-" value={this.props.values.marginBottom} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
            <input type="text" name="marginLeft" className="layoutspacing_left" placeholder="-" value={this.props.values.marginLeft} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
           <div className="layoutspacing_border" style={{borderColor: this.props.values.borderColor, cursor: 'pointer'}} onClick={this.onBorderClick} ref={this.borderRef}>
              <label>{i18n.get_string('border')}</label>
              <input type="color" ref={this.colorRef} name="borderColor" style={{visibility:'hidden'}} value={this.props.values.borderColor} onInput={this.onBlur} onChange={this.onChange}/>
              <input type="text" name="borderTopWidth" className="layoutspacing_top" placeholder="-" value={this.props.values.borderTopWidth} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
              <input type="text" name="borderRightWidth" className="layoutspacing_right" placeholder="-" value={this.props.values.borderRightWidth} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
              <input type="text" name="borderBottomWidth" className="layoutspacing_bottom" placeholder="-" value={this.props.values.borderBottomWidth} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
              <input type="text" name="borderLeftWidth" className="layoutspacing_left" placeholder="-" value={this.props.values.borderLeftWidth} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
              <div className="layoutspacing_padding">
                 <label>{i18n.get_string('padding')}</label>
                 <input type="text" name="paddingTop" className="layoutspacing_top" placeholder="-" value={this.props.values.paddingTop} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
                 <input type="text" name="paddingRight" className="layoutspacing_right" placeholder="-" value={this.props.values.paddingRight} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
                 <input type="text" name="paddingBottom" className="layoutspacing_bottom" placeholder="-" value={this.props.values.paddingBottom} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
                 <input type="text" name="paddingLeft" className="layoutspacing_left" placeholder="-" value={this.props.values.paddingLeft} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown}/>
                 <div className="layoutspacing_content"><i></i></div>
              </div>
           </div>
        </div>
     </div>
        return (main);
    }   

    onBorderClick(event){
        if (event.target != this.borderRef.current) return; //Cancel if user clicked on an input
        this.colorRef.current.click();
    }
    
    onChange(event){
        let values = this.props.values;
        values[event.target.name] = event.target.value;
        this.setState({values:values});
    }
    
    onBlur(event){
        let eventData = {target:{value:{name:event.target.name, value:event.target.value}}};

        this.props.onChange(eventData)
    }

    onKeyDown(event){
        // React cannot access the event in an asynchronous way
        // If you want to access the event properties in an asynchronous way, you should call event.persist() on the event
        event.persist();

        switch(event.key){
            case "Enter":
                this.onBlur(event);
                break;
            default:
        }        
    }
}
