import React, { Component } from 'react';
import Utils, { JsNx } from '../../utils/Utils';
import {Cookies} from '../../utils/Cookies';
import { ButtonGroup, ButtonToolbar, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faFile, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';

export class Templates{
    static data = [];

    static onLoad(){
        let result = new Promise((resolve, reject) => {
            try{
                let tmp = localStorage.getItem('Templates');
                
                if(tmp){
                    tmp = JSON.parse(tmp);
                    if (tmp){
                        Templates.data = tmp;
                    }
                }
            }
            catch(err){
                alert("Error on getting Cookie appData. See console for more information.");
                console.log(err);
            }
            
            resolve();
        });

        return result;
    }

    static onSave(name, image, html){
        let that = this;
        let result = new Promise((resolve, reject) => {
            let item = JsNx.getItem(Templates.data, 'name', name, null);

            if(item){
                item.htmlString = html;
                item.image = image;
            }else{
                Templates.data[Templates.data.length] = {name: name, htmlString: html, image: image};
            }

            that.sortCollection();
            that.saveAsCookie();
            console.log("saving")
            resolve();
        });

        return result;
    }

    static sortCollection(){
        Templates.data.sort((a,b) =>{
            return a.name.toString().localeCompare(b.name.toString());
        })
    }

    static saveAsCookie(){
        try{
            let str = JSON.stringify(Templates.data)
            localStorage.setItem('Templates', str);
        }
        catch(err){
            alert("Error on setting Cookie appData. See console for more information.");
            console.log(err);
        }
    }

    static onDelete(item){
        let that = this;
       
        let result = new Promise((resolve, reject) => {
            if(!window.confirm("Êtes-vous sur de vouloir supprimer l'item ?")){ 
                reject(); 
            }

            JsNx.removeItem(Templates.data, 'name', item.name);
            
            that.saveAsCookie();
           // console.log("deleting")

            resolve();
        });

        return result;
    }

    static onImport(data){
        let that = this;
       
        let result = new Promise((resolve, reject) => {
            if (!data.htmlString && data.html) data.htmlString = data.html;
            if (!data.name){
                alert("Error on importing data. See console for more information.");
                console.log(data);
                reject();
            }
            Templates.data[Templates.data.length] = data;
            that.sortCollection();
            that.saveAsCookie();
            resolve();
        });
        return result;
    }

    static onImportFromFile(fileCtrl){
        let that = this;
       
        let result = new Promise((resolve, reject) => {
            if(fileCtrl.length === 0) {  
                reject(); 
            }

            let reader = new FileReader();
            reader.addEventListener('load', function(e) {
                try{
                    let fileContent = (e.target.result);
                    let newData = JSON.parse(fileContent);
                    if (newData[0]) newData = newData[0];
                    that.onImport(newData);
                    
                    resolve();
                }
                catch(err){
                    alert("Error on importing data. See console for more information.");
                    console.log(err);
                    reject();
                }
            });

            reader.readAsText(fileCtrl.files[0]);
        });

        return result;
    }

    static onExport(item){
        return  "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item));
    }
}


export class TemplateList extends Component{
    static defaultProps = {
        dataProvider: [],
        onDragEnd: null,
        showMenu: false,
        onChange: null
    };

    constructor(props){
        super(props);

        this.onImport = this.onImport.bind(this);
        this.onExport = this.onExport.bind(this);
        this.onSave = this.onSave.bind(this);
        this.showImport = this.showImport.bind(this);
        this.showVitrine = this.showVitrine.bind(this);
        this.hideVitrine = this.hideVitrine.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.receiveMessageFromIframe = this.receiveMessageFromIframe.bind(this);
        this.showMenu = this.showMenu.bind(this);

        this.state = {showImport: false, showVitrine: false, imagePreview: false, showMenu: false};
    }

    componentDidMount(){
        Templates.onLoad().then(() => this.props.onChange());
        window.addEventListener("message", this.receiveMessageFromIframe, false);
    }

    componentWillUnmount(){
        window.removeEventListener("message", this.receiveMessageFromIframe, false);
    }

    render(){       
        let main =
            <div className="tab-content">
                    <div>
                        <ButtonToolbar style={{justifyContent: 'flex-end'}}>
                            <ButtonGroup>
                                    <Button onClick={() => this.showImport(!this.state.showImport)}><FontAwesomeIcon  icon={faFile} title="Importer"/></Button>
                                    <Button onClick={() => this.onSave()}><FontAwesomeIcon  icon={faSave} title="Save"/></Button>
                                    <Button onClick={() => this.showVitrine()}><FontAwesomeIcon  icon={faCloud} title="Vitrine"/> Vitrine</Button>
                            </ButtonGroup>
                            <ButtonGroup style={{marginLeft:'15px'}}>
                                <Button onClick={() => this.showMenu(!this.state.showMenu)} variant={(this.state.showMenu ? 'warning' : 'primary')}><FontAwesomeIcon  icon={faSave} title="Exporter"/></Button>
                                <Button onClick={() => this.showMenu(!this.state.showMenu)} variant={(this.state.showMenu ? 'warning' : 'primary')}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                        {this.state.showImport && <input type="file" onChange={this.onImport} accept=".json"/>}
                    </div>
                    <div className='d-flex flex-wrap'>
                {this.props.dataProvider.map((item, index) => {

                    let branch = 
                            <div key={index} className='template' onMouseEnter={() => this.onMouseEnter(item.image)} onMouseLeave={this.onMouseLeave} onMouseDown={this.onMouseLeave} onDragEnd={this.props.onDragEnd} draggable="true" onDragStart={(e) => this.onDragStart(e, item)}>
                                <div className='tplimg'>
                                    <img src={item.image}/>
                                </div>
                                <p>{item.name}</p>
                                {this.state.showMenu &&
                                    <ButtonToolbar style={{marginLeft: "1rem", display: "inline-flex"}}>
                                        <ButtonGroup size="sm">
                                            <Button onClick={(event) => this.onExport(event, [item])}><FontAwesomeIcon  icon={faSave} title="Exporter"/></Button>
                                            <Button onClick={(event) => this.onDelete(event, item)}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                }
                            </div>

                    return (branch);
                })}
                </div>

                {this.state.showVitrine && 
            <Modal show={true} onHide={this.hideVitrine} backdrop="static" keyboard={false} className='templatevitrine'>
                <Modal.Header closeButton>
                    <Modal.Title>Vitrine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe src='https://recitfad.ca/moodledocs/vitrine_editeur_v2/index.php'/>
                </Modal.Body>
            </Modal>}
            
            {this.state.imagePreview && 
            <div className='templatepreview'>
                <img src={this.state.imagePreview}/>
            </div>}
            </div>;

        return main;
    }

    showMenu(show){
        this.setState({showMenu: show});
    }

    
    onDragStart(event, data){
        data.type = 'custom';
        event.dataTransfer.setData("componentData", JSON.stringify(data));
    }

    onMouseEnter(img){
        this.setState({imagePreview: img});
    }

    onMouseLeave(){
        this.setState({imagePreview: false});
    }

    showImport(show){
        this.setState({showImport: show});
    }

    showVitrine(){
        this.setState({showVitrine: true});
    }

    hideVitrine(){
        this.setState({showVitrine: false});
    }

    onSave(){
        let name = prompt('Nom du gabarit');
        if (!name) return;
        
        let self = this;
        let iframe = document.querySelector('iframe.canvas');
        let body = iframe.contentDocument.body;
        let height = '100%';
        body.style.height = 'auto';
        html2canvas(body, {useCORS: true}).then(canvas =>{
                let data = canvas.toDataURL();
                let MAX_WIDTH = 600;
                let MAX_HEIGHT = 600;
                let fileType = "png"
                Utils.resizeImageFromSize(data, MAX_WIDTH, MAX_HEIGHT, fileType, function(img){
                    Templates.onSave(name, img, body.innerHTML).then(function(data){                
                        alert('success');
                        self.props.onChange();
                    });
                });
                body.style.height = height;
            
        });
    }

    onImport(event){
        let fileCtrl = event.target;
        
        let promise = Templates.onImportFromFile(fileCtrl);
        let that = this;

        promise.then(() => {
            //console.log("imported")
            that.showImport(false);
            that.props.onChange();
        },
        () => { 
                //console.log("canceled")
            }
        );
    }

    onExport(event, item){
        item = item || null
        event.stopPropagation();

        let dataStr = Templates.onExport(item);
        let node = document.createElement('a');
        node.setAttribute("href",     dataStr);
        node.setAttribute("download", "template.json");
        window.document.body.appendChild(node); // required for firefox
        node.click();
        node.remove();
    }

    

    receiveMessageFromIframe(event) {
        switch (event.data.message){
            case 'import':
                Templates.onImport(event.data.value);
                this.hideVitrine();
                break;
        }
    }

    onDelete(event, item){
        event.stopPropagation();

        let promise = Templates.onDelete(item);
        let that = this;

        promise.then(() => {
           // console.log("deleted")
            that.props.onChange();
        },
        () => { 
              // console.log("canceled")
            }
        );
    }
}