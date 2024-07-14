import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'
import styles from './styles.module.scss'
import ReactCodeMirror from '@uiw/react-codemirror'
import { langs } from '@uiw/codemirror-extensions-langs'

type EditorProps = {
  language: 'javascript' | 'css' | 'xml'
  displayName: string
  value: string
  onChange: (value: string) => void
} & HTMLAttributes<HTMLDivElement>

export const CodeEditor = forwardRef<HTMLDivElement, EditorProps>(({ language, displayName, value, onChange }, ref) => {
  function handleChange(value: string) {
    onChange(value)
  }

  return (
    <div className={clsx(styles['editor-container'])} ref={ref}>
      <div className={styles['editor-title']}>
        <span>{displayName}</span>
      </div>
      <ReactCodeMirror
        onChange={handleChange}
        value={value}
        className={styles['code-mirror-wrapper']}
        basicSetup={{
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: false,
          autocompletion: true,
          closeBrackets: true,
          history: true,
          lineNumbers: true
        }}
        theme={'dark'}
        extensions={[langs[language]()]}
      />
    </div>
  )
})
