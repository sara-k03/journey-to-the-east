import { useEffect, useRef } from 'react'

// Modal lesson pop-up. Closes on Escape, the × button, or a click on the backdrop.
export default function LessonDialog({ open, onClose, title, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="lesson"
      aria-labelledby="lesson-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="lesson-inner">
        <header className="lesson-header">
          <h2 id="lesson-title">{title}</h2>
          <button type="button" className="lesson-close" aria-label="Close lesson" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="lesson-body">{children}</div>
      </div>
    </dialog>
  )
}
