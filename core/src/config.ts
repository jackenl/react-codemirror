import { CodeMirrorConfig } from './useCodeMirror';

export const DEFAULT_CONFIG: Readonly<CodeMirrorConfig> = {
  autoFocus: false,
  basicSetup: true,
  indentWithTab: true,
  tabSize: 2,
  placeholder: '',
  editable: true,
  readOnly: false,
  extensions: [],
};
