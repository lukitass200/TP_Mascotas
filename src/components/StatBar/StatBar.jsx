import React from 'react'
import './StatBar.css'

export default function StatBar({ label, value, color, icon }) {
  return (
    <div className="statbar">
      {icon && <img className="statbar-icon" src={icon} alt="icono" />}
      <span className="statbar-label">{label}</span>
      <div className="statbar-bar">
        <div className="statbar-fill" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="statbar-value">{value}</span>
    </div>
  )
}

export function StatsPanel({ hunger, energy, happiness, icons }) {
  return (
    <div className="stats-panel">
      <StatBar label="Hambre" value={hunger} color="#ff6666" icon={icons?.food} />
      <StatBar label="Energía" value={energy} color="#66ccff" icon={icons?.energy} />
      <StatBar label="Felicidad" value={happiness} color="#ffcc00" icon={icons?.happy} />
    </div>
  )
}
