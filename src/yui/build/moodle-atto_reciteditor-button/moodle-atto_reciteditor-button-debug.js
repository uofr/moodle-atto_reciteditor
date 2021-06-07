YUI.add('moodle-atto_reciteditor-button', function (Y, NAME) {

/**
     * @module moodle-atto_reciteditor-button
     */
    
    /**
     * Atto text editor vvvebjs plugin.
     *
     * @namespace M.atto_reciteditor
     * @class button
     * @extends M.editor_atto.EditorPlugin
     */

Y.namespace('M.atto_reciteditor').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * Add the buttons to the toolbar
     *
     * @method initializer
     */
    initializer: function() {
        this.addButton({
            title: 'htmleditor',
            icon: 'html',
            iconComponent: 'atto_reciteditor',
            callback: this.openHtmlEditor,
            buttonName: 'htmleditor'
        });
    },

    openHtmlEditor: function(e) {
        e.preventDefault();
        var that = this;
       
        var url = M.cfg.wwwroot;
        url += "/lib/editor/atto/plugins/reciteditor/build/index.php";
        url += "?contextid="+M.cfg.contextid;
        url += "&theme="+M.cfg.theme;
        url += "&themerev="+M.cfg.themerev;
        
        var host = this.get('host');
        var options = host.get('filepickeroptions').image || {};
        
        M.recit.attoFileTransfer = {};
        M.recit.attoFileTransfer.repo_id = 0 || 0;
        M.recit.attoFileTransfer.client_id = options.client_id || 0;
        M.recit.attoFileTransfer.env = options.env || '';
        M.recit.attoFileTransfer.license = options.defaultlicense || '';
        M.recit.attoFileTransfer.itemid = options.itemid || 0;
        M.recit.attoFileTransfer.author = options.author || '';

        var attr = '';
        for(attr in options.repositories){
            if (options.repositories[attr].type === 'upload') {
                M.recit.attoFileTransfer.repo_id = options.repositories[attr].id;
                break;
            }
        }

        for(attr in options.licenses){
            if (options.licenses[attr].shortname === 'cc') { // creative commons
                M.recit.attoFileTransfer.license = options.licenses[attr].shortname;
                break;
            }
        }

        var popup = window.open(url,'Éditeur RÉCIT','scrollbars=1');

        if (popup.outerWidth < screen.availWidth || popup.outerHeight < screen.availHeight)
        {
          popup.moveTo(0,0);
          popup.resizeTo(screen.availWidth, screen.availHeight);
        }

        popup.getEditorContent = function(){
            return that.editor.getHTML();
        };

        popup.onSave = function(frameDocument){
            var html = frameDocument.body.outerHTML;
            that.editor.setHTML(html);
            popup.close();
        };
    },
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
