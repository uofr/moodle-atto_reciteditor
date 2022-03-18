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

//////////////////////////////////////////////////
// Note: the "export *" will only export the classes marked with "export" in their definition
//////////////////////////////////////////////////

import "./assets/css/components.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

export * from './ToggleButtons';
export * from './InputNumber';
export * from './InputText';
export * from './InputTextArea';
export * from './ComboBox';
export * from './InputColor';
export * from './ImageSrc';
export * from './MultipleSelect';
export * from './MinValueMax';
export * from './TableActions'
export * from './LayoutSpacingEditor';
export * from './LayoutSpacing';
export * from './RecitRichEditor';
export * from './ColorSelector';
export * from './SourceCodeEditor';
export * from './IconSelector';
export * from './BtnUpload';

export default class Components{
    static version = 1.0;
} 

export class Assets{
    static RecitLogo = require('./assets/images/recit.png');
    static ImageEmpty = 'https://recitfad.ca/widgets/assets/images/header4.jpg'; //require('./assets/images/empty.jpg');
    static ImageEmptyHD = Assets.ImageEmpty; //require('./assets/images/empty-hd.jpg');

    static CanvasCSS = './assets/css/canvas.css';
    static CanvasDesignerCSS = './assets/css/designer-canvas.css?v=5';
   // static ContentCSS = './assets/css/content.css'; it is already in Moodle theme
    //static ContentScript = './assets/js/script.js'; 

    static Bootstrap = './assets/bootstrap/css/bootstrap.min.css';
    static BootstrapJS = './assets/bootstrap/js/bootstrap.bundle.min.js';
    static JqueryJS = './assets/bootstrap/js/jquery.min.js';

    static ComponentUrl = './assets/components.json';

    static UrlVitrine = 'https://recitfad.ca/moodledocs/vitrine_editeur_v2/index.php';
}
