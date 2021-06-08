import packageJson from "../package.json";

export class Options
{
    static appName(){ return packageJson.description; }
    
    static appVersion(){ return packageJson.version; }

    static homepage(){ 
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            return "http://localhost:3000";
        } 
        else {
            return packageJson.homepage;
        }
    }
    
    static appTitle(){
        return this.appName() + " | " + this.appVersion();
    }

    static versionHistory = [
        {version: "0.0.1", description: "", timestamp: '2019-10-17'}
    ]

    static getAttoInterface(){
        let result = {setContent: null, getContent: null};

        if(window.attoInterface){
            result.getContent = window.attoInterface.getContent || window.parent.attoInterface.getContent; // the editor content here is text and not html
            result.setContent = window.attoInterface.setContent || window.parent.attoInterface.setContent;
        }
        else{
            alert('Atto interface not defined. Unable to transfer content.');
            window.close();
        }

        return result;
    }
}