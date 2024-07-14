import { CodeEditor } from '@/components'
import useLocalStorage from '@/hooks/use-local-storage'
import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'
import useDragBar from '@/hooks/use-drag-bar'

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
    if (isDraggingPanel || isDraggingCenter) {
      iframe.style.pointerEvents = 'none'
    } else {
      iframe.style.pointerEvents = 'auto'
    }
  }, [isDraggingPanel, isDraggingCenter])

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
      <div className={styles['top-pane']} ref={panelRef}>
        <div ref={leftEditorRef} className={styles.editor}>
          <CodeEditor language='xml' displayName='HTML' value={html} onChange={setHtml} />
        </div>

        <div className={styles['horizontal-resizer']} onMouseDown={onMouseDownLeft} />

        <div ref={centerEditorRef} className={styles.editor}>
          <CodeEditor
            className={styles.editor}
            style={{ width: '300px' }}
            language='css'
            displayName='CSS'
            value={css}
            onChange={setCss}
          />
        </div>
        <div className={styles['horizontal-resizer']} onMouseDown={onMouseDownCenter} />

        <div className={styles.editor}>
          <CodeEditor className={styles.editor} language='javascript' displayName='JS' value={js} onChange={setJs} />
        </div>
      </div>
      <div className={styles['vertical-resizer']} onMouseDown={onMouseDownPanel} />
      <div className={styles['bottom-pane']}>
        <iframe ref={iframeRef} srcDoc={srcDoc} title='output' sandbox='allow-scripts' width='100%' height='100%' />
      </div>
    </div>
  )
}
