//////////////////////////////////////////////////
// Note: the "export *" will only export the classes marked with "export" in their definition
//////////////////////////////////////////////////

import "./css/components.scss";

export * from './ToggleButtons';
export * from './InputNumber';
export * from './InputText';
export * from './ComboBox';
export * from './RecitRichEditor';

export default class Components{
    static version = 1.0;

    static assets = {
        
    };
} 