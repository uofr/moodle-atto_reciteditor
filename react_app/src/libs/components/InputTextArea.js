import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
//import { isNumber } from 'util';

export class InputTextArea extends Component {
    static defaultProps = {
        name: "",
        value: '',
        placeholder: "",
        onChange: null,
        onKeyDown: null,
        autoFocus: false,
        autoSelect: false,
        onCommit: null,
        minHeight: 70,
        maxHeight: 700,
        disabled: false,
        size: ""
    };
    
    static getDerivedStateFromProps(nextProps, prevState){
        // if the data has changed then the component waits until the commit event in order to modify the value coming from props values
        if(prevState.dataChanged){ return null; }

        let nextValue = nextProps.value;
        if(nextValue !== prevState.value){
            return({value: nextValue, dataChanged: false});
        }
        return null;
    }

    constructor(props){
        super(props);
        
        this.onCommit = this.onCommit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.state = {dataChanged: false};    
        if (this.props.value){
           this.state.value = this.props.value;
        }

        this.inputRef = React.createRef();
    }

    componentDidMount(){
        if(this.props.autoSelect){
            this.inputRef.current.select();
        }
        this.resize();
    }
    
    render() {       
        let main = <FormControl ref={this.inputRef} autoFocus={this.props.autoFocus} className={"InputText"} name={this.props.name} as="textarea" 
                    value={this.state.value} placeholder={this.props.placeholder} onChange={this.onChange} onBlur={this.onFocusOut} onKeyDown={this.onKeyDown}
                    disabled={this.props.disabled} size={this.props.size}/>
        return (main);
    }

    resize(){
        this.inputRef.current.style.height = "0px";
        let scrollHeight = this.inputRef.current.scrollHeight;
        if (scrollHeight < this.props.minHeight) scrollHeight = this.props.minHeight;
        if (scrollHeight > this.props.maxHeight) scrollHeight = this.props.maxHeight;
        this.inputRef.current.style.height = scrollHeight + "px";
    }
    
    onChange(event){ 
        let val = event.target.value.toString();
        this.setState({value: val, dataChanged: true});
        this.resize();
    }   
    
    onCommit(callback){
        callback = callback || null;
        
       // if(!this.state.dataChanged){ return;}
        let value = this.state.value;
        
        let eventData = {
            target: {name: this.props.name, value: value}                
        };
        
        this.setState({dataChanged: false}, () => {
            if (this.props.onChange) this.props.onChange(eventData);
            if (this.props.onCommit) this.props.onCommit(eventData);
            if(callback !== null){callback();};
        });
    }

    onFocusOut(event){
        this.onCommit();
    }

    onKeyDown(event){   
        let that = this;
        // React cannot access the event in an asynchronous way
        // If you want to access the event properties in an asynchronous way, you should call event.persist() on the event
        event.persist();
        if(that.props.onKeyDown !== null){
            that.props.onKeyDown(event);
        }

    }
}
