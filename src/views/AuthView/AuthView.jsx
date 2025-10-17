import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePet } from '../../contexts/PetContext'
import hornet from '../../assets/Hornet_Idle.jpg'
import knight from '../../assets/knight.jpg'
import reactLogo from '../../assets/react.svg'
import './AuthView.css'

export default function AuthView() {
  const { selectPet } = usePet()
  const nav = useNavigate()
  const [region, setRegion] = useState(null) // 'telas' | 'hollow' | null

  const selectHornet = () => {
    selectPet({
      name: 'Hornet',
      sprite: hornet,
      hunger: 100,
      energy: 100,
      happiness: 100,
      sleeping: false,
      logs: []
    })
    nav('/')
  }

  const selectCaballerito = () => {
    selectPet({
      name: 'El Caballerito',
      sprite: knight,
      hunger: 100,
      energy: 100,
      happiness: 100,
      sleeping: false,
      logs: []
    })
    nav('/')
  }

  return (
    <div className="auth-view">
      <h2>¿A dónde te diriges hoy?</h2>
      {!region && (
        <div className="region-choice">
          <button className="region-btn" onClick={() => setRegion('hollow')}>Hollownest</button>
          <button className="region-btn" onClick={() => setRegion('telas')}>Telas lejanas</button>
        </div>
      )}

      {region === 'telas' && (
        <div className="pet-choice">
          <div className="pet-card" onClick={selectHornet}>
            <img src={hornet} alt="Hornet" />
            <h3>Hornet</h3>
            <p>La valiente guardiana del nido 🐝</p>
          </div>
          <div className="pet-card disabled">
            <img src={reactLogo} alt="Sherma" />
            <h3>Sherma</h3>
            <span className="soon-badge">cumming soon</span>
          </div>
        </div>
      )}

      {region === 'hollow' && (
        <div className="pet-choice">
          <div className="pet-card" onClick={selectCaballerito}>
            <img src={reactLogo} alt="El Caballerito" />
            <h3>El Caballerito</h3>
            <p>Un pequeño héroe en gran aventura ⚔️</p>
          </div>
          <div className="pet-card disabled">
            <img src={reactLogo} alt="Breta" />
            <h3>Breta</h3>
            <span className="soon-badge">cumming soon</span>
          </div>
        </div>
      )}

      {region && (
        <button className="back-btn" onClick={() => setRegion(null)}>← Volver</button>
      )}

      {!region && <p className="hint">✨ Elige un destino para comenzar</p>}
    </div>
  )
}
