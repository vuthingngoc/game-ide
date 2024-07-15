import * as events from '@uiw/codemirror-extensions-events'
import { element } from '@uiw/codemirror-extensions-events'
import { langs } from '@uiw/codemirror-extensions-langs'
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes, useRef, useState } from 'react'

import PopupAssets from './components/PopupAssets'
import styles from './styles.module.scss'

type EditorProps = {
  language: 'javascript' | 'css' | 'xml'
  displayName: string
  value: string
  onChange: (value: string) => void
} & HTMLAttributes<HTMLDivElement>

export const CodeEditor = forwardRef<HTMLDivElement, EditorProps>(({ language, displayName, value, onChange }, ref) => {
  const [selection, setSelection] = useState({
    form: 0,
    to: 0,
    content: '',
    pos: { x: 0, y: 0 }
  })
  const refs = useRef<ReactCodeMirrorRef>({})

  function handleChange(value: string) {
    onChange(value)
  }

  const eventsOpts = events.dom({
    mouseup(e) {
      if (refs?.current) {
        console.log(refs.current.view?.state.selection.main.from, refs.current.view?.state.selection.main.to)
        const from = refs.current.view?.state.selection.main.from
        const to = refs.current.view?.state.selection.main.to
        const content = refs.current.view?.state.sliceDoc(from, to)

        if (from && to && content && refs.current.view) {
          const editorRect = refs.current.view.contentDOM.getBoundingClientRect()
          setSelection({
            form: from,
            to: to,
            content: content,
            pos: { x: e.clientX - editorRect.left, y: e.clientY - editorRect.top }
          })
          console.log({ x: e.clientX - editorRect.left, y: e.clientY - editorRect.top, content: content })
        } else {
          setSelection({
            form: 0,
            to: 0,
            content: '',
            pos: { x: 0, y: 0 }
          })
        }
      }
    }
  })

  const handleChangeContentSelection = (content: string) => {
    const { form, to } = selection
    const before = value.slice(0, form)
    const after = value.slice(to)
    const newValue = `${before}${content}${after}`
    onChange(newValue)
  }

  return (
    <div ref={ref} className={clsx(styles['editor-container'])}>
      {selection.content !== '' && (
        <PopupAssets content={selection.content} handleSubmit={handleChangeContentSelection} pos={selection.pos} />
      )}
      <div className={styles['editor-title']}>
        <span>{displayName}</span>
      </div>
      <ReactCodeMirror
        ref={refs}
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
        extensions={[
          langs[language](),
          element({
            type: 'content',
            props: {
              inputMode: 'none'
            }
          }),
          eventsOpts
        ]}
        theme={'dark'}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
})

CodeEditor.displayName = 'CodeEditor'
