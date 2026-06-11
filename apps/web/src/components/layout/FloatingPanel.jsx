import { useEffect, useRef, useState } from "react"

// Layout limits for the floating notes panel.
const BOUNDS = {
  minWidth: 280,
  maxWidth: 720,
  minHeight: 220,
  maxHeight: 820,
  margin: 16,
}

export default function FloatingPanel() {
  const initialHeight = Math.min(0.72 * window.innerHeight, 560)

  const [notesCollapsed, setNotesCollapsed] = useState(true)
  const [notesWidth, setNotesWidth] = useState(420)
  const [notesHeight, setNotesHeight] = useState(initialHeight)
  const [panelPos, setPanelPos] = useState({
    top: Math.round(
      Math.max(
        BOUNDS.margin,
        Math.min((window.innerHeight - initialHeight) / 2, window.innerHeight - initialHeight - BOUNDS.margin)
      )
    ),
    right: 20,
  })

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  const panelPosRef = useRef(panelPos)
  const widthRef = useRef(notesWidth)
  const heightRef = useRef(notesHeight)
  const collapsedRef = useRef(notesCollapsed)
  const dragRef = useRef(null)
  const resizeRef = useRef(null)
  const pendingRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    panelPosRef.current = panelPos
  }, [panelPos])

  useEffect(() => {
    widthRef.current = notesWidth
  }, [notesWidth])

  useEffect(() => {
    heightRef.current = notesHeight
  }, [notesHeight])

  useEffect(() => {
    collapsedRef.current = notesCollapsed
  }, [notesCollapsed])

  return null
}
