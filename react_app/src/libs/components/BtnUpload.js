import React, { Component } from 'react';
import { faCloudUploadAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class BtnUpload extends Component {
    static defaultProps = {
        onChange: null,
        accept: "",
        id: "",
        size: "",
        title: ""
    };

    render() {       
        let main =
                <label htmlFor={this.props.id} className={`btn btn-primary ${this.props.size}`} title={this.props.title} style={{margin: 0}}>
                    <FontAwesomeIcon icon={faCloudUploadAlt}/>
                    <input id={this.props.id} style={{display: "none"}} type="file" onChange={this.props.onChange} accept={this.props.accept}/>
                </label>

        return (main);
    }   
}
