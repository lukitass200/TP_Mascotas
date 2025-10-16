import React, { useState, useEffect } from 'react'
import './CooldownButton.css'

export default function CooldownButton({ id, onClick, label, cooldown, extraDisabled = false }) {
  const [remaining, setRemaining] = useState(0)
  const [nextAtMs, setNextAtMs] = useState(null)

  const storageKey = `mv:cooldown:${id}`

  // Load persisted next available timestamp on mount or when id changes
  useEffect(() => {
    if (!id) return
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      const parsed = parseInt(raw, 10)
      if (!Number.isNaN(parsed)) {
        setNextAtMs(parsed)
        const secs = Math.max(0, Math.ceil((parsed - Date.now()) / 1000))
        setRemaining(secs)
      }
    } else {
      setRemaining(0)
      setNextAtMs(null)
    }
  }, [id, storageKey])

  // Tick remaining time based on absolute timestamp to survive navigation/tab sleep
  useEffect(() => {
    if (!nextAtMs) return
    const tick = () => {
      const secs = Math.max(0, Math.ceil((nextAtMs - Date.now()) / 1000))
      setRemaining(secs)
      if (secs <= 0) {
        setNextAtMs(null)
        localStorage.removeItem(storageKey)
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [nextAtMs, storageKey])

  const handleClick = () => {
    if (remaining === 0) {
      onClick()
      const next = Date.now() + cooldown * 1000
      setNextAtMs(next)
      localStorage.setItem(storageKey, String(next))
      setRemaining(cooldown)
    }
  }

  return (
    <button
      className="cooldown-btn"
      onClick={handleClick}
      disabled={remaining > 0 || extraDisabled}
    >
      {remaining > 0 ? `${label} (${remaining}s)` : label}
    </button>
  )
}
