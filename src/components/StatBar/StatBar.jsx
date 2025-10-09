import React from 'react'
import './StatBar.css'

export default function StatBar({ label, value, color }) {
  return (
    <div className="statbar">
      <span className="statbar-label">{label}</span>
      <div className="statbar-bar">
        <div className="statbar-fill" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="statbar-value">{value}</span>
    </div>
  )
}
