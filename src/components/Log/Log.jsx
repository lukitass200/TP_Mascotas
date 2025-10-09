import React from 'react'
import './Log.css'

export default function Log({ logs }) {
  return (
    <div className="log">
      <h3>Historial</h3>
      <ul>
        {logs.map((l, i) => (
          <li key={i}>
            <span>{new Date(l.ts).toLocaleTimeString()} → {l.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
