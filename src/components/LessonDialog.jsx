import { useEffect, useId, useRef } from 'react'

// Modal lesson pop-up. Closes on Escape, the × button, or a click on the backdrop.
export default function LessonDialog({ open, onClose, title, children }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="lesson"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="lesson-inner">
        <header className="lesson-header">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="lesson-close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="lesson-body">{children}</div>
      </div>
    </dialog>
  )
}
