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
export * from './MultipleSelect';
export * from './MinValueMax';
export * from './TableActions'
export * from './LayoutSpacingEditor';
export * from './LayoutSpacing';
export * from './RecitRichEditor';
export * from './ColorSelector';
export * from './SourceCodeEditor';

export default class Components{
    static version = 1.0;

    static assets = {
        
    };
} 