//////////////////////////////////////////////////
// Note: the "export *" will only export the classes marked with "export" in their definition
//////////////////////////////////////////////////

import "./assets/css/components.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

export * from './ToggleButtons';
export * from './InputNumber';
export * from './InputText';
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
    static ImageEmptyHD = require('./assets/images/empty-hd.jpg');

    static CanvasContentCSS = './assets/css/canvas-content.css';
   // static ContentCSS = './assets/css/content.css'; it is already in Moodle theme
    //static ContentScript = './assets/js/script.js'; 

    static Bootstrap = './assets/bootstrap/css/bootstrap.min.css';

    static UrlVitrine = 'https://recitfad.ca/moodledocs/vitrine_editeur_v2/index.php';
}
