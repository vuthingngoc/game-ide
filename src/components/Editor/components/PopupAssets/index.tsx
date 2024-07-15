import { Check, FilePenLine } from 'lucide-react'
import { useRef, useState } from 'react'

import styles from './styles.module.scss'

type PopupAssetsType = {
  pos: {
    x: number
    y: number
  }
  content: string
  handleSubmit: (content: string) => void
}

export default function PopupAssets({ pos, content, handleSubmit }: Readonly<PopupAssetsType>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.wrapper} style={{ left: pos.x, top: pos.y }}>
      {!open ? (
        <button className={styles['popup-button']} onClick={() => setOpen(true)}>
          <FilePenLine />
        </button>
      ) : (
        <div className={styles['assets-changer']}>
          <input ref={inputRef} defaultValue={content} />
          <button onClick={() => inputRef.current && handleSubmit(inputRef.current.value)}>
            <Check />
          </button>
        </div>
      )}
    </div>
  )
}
