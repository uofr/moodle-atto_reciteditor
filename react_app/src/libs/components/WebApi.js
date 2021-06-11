
import { UtilsMoodle } from '../utils/Utils';

export class WebApi{
    constructor(){
        this.gateway = this.getGateway();
        this.post = this.post.bind(this);
        this.loading = document.getElementById("tt-loading");
    }

    getGateway(){
        let atto = UtilsMoodle.getAttoInterface();
        let settings = atto.getSettings();
        return `${settings.wwwroot}/lib/editor/atto/plugins/reciteditor/classes/WebApi.php`;
    }

    post(url, data){
        let that = this;

        let result = new Promise((resolve, reject) => {
            data = JSON.stringify(data);

            let xhr = new XMLHttpRequest();
    
            xhr.open("post", url, true);
            // Header sent to the server, specifying a particular format (the content of message body).
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            xhr.setRequestHeader('Accept', 'json'); // What kind of response to expect.
            
            xhr.onload = function(event){
                let response = null;

                try{
                    response = JSON.parse(event.target.response);
                }
                catch(error){
                    reject(error, event.target.response);
                }

                if(that.loading){
                    that.loading.style.display = "none";
                }
                
                resolve(response);
            }
    
            xhr.onerror = function(err){
                reject(err);
            }
    
            if(that.loading){
                that.loading.style.display = "block";
            }
            
            xhr.send(data);
        });

        return result;       
    }

    saveTemplate(data){
        let options = {};
        options.data = data;
        options.service = "saveTemplate";
        return this.post(this.gateway, options);
    }

    getTemplateList(type){
        let options = {};
        options.data = {type: type || ''};
        options.service = "getTemplateList";
        return this.post(this.gateway, options);
    }

    deleteTemplate(id){
        let options = {};
        options.data = {id: id};
        options.service = "deleteTemplate";
        return this.post(this.gateway, options);
    }

    importTemplates(fileContent){
        let options = {};
        options.data = {fileContent: fileContent};
        options.service = "importTemplates";
        return this.post(this.gateway, options);
    }
}