// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto HTML editor
 *
 * @package    atto_reciteditor
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */

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
        if(settings){
            return `${settings.wwwroot}/lib/editor/atto/plugins/reciteditor/classes/WebApi.php`;
        }
        else{
            return "Unknown gateway."
        }
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