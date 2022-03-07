import { UtilsMoodle } from "./Utils";

export class i18n {
    static get_string(str){
        return UtilsMoodle.get_string(str, 'atto_reciteditor');
    }
}