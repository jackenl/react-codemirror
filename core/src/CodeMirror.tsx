import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import useCodeMirror, { UseCodeMirrorConfig } from './useCodeMirror';
import { DEFAULT_CONFIG } from './config';

export interface CodeMirrorRef {
  container?: HTMLDivElement | null;
  state?: EditorState;
  view?: EditorView;
}

export interface ReactCodeMirrorProps extends UseCodeMirrorConfig {
  className?: string;
}

const ReactCodeMirror = forwardRef<CodeMirrorRef, ReactCodeMirrorProps>((props, ref) => {
  const { className } = props;
  const [container, setContainer] = useState<HTMLDivElement>();
  const editorRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  const config = useMemo(() => {
    const defaultConfig = { ...DEFAULT_CONFIG };
    let mergedConfig = {} as Required<UseCodeMirrorConfig>;
    mergedConfig = Object.assign(mergedConfig, defaultConfig);
    Object.keys(props).forEach((key) => {
      if (key !== 'className') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mergedConfig[key] = props[key] ?? mergedConfig[key];
      }
    });
    return mergedConfig;
  }, [props]);

  const { state, view } = useCodeMirror(config, container);

  useImperativeHandle(
    ref,
    () => ({
      container: container,
      state: state,
      view: view,
    }),
    [container, state, view]
  );

  return <div className={className} ref={editorRef}></div>;
});

ReactCodeMirror.displayName = 'ReactCodeMirror';

export default ReactCodeMirror;
