import { useEffect, useState } from 'react';
import { EditorState, StateEffect, Extension, EditorStateConfig } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { ExtensionsOptions, getDefaultExtensions } from './extensions';

export interface UseCodeMirrorConfig extends Omit<EditorStateConfig, 'doc'>, ExtensionsOptions {
  value?: string;
  extensions?: Extension[];
  autoFocus?: boolean;
  root?: ShadowRoot | Document;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
  onUpdate?: (update: ViewUpdate) => void;
  onFocus?: (update: ViewUpdate) => void;
  onBlur?: (update: ViewUpdate) => void;
  onCreated?: (view: EditorView, state: EditorState) => void;
  onDestroyed?: () => void;
}

export default function useCodeMirror(config: UseCodeMirrorConfig, container?: HTMLDivElement | null) {
  const {
    value,
    autoFocus,
    selection,
    extensions = [],
    editorStyle,
    placeholder,
    basicSetup,
    indentWithTab,
    tabSize,
    editable,
    readOnly,
    onChange,
    onUpdate,
    onFocus,
    onBlur,
    onCreated,
    onDestroyed,
    root,
  } = config;
  const [view, setView] = useState<EditorView>();
  const [state, setState] = useState<EditorState>();

  const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
    if (vu.docChanged) {
      const doc = vu.state.doc;
      const value = doc.toString();
      onChange?.(value, vu);
    }
    if (vu.focusChanged) {
      vu.view.hasFocus ? onFocus?.(vu) : onBlur?.(vu);
    }
    onUpdate?.(vu);
  });

  const defaultExtensions = getDefaultExtensions({
    basicSetup,
    indentWithTab,
    tabSize,
    editorStyle,
    placeholder,
    editable,
    readOnly,
  });

  const mergedExtensions = [updateListener, ...defaultExtensions, ...extensions];

  useEffect(() => {
    if (container && !state && !view) {
      const currentState = EditorState.create({
        doc: value,
        selection,
        extensions: mergedExtensions,
      });
      setState(currentState);
      const currentView = new EditorView({
        state: currentState,
        parent: container,
        root,
      });
      setView(currentView);
      onCreated?.(currentView, currentState);
    }
    return () => {
      if (view) {
        view.destroy();
        setState(undefined);
        setView(undefined);
        onDestroyed?.();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);

  useEffect(() => {
    if (autoFocus && view) {
      view.focus();
    }
  }, [autoFocus, view]);

  useEffect(() => {
    if (view) {
      view.dispatch({ effects: StateEffect.reconfigure.of(mergedExtensions) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selection,
    extensions,
    editorStyle,
    indentWithTab,
    placeholder,
    editable,
    readOnly,
    onChange,
    onUpdate,
    onFocus,
    onBlur,
  ]);

  useEffect(() => {
    if (!view || !value) {
      return;
    }
    const currentValue = view.state.doc.toString();
    if (value !== currentValue) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length || 0,
          insert: value || '',
        },
      });
    }
  }, [value, view]);

  return { state, view };
}
