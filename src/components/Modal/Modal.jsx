import React, { useEffect } from 'react'
import './Modal.css'

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose?.()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="modal-content" role="document">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
        </div>
      </div>
    </div>
  )
}


