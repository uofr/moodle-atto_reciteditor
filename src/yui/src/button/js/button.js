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
        
        var popup = window.open(url,'Éditeur RÉCIT','scrollbars=1');

        if (popup.outerWidth < screen.availWidth || popup.outerHeight < screen.availHeight)
        {
          popup.moveTo(0,0);
          popup.resizeTo(screen.availWidth, screen.availHeight);
        }

        popup.attoInterface = {};

        popup.attoInterface.getSettings = function(){
            var result = {};
            result.contextid = M.cfg.contextid;
            result.wwwroot = M.cfg.wwwroot;
            result.theme = M.cfg.theme;
            result.themerev = M.cfg.themerev;
            result.sesskey = M.cfg.sesskey;
            return result;
        }

        var cssRulesBuffer = [];
        popup.attoInterface.getThemeCssRules = function(){
            var styleSheets = window.document.styleSheets;

            if(cssRulesBuffer.length > 0){ return cssRulesBuffer;}

            cssRulesBuffer = [];
            var themeUrl = popup.attoInterface.getThemeUrl();
            for(var sheet of styleSheets){
                // the only css rules we are looking for is the current theme or some custom css from theme-recit
                if((sheet.href !== themeUrl) && (sheet.title !== 'theme-recit-custom-css')){
                    continue;
                }

                for(var rule of sheet.rules){
                    cssRulesBuffer.push(rule);
                }
            }

            return cssRulesBuffer;
        }

        popup.attoInterface.getThemeUrl = function(){
            return `${M.cfg.wwwroot}/theme/styles.php/${M.cfg.theme}/${M.cfg.themerev}_${M.recit.reciteditor.settings.currentthemesubrev}/all`;
        }

        popup.attoInterface.getFileTransferData = function(){
            var host = that.get('host');
            var options = host.get('filepickeroptions').image || {};
            
            var result = {};
            result.repo_id = 0 || 0;
            result.client_id = options.client_id || 0;
            result.env = options.env || '';
            result.license = options.defaultlicense || '';
            result.itemid = options.itemid || 0;
            result.author = options.author || '';

            var attr = '';
            for(attr in options.repositories){
                if (options.repositories[attr].type === 'upload') {
                    result.repo_id = options.repositories[attr].id;
                    break;
                }
            }

            for(attr in options.licenses){
                if (options.licenses[attr].shortname === 'cc') { // creative commons
                    result.license = options.licenses[attr].shortname;
                    break;
                }
            }

            return result;
        };

        popup.attoInterface.getContent = function(){
            return that.editor.getHTML();
        };

        popup.attoInterface.setContent = function(htmlStr){
            that.editor.setHTML(htmlStr);
            popup.close();
        };
    },
});
