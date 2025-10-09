import React, { useState, useEffect } from 'react'
import './CooldownButton.css'

export default function CooldownButton({ onClick, label, cooldown }) {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (remaining > 0) {
      const timer = setTimeout(() => setRemaining(remaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [remaining])

  const handleClick = () => {
    if (remaining === 0) {
      onClick()
      setRemaining(cooldown)
    }
  }

  return (
    <button
      className="cooldown-btn"
      onClick={handleClick}
      disabled={remaining > 0}
    >
      {remaining > 0 ? `${label} (${remaining}s)` : label}
    </button>
  )
}
