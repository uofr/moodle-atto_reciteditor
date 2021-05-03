import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
//import { isNumber } from 'util';

export class InputText extends Component {
    static defaultProps = {
        name: "",
        value: '',
        placeholder: "",
        onChange: null,
        onKeyDown: null,
        autoFocus: false,
        autoSelect: false,
        onCommit: null,
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
    }
    
    render() {       
        let main = <FormControl ref={this.inputRef} autoFocus={this.props.autoFocus} className={"InputText"} name={this.props.name} type="text" 
                    value={this.state.value} placeholder={this.props.placeholder} onChange={this.onChange} onBlur={this.onFocusOut} onKeyDown={this.onKeyDown}
                    disabled={this.props.disabled} size={this.props.size}/>
        return (main);
    }   
    
    onChange(event){ 
        this.setState({value: event.target.value.toString(), dataChanged: true});
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
        let callback = function(){
            if(that.props.onKeyDown !== null){
                that.props.onKeyDown(event);
            }
        }

        switch(event.key){
            case "Enter":
                this.onCommit(callback);
                break;        
            default:
        }        
    }
}
