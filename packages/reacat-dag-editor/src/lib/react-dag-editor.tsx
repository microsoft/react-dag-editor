import styles from './react-dag-editor.module.scss';

/* eslint-disable-next-line */
export interface ReactDagEditorProps {}

export function ReactDagEditor(props: ReactDagEditorProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ReactDagEditor!</h1>
    </div>
  );
}

export default ReactDagEditor;
