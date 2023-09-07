import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

const sproutTheme = createTheme({
    theme: 'light',
    settings: {
        background: '#F5F5F5',
        foreground: '#333333',
        selection: '#E4F6D4',
        selectionMatch: '#E4F6D4',
        lineHighlight:'#CCD7DA50',
        caret: '#D5D5D550',
    },
    styles: [
      { tag: t.comment, color: '#AAAAAA' },
      {
        tag: [t.name, t.deleted, t.character, t.macroName],
        color: '#7A3E9D',
      },
      {
        tag: [t.annotation],
        color: '#ff5f52',
      },
      {
        tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
        color: '#ffad42',
      },
      { tag: t.variableName, color: '#5c6166' },
      { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
    //   { tag: t.number, color: '#5c6166' },
      { tag: t.bool, color: '#5c6166' },
      { tag: t.null, color: '#5c6166' },
      { tag: t.keyword, color: '#4B69C6' },
      { tag: t.operator, color: '#4B69C6' },
      { tag: t.className, color: '#4B69C6' },
      { tag: t.definition(t.typeName), color: '#5c6166' },
      { tag: t.typeName, color: '#7A3E9D' },
      { tag: t.angleBracket, color: '#5c6166' },
      { tag: t.tagName, color: '#5c6166' },
      { tag: t.attributeName, color: '#7A3E9D' },
    ],
  });

  export default sproutTheme;