import type {EditorThemeClasses} from 'lexical';

import './codeEditorTheme.css';

const theme: EditorThemeClasses = {
  code: 'CodeEditorTheme__code',
  codeHighlight: {
    atrule: 'CodeEditorTheme__tokenAttr',
    attr: 'CodeEditorTheme__tokenAttr',
    boolean: 'CodeEditorTheme__tokenProperty',
    builtin: 'CodeEditorTheme__tokenSelector',
    cdata: 'CodeEditorTheme__tokenComment',
    char: 'CodeEditorTheme__tokenSelector',
    class: 'CodeEditorTheme__tokenFunction',
    'class-name': 'CodeEditorTheme__tokenFunction',
    comment: 'CodeEditorTheme__tokenComment',
    constant: 'CodeEditorTheme__tokenProperty',
    deleted: 'CodeEditorTheme__tokenProperty',
    doctype: 'CodeEditorTheme__tokenComment',
    entity: 'CodeEditorTheme__tokenOperator',
    function: 'CodeEditorTheme__tokenFunction',
    important: 'CodeEditorTheme__tokenVariable',
    inserted: 'CodeEditorTheme__tokenSelector',
    keyword: 'CodeEditorTheme__tokenAttr',
    namespace: 'CodeEditorTheme__tokenVariable',
    number: 'CodeEditorTheme__tokenProperty',
    operator: 'CodeEditorTheme__tokenOperator',
    prolog: 'CodeEditorTheme__tokenComment',
    property: 'CodeEditorTheme__tokenProperty',
    punctuation: 'CodeEditorTheme__tokenPunctuation',
    regex: 'CodeEditorTheme__tokenVariable',
    selector: 'CodeEditorTheme__tokenSelector',
    string: 'CodeEditorTheme__tokenSelector',
    symbol: 'CodeEditorTheme__tokenProperty',
    tag: 'CodeEditorTheme__tokenProperty',
    url: 'CodeEditorTheme__tokenOperator',
    variable: 'CodeEditorTheme__tokenVariable',
  },
};

export default theme;