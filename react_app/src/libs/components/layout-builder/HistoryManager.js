export class HistoryManager {
    static MAX_HISTORY = 50;
    constructor(){
        this.history = {undo: [], redo: []};
        this.onContentChange = this.onContentChange.bind(this);
        this.onRedo = this.onRedo.bind(this);
        this.onUndo = this.onUndo.bind(this);
        this.addHistoryItem = this.addHistoryItem.bind(this);
    }

    onContentChange(oldContent){
        this.addHistoryItem(oldContent);
    }    

    onUndo(callback, currentHTML){
        let content = this.history.undo.pop();

        if (content == currentHTML && this.history.undo.length > 1){
            content = this.history.undo.pop();
        }
        
        if(content){
            this.history.redo.push(currentHTML);

            if(this.history.redo.length > HistoryManager.MAX_HISTORY){
                this.history.redo.unshift();
            }
            
            callback(content)
        }else{
            console.log('Undo history is empty');
        }
    }

    addHistoryItem(content){
        if(this.history.undo.length > HistoryManager.MAX_HISTORY){
            this.history.undo.unshift();
        }
        if(this.history.undo[this.history.undo.length - 1] !== content){
            this.history.undo.push(content);
        }
    }

    onRedo(callback, currentHTML){
        let content = this.history.redo.pop();
        
        if(content){
            this.addHistoryItem(currentHTML);
            
            callback(content);
        }
    }
}