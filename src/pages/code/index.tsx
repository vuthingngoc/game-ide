import { useEffect, useRef, useState } from 'react'

import { CodeEditor } from '@/components'
import useDragBar from '@/hooks/use-drag-bar'
import useLocalStorage from '@/hooks/use-local-storage'

import styles from './styles.module.scss'

export default function CodePage() {
  const [srcDoc, setSrcDoc] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const leftEditorRef = useRef<HTMLDivElement>(null)
  const centerEditorRef = useRef<HTMLDivElement>(null)

  const [html, setHtml] = useLocalStorage('html', '')
  const [css, setCss] = useLocalStorage('css', '')
  const [js, setJs] = useLocalStorage('js', '')

  const { onMouseDown: onMouseDownPanel, isDragging: isDraggingPanel } = useDragBar(panelRef, 'vertical')
  const { onMouseDown: onMouseDownLeft, isDragging: isDraggingLeft } = useDragBar(leftEditorRef, 'horizontal')
  const { onMouseDown: onMouseDownCenter, isDragging: isDraggingCenter } = useDragBar(centerEditorRef, 'horizontal')

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    if (isDraggingPanel || isDraggingCenter || isDraggingLeft) {
      iframe.style.pointerEvents = 'none'
    } else {
      iframe.style.pointerEvents = 'auto'
    }
  }, [isDraggingPanel, isDraggingCenter, isDraggingLeft])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `)
    }, 250)
    return () => clearTimeout(timeout)
  }, [html, css, js])

  return (
    <div className={styles['code-container']}>
      <div ref={panelRef} className={styles['top-pane']}>
        <div ref={leftEditorRef} className={styles.editor}>
          <CodeEditor displayName='HTML' language='xml' value={html} onChange={setHtml} />
        </div>

        <div className={styles['horizontal-resizer']} onMouseDown={onMouseDownLeft} />

        <div ref={centerEditorRef} className={styles.editor}>
          <CodeEditor
            className={styles.editor}
            displayName='CSS'
            language='css'
            style={{ width: '300px' }}
            value={css}
            onChange={setCss}
          />
        </div>
        <div className={styles['horizontal-resizer']} onMouseDown={onMouseDownCenter} />

        <div className={styles.editor}>
          <CodeEditor className={styles.editor} displayName='JS' language='javascript' value={js} onChange={setJs} />
        </div>
      </div>
      <div className={styles['vertical-resizer']} onMouseDown={onMouseDownPanel} />
      <div className={styles['bottom-pane']}>
        <iframe ref={iframeRef} height='100%' sandbox='allow-scripts' srcDoc={srcDoc} title='output' width='100%' />
      </div>
    </div>
  )
}
