import packageJson from "../package.json";

export class Options
{
    /*static companyName = "Prologic+";
    static companyPhone = "+1 (418) 227-4303";
    static companyEmail = "service@prologicplus.com";*/
    //static brandImage = require('./assets/logo.png');
    //static companyLogoEmail = require('../assets/prologic-email.jpg');
  /*  static companyColor1 = "#000";
    static companyColor2 = "#F00";
    static companySasEmail = "sasadmin@prologicplus.com";
    static mailerFromEmail = "no-reply@prologicplus.com";
    static mailerFromName = Options.companyName + " " + $i18n.tags.sas;*/
    
        
    static appName(){ return packageJson.description; }//$i18n.tags.sas }
    
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