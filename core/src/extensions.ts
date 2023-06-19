import { EditorState, Extension } from '@codemirror/state';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { indentUnit } from '@codemirror/language'
import { basicSetup } from 'codemirror';

export interface ExtensionsOptions {
  basicSetup?: boolean;
  indentWithTab?: boolean;
  editable?: boolean;
  placeholder?: string | HTMLElement;
  tabSize?: number;
  readOnly?: boolean;
  editorStyle?: Record<string, string>;
}

export const getDefaultExtensions = (options: ExtensionsOptions) => {
  const {
    basicSetup: setBasicSetup,
    indentWithTab: setIndentWithTab,
    tabSize,
    placeholder: placeholderStr,
    editable,
    readOnly,
    editorStyle,
  } = options;
  const extensions: Extension[] = [];
  if (setBasicSetup) {
    extensions.push(basicSetup);
  }
  if (setIndentWithTab) {
    extensions.push(keymap.of([indentWithTab]));
  }
  if (tabSize) {
    extensions.push([EditorState.tabSize.of(tabSize), indentUnit.of(' '.repeat(tabSize))]);
  }
  if (placeholderStr) {
    extensions.push(placeholder(placeholderStr));
  }
  if (editable === false) {
    extensions.push(EditorView.editable.of(false));
  }
  if (readOnly) {
    extensions.push(EditorState.readOnly.of(true));
  }
  if (editorStyle) {
    extensions.push(
      EditorView.theme({
        '&': {
          ...editorStyle,
        },
      })
    );
  }
  return [...extensions];
};
