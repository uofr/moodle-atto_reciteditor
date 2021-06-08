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
}