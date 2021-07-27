import {WebApi} from '../WebApi';

export class Templates{
    static componentList = [];
    static layoutList = [];

    static webApi = new WebApi();

    static onLoad(){
        let p = Templates.webApi.getTemplateList();

        let p2 = p.then((webApiResult) => {
            if(webApiResult.success){
                Templates.componentList = webApiResult.data.c;
                Templates.layoutList = webApiResult.data.l;
            }
            else{
                alert(`Error: ${webApiResult.msg}`);
            }
            return webApiResult;
        },
        (err, response) => {
            console.log(err, response);
        });

        return p2;
    }

    static onSave(name, type, htmlStr, img){
        let data = {};
        data.name = name;
        data.htmlStr = htmlStr;
        data.type = type;
        data.img = img || '';
        return Templates.webApi.saveTemplate(data);
    }

    static onDelete(item){
        if(window.confirm("Êtes-vous sur de vouloir supprimer l'item ?")){ 
            return Templates.webApi.deleteTemplate(item.id);
        }

        return null;
    }

    static onImport(fileCtrl, dataObj){
        dataObj = dataObj || null;

        let p1 = new Promise((resolve, reject) => {            
            if(fileCtrl !== null){
                if(fileCtrl.length === 0) { reject(); }
    
                let reader = new FileReader();
                reader.addEventListener('load', function(e) {
                    try{
                        let fileContent = (e.target.result);
                        resolve(fileContent);
                    }
                    catch(err){
                        alert("Error on importing data. See console for more information.");
                        console.log(err);
                        reject();
                    }
                });

                reader.readAsText(fileCtrl.files[0]);
            }
            else{
                resolve(JSON.stringify(dataObj));
            }           
        });

        let result = p1.then((fileContent) => {
            return Templates.webApi.importTemplates(fileContent);
        });

        return result;
    }

    static onExport(item){
        return  "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item));
    }
}
