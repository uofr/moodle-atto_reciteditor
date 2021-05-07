import React, { Component } from 'react';


export class LayoutSpacingEditor extends Component {
    static styleKeys = ['marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];
    static defaultProps = {
        name: "",
        values: {},
        onChange: null,
    };
    
    constructor(props){
        super(props);
        
        this.onChange = this.onChange.bind(this);
    }
    
    render() {

        let main = <div className="layoutspacing_layout-onion">
        <div className="layoutspacing_margin">
           <label>margin</label>
           <input type="text" name="marginTop" className="layoutspacing_top" placeholder="-" value={this.props.values.marginTop} onChange={this.onChange}/>
           <input type="text" name="marginRight" className="layoutspacing_right" placeholder="-" value={this.props.values.marginRight} onChange={this.onChange}/>
            <input type="text" name="marginBottom" className="layoutspacing_bottom" placeholder="-" value={this.props.values.marginBottom} onChange={this.onChange}/>
            <input type="text" name="marginLeft" className="layoutspacing_left" placeholder="-" value={this.props.values.marginLeft} onChange={this.onChange}/>
           <div className="layoutspacing_border">
              <label>border</label>
              <input type="text" name="borderTopWidth" className="layoutspacing_top" placeholder="-" value={this.props.values.borderTopWidth} onChange={this.onChange}/>
              <input type="text" name="borderRightWidth" className="layoutspacing_right" placeholder="-" value={this.props.values.borderRightWidth} onChange={this.onChange}/>
              <input type="text" name="borderBottomWidth" className="layoutspacing_bottom" placeholder="-" value={this.props.values.borderBottomWidth} onChange={this.onChange}/>
              <input type="text" name="borderLeftWidth" className="layoutspacing_left" placeholder="-" value={this.props.values.borderLeftWidth} onChange={this.onChange}/>
              <div className="layoutspacing_padding">
                 <label>padding</label>
                 <input type="text" name="paddingTop" className="layoutspacing_top" placeholder="-" value={this.props.values.paddingTop} onChange={this.onChange}/>
                 <input type="text" name="paddingRight" className="layoutspacing_right" placeholder="-" value={this.props.values.paddingRight} onChange={this.onChange}/>
                 <input type="text" name="paddingBottom" className="layoutspacing_bottom" placeholder="-" value={this.props.values.paddingBottom} onChange={this.onChange}/>
                 <input type="text" name="paddingLeft" className="layoutspacing_left" placeholder="-" value={this.props.values.paddingLeft} onChange={this.onChange}/>
                 <div className="layoutspacing_content"><i></i></div>
              </div>
           </div>
        </div>
     </div>
        return (main);
    }   
    
    onChange(event){
        let eventData = {target:{value:{name:event.target.name, value:event.target.value}}};

        this.props.onChange(eventData)
    }   
}
