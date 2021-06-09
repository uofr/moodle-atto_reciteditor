//////////////////////////////////////////////////
// Note: the "export *" will only export the classes marqued with "export" in their definition
//////////////////////////////////////////////////

//export * from './WebApi';
export * from './Cookies';
//export * from './I18n';

export class JsNx{
    /**
     * Return the array item at the indicated index. If it not exists, then return the default value.
     * @param {number} index
     * @param {*} default value
     * @returns {*}
     */
    static at(arr, index, defaultValue){
        if(JsNx.exists(arr, index)){
            return arr[index];
        }
        else{
            return defaultValue;
        }
    };

    /**
     * Check if the index exists in the array.
     * @param {number} index
     * @returns {boolean}
     */
    static exists(arr, index){
        if(typeof arr[index] === "undefined"){
            return false;
        }
        else{
            return true;
        }
    };

    /**
     * Return the array item (an object) according to the property and value indicated. If it not exists, then return the default value.
     * @param {string} property
     * @param {*} property value
     * @param {*} default value
     * @returns {*}
     */
    static getItem(arr, prop, value, defaultValue){ 
        for(let item of arr){
            if(JsNx.get(item, prop, null) === value){return item; }
        }  

        return defaultValue;
    };

    /**
     * Remove an element from the array. If the element does not exists then do nothing.
     * @param {number} index
     * @returns {object}
     */
    static remove(arr, index){
        let result = [];
        
        if(JsNx.exists(arr, index)){
            result = arr.splice(index,1);
        }
        
        return (result.length > 0 ? result[0] : null);
    };

    /**
     * Remove an element from the array according to the property and value indicated.
     * @param {string} property
     * @param {*} property value
     * @returns {object}
     */
    static removeItem = function(arr, prop, value){
        let index = JsNx.getItemIndex(arr, prop, value, -1);
        return JsNx.remove(arr, index);
    };

    /**
     * Return the array item (an object) index according to the property and value indicated. 
     * @param {string} property
     * @param {*} property value
     * @returns {number}
     */
    static getItemIndex = function(arr, prop, value){
        for(let i = 0; i < arr.length; i++){
            let item = arr[i];
            
            if(JsNx.get(item, prop, null) === value){ return i }
        }
        return -1;
    };

    /**
    * Get the property value. If it not exists, then return the default value.
    * @param {string} prop
    * @param {*} defaultValue
    * @returns {*}
    */
    static get = function(obj, prop, defaultValue){  
        let props = prop.split('.');
        let result = (typeof defaultValue === "undefined" ? null : defaultValue);

        if(typeof obj[prop] === "function"){
            result = obj[prop]();
        }
        else if((props.length === 1) && (obj.hasOwnProperty(props[0]))){
            result = obj[props[0]];
        }
        else if((props.length === 2) && (obj[props[0]].hasOwnProperty(props[1]))){
            result = obj[props[0]][props[1]];
        }
    
        return result;
    };

    /*
    * @description Deep clone the object and return a new one
    * @returns {Object}
    */
    static clone = function(obj){
        if(obj instanceof Date){
            return new Date(obj.valueOf());
        }

        let result = Object.create(obj.__proto__);
        
        for(let prop in obj){
            if(Array.isArray(obj[prop])){
                switch(typeof JsNx.at(obj[prop], 0,null)){
                    case "object":
                        result[prop] = JsNx.copy(obj[prop], 2);
                        break;
                    default:
                        result[prop] = JsNx.copy(obj[prop]);
                }
            }
            else if((typeof obj[prop] === "object") && (obj[prop] !== null)){
                result[prop] = JsNx.clone(obj[prop]);
            }
            else{
                result[prop] = obj[prop];
            }
        }
        return result;   
    };

    static copy = function(arr, level){
        level = level || 0;
        
        switch(level){
            case 1:
                return JSON.parse(JSON.stringify(arr)); //  Array of literal-structures (array, object) ex: [[], {}];
            case 2:
                //return jQuery.extend(this); // Array of prototype-objects (function). The jQuery technique can be used to deep-copy all array-types. ex: [function () {}, function () {}];
                let result = [];
                for(let item of arr){
                    result.push((item !== null ? JsNx.clone(item) : null));
                }
                return result;
            default:
                return arr.slice(); // Array of literal-values (boolean, number, string) ex:  [true, 1, "true"]
        }
    };

    /**
     * During shallow equality check of objects you get the list of properties (using Object.keys()) of both objects, then check the properties’ values for equality.
     * @param {object} obj1 
     * @param {object} obj2 
     * @return {boolean} it returns true if the objects as equals
     */
    static compare = function(obj1, obj2){
        obj1 = obj1 || null;
        obj2 = obj2 || null;

        if((obj1 === null) && (obj2 === null)){
            return true;
        }
        else if((obj1 === null) || (obj2 === null)){
            return false;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        
        if (keys1.length !== keys2.length) {
            return false;
        }
        
        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
            return false;
            }
        }
        
        return true;
    }
}

export default class Utils{
    static version = 1.0;

    // this is necessary in order to handle with timezone
    static dateParse(strDate){
       // return Moment(strDate).toDate();
    }

    static formatMoney(value){
        return "$ " + parseFloat(value).toFixed(2);
    }

    static getUrlVars(){
        var vars, uri;

        vars = {};
    
        uri = decodeURI(window.location.href);
    
        uri.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        
        return vars;
    }

    static getColumnsInRow(row){
        var child = row.children;
        var cols = [];
        for (var col of child){
            for (var classn of col.classList){
                if (classn.includes('col-')){
                    cols.push(col);
                    break;
                }
            }
        }
        return cols;
    }

    static removeClassFromPartialClassName(el, partialName){
        for (var classn of el.classList){
            if (classn.includes(partialName)){
                el.classList.remove(classn);
            }
        }
    }

    static getAvailableFonts(){
        let { fonts } = document;
        const it = fonts.entries();

        let arr = [];
        let done = false;

        while (!done) {
            const font = it.next();
            if (!font.done) {
            arr.push(font.value[0].family);
            } else {
            done = font.done;
            }
        }

        // converted to set then arr to filter repetitive values
        let fontlist = [...new Set(arr)];
        let list = [];
        for (let f of fontlist){
            list.push({text:f, value:f})
        }
        return list;
    }

    static RGBToHex(rgb) {
        rgb = rgb || "rgb(0,0,0)";

        let regex = new RegExp(/^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/gm);

        // not an RGB
        if(!regex.test(rgb)){ 
            return rgb; 
        }

        // Choose correct separator
        let sep = rgb.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        rgb = rgb.substr(4).split(")")[0].split(sep);
      
        
        // Convert %s to 0–255
        for (let R in rgb) {
            let r = rgb[R];
            if (r.indexOf("%") > -1)
            rgb[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
            /* Example:
            75% -> 191
            75/100 = 0.75, * 255 = 191.25 -> 191
            */
        }

        let r = (+rgb[0]).toString(16),
            g = (+rgb[1]).toString(16),
            b = (+rgb[2]).toString(16);
      
        if (r.length === 1)
          r = "0" + r;
        if (g.length === 1)
          g = "0" + g;
        if (b.length === 1)
          b = "0" + b;
      
        /*
            Now we can supply values like either of these:
            rgb(255,25,2)
            rgb(255 25 2)
            rgb(50%,30%,10%)
            rgb(50% 30% 10%)
        */
        return "#" + r + g + b;
    }
    

    static resizeImageFromSize(imgBase64, maxWidth, maxHeight, fileType, callback){
        let img = new Image();

        img.src = imgBase64;
        img.onload = function() {
            let width = this.width;
            let height = this.height;
    
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } 
            else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
    
            let canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
    
            callback(canvas.toDataURL(fileType));
        };
    }
}

export class UtilsMoodle
{
    static rolesL1 = ['ad', 'mg', 'cc', 'et'];
    static rolesL2 = ['ad', 'mg', 'cc', 'et', 'tc'];
    static rolesL3 = ['sd', 'gu', 'fp'];

    static checkRoles(roles, r1){
        let r2 = roles;
        let a = new Set(r1);
        let b = new Set(r2);
        let intersection = new Set([...a].filter(x => b.has(x)));
        return intersection.size > 0;
    }

    static wwwRoot(){
 //       return M.cfg.wwwroot;
    };

    static getAttoInterface(){
        let result = {
            setContent: function(){console.log('Atto interface not defined.'); }, 
            getContent: function(){console.log('Atto interface not defined.'); return null;}, 
            getSettings: function(){console.log('Atto interface not defined.'); }
        };

        if(window.attoInterface){
            result.getContent = window.attoInterface.getContent || window.parent.attoInterface.getContent; // the editor content here is text and not html
            result.setContent = window.attoInterface.setContent || window.parent.attoInterface.setContent;
            result.getSettings = window.attoInterface.getSettings || window.parent.attoInterface.getSettings;
            return result;
        }
        else{
            if(process.env.NODE_ENV !== "development"){  
                alert('Atto interface not defined. Unable to transfer content.');
                window.close();
            }
            else{
                console.log('Atto interface not defined. Unable to transfer content.');
            }

            return result;
        }
    }
}

export class UtilsString
{
    static checkEmail(email) {
        email = email || "";

        if(email.length === 0){ return true;}

        //var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        let filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        let emails = email.split(",");
        for(let e of emails){
            if(!filter.test(e.trim())){
                return false;
            }
        }
    
        return true;
    }
}

export class UtilsDateTime
{
    static nbMinSinceSundayToDate(nbMinSinceSunday){
        nbMinSinceSunday = parseInt(nbMinSinceSunday,10);
        if(nbMinSinceSunday === 0){
            return null;
        }
        let hour = Math.trunc((nbMinSinceSunday % 1440) / 60);
        let minutes = nbMinSinceSunday % 60;
        return new Date(0,0,0, hour, minutes, 0);
    }
    
    static dateToNbMinSinceSunday(weekDay, date){
        if(date instanceof Date){
            return (date.getHours() * 60) + date.getMinutes() + (weekDay * 1440); // 1440 = minutes in a day
        }
        else{
            return 0;
        }
    }
    
    /**
    * Transform the shift minutes to the time string
    * @param {type} time 
    * @param {type} separator
    * @returns {ScheduleShift.minutesToTime.result}
    */
    static minutesToTime(time, separator) {
        separator = separator || ":";

        let hour, min, result, offsetDays;

        if((time >= 0) && (time <= 23)){
            hour = time;
            min = 0;
        }
        else{
            hour = Math.trunc(time / 60); // extract the hour
            offsetDays = Math.trunc(hour / 24);
            min = time - (hour * 60); // extract the minutes
            hour -= (offsetDays * 24);
        }

        result = hour.toString().nxLpad("0", 2) + separator + min.toString().nxLpad("0", 2);
        return result;
    };
    
    /**
     * Transform the time in string to minutes
     * @param {string} - hh:mm
     * @return {number} - The number of minutes 
     */
    static timeToMin = function (time) { 
        var hour, minutes;

        if (time.length !== 5) {
            return 0;
        }

        hour = parseInt(time.substring(0, 2),10);
        minutes = parseInt(time.substring(3, 5),10);

        return (hour * 60) + minutes;
    };
};

export class UtilsTreeStruct
{
    /**
     * Apply a user supplied function to every node of the tree and return its result
     * @param {Array} - tree
     * @param {string} - proNodes The property name of the children nodes 
     * @param {function} - callback The callback function
     * @returns void
     */
    static treeWalk(tree, propNodes, callback){
        let i, node;
        
        for(i = 0; i < tree.length; i++){
            node = tree[i];
            if((node.hasOwnProperty(propNodes)) && (node[propNodes].length > 0)){
                callback(node);
                UtilsTreeStruct.treeWalk(node[propNodes], propNodes, callback);
            }
            else{
                callback(node);        
            }
        }
    }
    
    /**
     * Get the parent node 
     * @param {Array} - tree
     * @param {string} - proNodes - The property name of the children nodes 
     * @param {function} - callback - The callback function. It needs to return true or false
     * @param * - default value
     * @returns * - the parent node or the default value
     */
    static getParentNode(rootNode, propNodes, callback, defaultValue){
        let i, node;
        let result = defaultValue;

        // there is no parent node
        if(callback(rootNode)){ return result;} 

        let nodes = rootNode.nxGet(propNodes);

        for(i = 0; i < nodes.length; i++){
            node = nodes[i];

            if(node.nxGet(propNodes).length > 0){                
                if(callback(node)){return rootNode; }

                result = UtilsTreeStruct.getParentNode(node, propNodes, callback, defaultValue);
            }
            else if(callback(node)){return rootNode; }           
        }

        return result;
    }
    
    /**
     * Get a node from the tree
     * @param {Array} - tree
     * @param {string} - proNodes - The property name of the children nodes 
     * @param {function} - callback - The callback function. It needs to return true or false
     * @param * - default value
     * @returns * - the node or the default value
     */
    static getNode(tree, propNodes, callback, defaultValue){
        let i, node, result;
        
        for(i = 0; i < tree.length; i++){
            node = tree[i];
            
            if(callback(node)){
                return node;
            }
            
            if((node.hasOwnProperty(propNodes)) && (node[propNodes].length > 0)){
                result = UtilsTreeStruct.getNode(node[propNodes], propNodes, callback, defaultValue);
                if(result !== null){
                    return result;
                }
            }
            else if((typeof node[propNodes] === "function") && (node[propNodes]().length > 0)){
                result = UtilsTreeStruct.getNode(node[propNodes], propNodes, callback, defaultValue);
                if(result !== null){
                    return result;
                }
            }
        }
        return defaultValue;
    }
    
     /**
     * Remove a node from the tree
     * @param {Array} - tree
     * @param {string} - proNodes - The property name of the children nodes 
     * @param {function} - callback - The callback function. It needs to return true or false
     * @returns {boolean} - True if the node was found. False otherwise.
     */
    static removeNode(tree, propNodes, callback){
        let i, node;
        
        for(i = 0; i < tree.length; i++){
            node = tree[i];
            
            if(callback(node)){
                tree.splice(i, 1);
                return true;
            }
            
            if((node.hasOwnProperty(propNodes)) && (node[propNodes].length > 0)){
                if(UtilsTreeStruct.removeNode(node[propNodes], propNodes, callback)){
                    return true;
                }
            }
            else if((typeof node[propNodes] === "function") && (node[propNodes]().length > 0)){
                if(UtilsTreeStruct.removeNode(node[propNodes](), propNodes, callback)){
                    return true;
                }
            }
        }
        return false;
    }
    /*static removeNode(tree, propNodes, callback){
        let i, node;
        
        for(i = 0; i < tree.length; i++){
            node = tree[i];
            
            if((node.hasOwnProperty(propNodes)) && (node[propNodes].length > 0)){
                if(callback(node)){
                    tree.splice(i, 1);
                    return true;
                }
                
                return UtilsTreeStruct.removeNode(node[propNodes], propNodes, callback);
            }
            else{
                if(callback(node)){
                    tree.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }*/
}

export class UtilsHTML{

    static assignTagId(node){
        let convertToString = false;

        if(typeof node === 'string'){
            node = new DOMParser().parseFromString(node, "text/html");
            node = node.body;
            convertToString = true;
        }

        let id = 1;
        let funcRec = function (node) {
            node.setAttribute("data-tag-id", id++);

            for(let child of node.children){
                if(child.children.length > 0){
                    funcRec(child);
                }
                else{
                    child.setAttribute("data-tag-id", id++);
                }
            }
        }

        funcRec(node);

        if(convertToString){
            node = node.innerHTML;
        }

        return node;
    }

    static removeTagId(node){
        let convertToString = false;

        if(typeof node === 'string'){
            node = new DOMParser().parseFromString(node, "text/html");
            node = node.body;
            convertToString = true;
        }

        let items = node.querySelectorAll("[data-tag-id]");

        items.forEach(function(item) {
            item.removeAttribute("data-tag-id");
        });

        if(convertToString){
            node = node.innerHTML;
        }

        return node;
    }

    static getCurrentSelection(dom, refreshSelectioCallback, windowObj){
        let result = null;
        
        windowObj = windowObj || window;
        
        let sel = windowObj.getSelection ? windowObj.getSelection() : document.selection;              

        if(sel !== null){
            result = {};
            result.sel = sel;
            result.isSelection = (sel.rangeCount > 0) && (sel.toString().length > 0);
        
            result.selectionDirection = '';
            if(result.sel.anchorOffset > result.sel.focusOffset){
                result.selectionDirection = 'ltr';
            }
            else if(result.sel.anchorOffset < result.sel.focusOffset){
                result.selectionDirection = 'rtl';
            }
             
            let mainNode = result.sel.baseNode || result.sel.anchorNode; // Chromme || Firefox
            if (!mainNode) return null;
            result.node = (mainNode instanceof Element ? mainNode :  mainNode.parentElement);
            result.subSelection = (result.sel.anchorOffset > 0 && result.sel.focusOffset > 0);

            if (!result.isSelection){//If it's not a selection, set the range to be the whole node
                let range = document.createRange();
                let text = result.node;
                if (text){
                    range.selectNodeContents(text);
                    result.range = range;
                }
            }else{
                result.range = result.sel.getRangeAt(0);
            }
    
            result.isNodeRoot = (result.node === dom);
            result.parentNode = (result.node === dom ? result.node : result.node.parentElement);
            result.isParentNodeRoot = (result.node === dom);
            result.editorRef = dom;
            result.selectedText = result.sel.toString();
            result.selectedContent = result.range.cloneContents();

            if (result.selectedContent.children[0]){ // Est-ce que la selection contient des tag html?
                if (result.selectedContent.children[0].innerText == result.selectedText){
                    result.node = result.selectedContent.children[0];
                    result.isNodeRoot = false;
                    result.subSelection = false;
                }
            }
            result.refreshSelection = refreshSelectioCallback;
        }

        return result;
    }
}