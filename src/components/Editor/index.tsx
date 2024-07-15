import { langs } from '@uiw/codemirror-extensions-langs'
import ReactCodeMirror from '@uiw/react-codemirror'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

import styles from './styles.module.scss'

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
    <div ref={ref} className={clsx(styles['editor-container'])}>
      <div className={styles['editor-title']}>
        <span>{displayName}</span>
      </div>
      <ReactCodeMirror
        basicSetup={{
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: false,
          autocompletion: true,
          closeBrackets: true,
          history: true,
          lineNumbers: true
        }}
        className={styles['code-mirror-wrapper']}
        extensions={[langs[language]()]}
        theme={'dark'}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
})

CodeEditor.displayName = 'CodeEditor'
