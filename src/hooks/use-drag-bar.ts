import { useCallback, useEffect, useState } from 'react'

export default function useDragBar(divRef: React.RefObject<HTMLDivElement>, direction: 'horizontal' | 'vertical') {
  const [isDragging, setIsDragging] = useState(false)

  const drag = useCallback((e: MouseEvent) => {
    const div = divRef.current
    if (!div) return
    if (direction === 'horizontal') div.style.width = `${e.pageX - div.offsetLeft}px`
    else if (direction === 'vertical') div.style.height = `${e.pageY - div.offsetTop}px`
    div.style.flexGrow = 'unset'
  }, [])

  const onMouseDown = () => {
    document.addEventListener('mousemove', drag)
    setIsDragging(true)
  }

  const onMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', drag)
    setIsDragging(false)
  }, [])

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    return () => document.body.removeEventListener('mousemove', onMouseUp)
  }, [])

  return { onMouseDown, isDragging }
}
