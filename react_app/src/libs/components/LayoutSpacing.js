import React, { Component } from 'react';
import { ComboBox} from './ComboBox';

export class LayoutSpacing extends Component {
    static defaultProps = {
        name: "",
        value: [], 
        options: [],
        onChange: null,
    };
    
    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);

        /*this.state = {
            paddingTop: [
                {text:"0", value: "pt-0"},
                {text:"1", value: "pt-1"},
                {text:"2", value: "pt-2"},
                {text:"3", value: "pt-3"},
                {text:"4", value: "pt-4"},
                {text:"5", value: "pt-5"},
            ],
            paddingBottom: [
                {text:"0", value: "pb-0"},
                {text:"1", value: "pb-1"},
                {text:"2", value: "pb-2"},
                {text:"3", value: "pb-3"},
                {text:"4", value: "pb-4"},
                {text:"5", value: "pb-5"},
            ],
            paddingRight: [
                {text:"0", value: "pr-0"},
                {text:"1", value: "pr-1"},
                {text:"2", value: "pr-2"},
                {text:"3", value: "pr-3"},
                {text:"4", value: "pr-4"},
                {text:"5", value: "pr-5"},
            ],
            paddingLeft: [
                {text:"0", value: "pl-0"},
                {text:"1", value: "pl-1"},
                {text:"2", value: "pl-2"},
                {text:"3", value: "pl-3"},
                {text:"4", value: "pl-4"},
                {text:"5", value: "pl-5"},
            ]
        }*/
    }
    
    render() {
        /*let main = 
            <div className="layout-spacing">
                <div className='margin-spacing '>
                    <span className="text-muted name">Marge</span>
                    <ComboBox size='sm' className="item-1"></ComboBox>
                    <ComboBox size='sm' className="item-2"></ComboBox>
                    <ComboBox size='sm' className="item-3"></ComboBox>
                    <ComboBox size='sm' className="item-4"></ComboBox>
                    <div className="border-options item-5">
                        <span className="text-muted name">Bordure</span>
                        <ComboBox size='sm' className="item-1"></ComboBox>
                        <ComboBox size='sm' className="item-2"></ComboBox>
                        <ComboBox size='sm' className="item-3"></ComboBox>
                        <ComboBox size='sm' className="item-4"></ComboBox>
                        <div className="padding-spacing item-5">
                            <span className="text-muted name">Padding</span>
                            <ComboBox name={"paddingTop"} value={this.getValue('paddingTop')} size='sm' className="item-1" options={this.state.paddingTop} onChange={this.onChange}></ComboBox>
                            <ComboBox name={"paddingRight"} value={this.getValue('paddingRight')} size='sm' className="item-2" options={this.state.paddingRight} onChange={this.onChange}></ComboBox>
                            <ComboBox name={"paddingBottom"} value={this.getValue('paddingBottom')} size='sm' className="item-3" options={this.state.paddingBottom} onChange={this.onChange}></ComboBox>
                            <ComboBox name={"paddingLeft"} value={this.getValue('paddingLeft')}  size='sm' className="item-4" options={this.state.paddingLeft} onChange={this.onChange}></ComboBox>
                            <div className="background item-5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>*/

//        if(this.props.options.length !== 4){ return null;}


        let that = this;
        let main = 
            <div className="layout-spacing">
                {this.props.options.map((option, index) => {
                    let dataProvider = [];

                    for(let i = 0; i < option.nbItems; i++){
                        dataProvider.push({text: i, value: `${option.name}-${i}`});
                    }

                    let oldValue = that.getValue(dataProvider);
                    let result = <ComboBox key={index} name={option.name} value={oldValue} size='sm' className={`item-${index+1}`} options={dataProvider} 
                                        onChange={(event) => that.onChange(oldValue, event.target.value)}></ComboBox>;
                    return result;
                })}
            </div>

        return (main);
    }   

    getValue(options){
        for(let className of this.props.value){
            for(let option of options){
                if(option.value === className){
                    return className;
                }
            }
        }

        return "";
    }

    onChange(oldValue, newValue){
        let result = {target:{name: this.props.name, value: {oldValue: oldValue, newValue: newValue}}}
        this.props.onChange(result);
    }
}
