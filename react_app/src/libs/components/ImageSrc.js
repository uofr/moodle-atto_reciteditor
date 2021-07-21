import React, { Component } from 'react';
import { InputGroup } from 'react-bootstrap';
import { InputText, BtnUpload } from './Components';
import { MoodleUploadFile } from '../utils/Utils';
import { faCloudUploadAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class ImageSrc extends Component {
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
    
    constructor(props){
        super(props);
    
        this.onUpload = this.onUpload.bind(this);
        this.onUploadDone = this.onUploadDone.bind(this);

        this.moodleUpload = new MoodleUploadFile();
    }

    render() {       
        let main =
                <InputGroup className="mb-3">
                    <InputText name={this.props.name} value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.onChange}
                            onKeyDown={this.props.onKeyDown} autoFocus={this.props.autoFocus} autoSelect={this.props.autoSelect} onCommit={this.props.onCommit} disabled={this.props.disabled}
                            size={this.props.size}/>
                    <InputGroup.Append>
                        <BtnUpload id="file-upload" size="btn-sm" accept=".jpg, .png" onChange={this.onUpload}/>
                    </InputGroup.Append>
                </InputGroup>
        return (main);
    }   

    onUpload(event){
        this.moodleUpload.onSelectFileToUpload(event, this.onUploadDone);
    }

    onUploadDone(url){
        //if image is succesfully uploaded set image url
        //event.data.element.trigger('propertyChange', [url, that]);
        //update src input
        //$('input[type="text"]', event.data.element).val(url);
        let eventData = {
            target: {name: this.props.name, value: url}                
        };
        if (this.props.onChange){
            this.props.onChange(eventData);
        }
        if (this.props.onCommit){
            this.props.onCommit(eventData);
        }
    }
}
