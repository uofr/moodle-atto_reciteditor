import { JsNx } from '../../utils/Utils';
import {Cookies} from '../../utils/Cookies';

export class CustomHtmlComponents{
    static data = [];

    static onLoad(){
        try{
            let tmp = Cookies.get('appData', null);
            
            if(tmp !== null){
                tmp = JSON.parse(tmp);
                if (tmp){
                    CustomHtmlComponents.data = tmp;
                }
            }
        }
        catch(err){
            alert("Error on getting Cookie appData. See console for more information.");
            console.log(err);
        }
    }

    static onSave(data, selectedElement){
        let that = this;
        let result = new Promise((resolve, reject) => {
            let section = JsNx.getItem(CustomHtmlComponents.data, 'name', data.section, null);

            if(section === null){
                section = {name: data.section, children: []};
                CustomHtmlComponents.data.push(section);
            }

            section.children.push({name: data.name, type: 'custom', tagName: '', htmlString: selectedElement.outerHTML, properties: []});

            that.sortCollection();
            that.saveAsCookie();
            console.log("saving")
            resolve();
        });

        return result;
    }

    static sortCollection(){
        CustomHtmlComponents.data.sort((a,b) =>{
            return a.name.toString().localeCompare(b.name.toString());
        })

        for(let item of CustomHtmlComponents.data){
            item.children.sort((a,b) =>{
                return a.name.toString().localeCompare(b.name.toString());
            })
        }
    }

    static saveAsCookie(){
        try{
            let str = JSON.stringify(CustomHtmlComponents.data)
            Cookies.set('appData', str, 43200);
        }
        catch(err){
            alert("Error on setting Cookie appData. See console for more information.");
            console.log(err);
        }
    }

    static onDelete(item, type){
        let that = this;
       
        let result = new Promise((resolve, reject) => {
            if(!window.confirm("Êtes-vous sur de vouloir supprimer l'item ?")){ 
                reject(); 
            }

            if(type === 's'){
                JsNx.removeItem(CustomHtmlComponents.data, 'name', item.name);
            }
            else{
                for(let section of CustomHtmlComponents.data){
                    JsNx.removeItem(section.children, 'name', item.name);
                }
            }
            
            that.saveAsCookie();
           // console.log("deleting")

            resolve();
        });

        return result;
    }

    static onImport(fileCtrl){
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
                    CustomHtmlComponents.data = CustomHtmlComponents.data.concat(newData);
                    that.sortCollection();
                    that.saveAsCookie();
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