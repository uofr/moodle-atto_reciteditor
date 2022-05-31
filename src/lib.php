<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto HTML editor
 *
 * @package    atto_reciteditor
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();
require_once $CFG->libdir . '/adminlib.php';

function atto_reciteditor_before_standard_top_of_body_html() {
    global $PAGE, $CFG;

    $PAGE->requires->js('/lib/editor/atto/plugins/reciteditor/content.js');
   
    $settings = array(
        'currentthemesubrev' => theme_get_sub_revision_for_theme($CFG->theme),
        'showcase_url' => get_config('atto_reciteditor', 'enableshowcase') == 1 ? get_config('atto_reciteditor', 'showcase_url') : '',
        'stylesheet_to_add' => get_config('atto_reciteditor', 'stylesheet_to_add'),
        'iconclass' => get_config('atto_reciteditor', 'iconclass'),
    );

    $PAGE->requires->js_init_call('M.recit.reciteditor.init_settings', array($settings));
}
/**
 * Initialise the js strings required for this module.
 */
function atto_reciteditor_strings_for_js() {
    global $PAGE; 

    $PAGE->requires->strings_for_js(array('pluginname',
                                          'htmleditor',
                                          'inputurl',
                                          'createlink',
                                          'texttoshow',
                                          'openinnewwindow',
                                          'recitthemeonly',
                                          'selecticon',
                                          'deleteformat',
                                          'margin',
                                          'border',
                                          'padding',
                                          'min',
                                          'value',
                                          'max',
                                          'column',
                                          'line',
                                          'returntohtmleditor',
                                          'bold',
                                          'italic',
                                          'underline',
                                          'strikethrough',
                                          'removeformat',
                                          'bgcolor',
                                          'removebgcolor',
                                          'fontcolor',
                                          'removefontcolor',
                                          'list',
                                          'numberedlist',
                                          'alignleft',
                                          'aligncenter',
                                          'alignright',
                                          'justify',
                                          'outdent',
                                          'indent',
                                          'link',
                                          'removelink',
                                          'undo',
                                          'redo',
                                          'highlighttool',
                                          'math',
                                          'addimage',
                                          'screenshot',
                                          'failedtodrop',
                                          'drag',
                                          'edit',
                                          'createcomponent',
                                          'moveelementup',
                                          'moveelementdown',
                                          'clone',
                                          'delete',
                                          'addcomponent',
                                          'addcomponentdesc',
                                          'bootstrap',
                                          'htmlproprieties',
                                          'style',
                                          'templates',
                                          'components',
                                          'html',
                                          'mycomponents',
                                          'basecomponents',
                                          'showroom',
                                          'createtemplate',
                                          'import',
                                          'savetemplate',
                                          'options',
                                          'exportcollection',
                                          'export',
                                          'cancel',
                                          'save',
                                          'deleteconfirmmsg',
                                          'errorseeconsole',
                                          'texteditor',
                                          'canvas',
                                          'preview',
                                          'sourcecode',
                                          'proprieties',
                                          'tree',
                                          'insidebegining',
                                          'insideend',
                                          'inside',
                                          'before',
                                          'after',
                                          'paragraph',
                                          'button',
                                          'collapsebutton',
                                          'videobutton',
                                          'audio',
                                          'video',
                                          'embed',
                                          'grid',
                                          'row',
                                          'column',
                                          'table',
                                          'tablecell',
                                          'tabletitle',
                                          'tablerow',
                                          'listitem',
                                          'alert',
                                          'card',
                                          'cardbody',
                                          'cardheader',
                                          'cardfooter',
                                          'flipcard',
                                          'front',
                                          'rear',
                                          'media',
                                          'mediabody',
                                          'carousel',
                                          'carouselnav',
                                          'tab',
                                          'accordion',
                                          'accordionitem',
                                          'tabcontent',
                                          'split',
                                          'image',
                                          'imagewithcaption',
                                          'clickableimage',
                                          'getstarted',
                                          'icon',
                                          'width',
                                          'height',
                                          'align',
                                          'layout',
                                          'font',
                                          'default',
                                          'fontsize',
                                          'color',
                                          'invalidcomponent',
                                          'nativecomponents',
                                          'text',
                                          'control',
                                          'container',
                                          'actions',
                                          'background',
                                            'backgroundcolor',
                                            'backgroundimage',
                                            'iconsize',
                                            'linkoptions',
                                            'href',
                                            'linkaction',
                                            'samepage',
                                            'newtab',
                                            'source',
                                            'videourl',
                                            'properties',
                                            'htmlcode',
                                            'taboptions',
                                            'pill',
                                            'left',
                                            'center',
                                            'right',
                                            'fullwidth',
                                            'horizontal',
                                            'addtab',
                                            'accordionoptions',
                                            'add',
                                            'layoutspacing',
                                            'spacing',
                                            'borderstyle',
                                            'spacing',
                                            'bordercolor',
                                            'borderradius',
                                            'basic',
                                            'classlist',
                                            'backgroundcolor',
                                            'shadow',
                                            'none',
                                            'alignment',
                                            'responsivesize',
                                            'buttonfullwidth',
                                            'outline',
                                            'size',
                                            'big',
                                            'small',
                                            'htmlattributes',
                                            'id',
                                            'no',
                                            'yes',
                                            'striped',
                                            'sourcecodedesigner',
                                        ),
                                    'atto_reciteditor');
}

class admin_setting_configtext_iconclass extends admin_setting_configtext {
    public function validate($data) {
        if (strlen($data) == 0) return true;
        $data = explode(',', $data);
        foreach($data as $d){
            $c = explode('=', $d);
            if (!isset($c[1])) return false;
        }
        return true;
    }
}