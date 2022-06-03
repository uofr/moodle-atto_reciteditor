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

export class Assets{
    static RecitLogo = './react/build/assets/images/recit.png';
    static ImageEmpty = 'https://raw.githubusercontent.com/SN-RECIT-formation-a-distance/moodle-atto_reciteditor/master/src/react/build/assets/images/header4.jpg';
    static ImageEmptyHD = Assets.ImageEmpty; //require('./assets/images/empty-hd.jpg');

    static CanvasCSS = './react/build/assets/css/canvas.css';
    static CanvasDesignerCSS = './react/build/assets/css/designer-canvas.css?v=5';
   // static ContentCSS = './react/build/assets/css/content.css'; it is already in Moodle theme
    //static ContentScript = './react/build/assets/js/script.js'; 

    static Bootstrap = './react/build/assets/bootstrap/css/bootstrap.min.css';
    static BootstrapJS = './react/build/assets/bootstrap/js/bootstrap.bundle.min.js';
    static JqueryJS = './react/build/assets/bootstrap/js/jquery.min.js';

    static ComponentUrl = './react/build/assets/components.json';

}