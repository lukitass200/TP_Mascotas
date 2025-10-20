import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePet } from '../../contexts/PetContext'
import { useAuth } from '../../contexts/AuthContext'
import hornet from '../../assets/Hornet_Idle.jpg'
import knight from '../../assets/knight.jpg'
import reactLogo from '../../assets/react.svg'
import hollownestBg from '../../assets/hollownest.jpg'
import telasBg from '../../assets/telas lejanas.png'
import './AuthView.css'

export default function AuthView() {
  const { selectPet } = usePet()
  const nav = useNavigate()
  const { user, login } = useAuth()
  const [region, setRegion] = useState(null) // 'telas' | 'hollow' | null
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (!username || !pin) return
    login(username, pin)
  }

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
      {!user && (
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Iniciar sesión</h2>
          <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} />
          <button type="submit">Entrar</button>
        </form>
      )}

      <h2>¿A dónde te diriges hoy?</h2>
      {!region && (
        <div className="region-choice">
          <button 
            className="region-btn hollow-btn" 
            onClick={() => setRegion('hollow')}
            style={{ backgroundImage: `url(${hollownestBg})` }}
          >
            <span className="btn-text">Hollownest</span>
          </button>
          <button 
            className="region-btn telas-btn" 
            onClick={() => setRegion('telas')}
            style={{ backgroundImage: `url(${telasBg})` }}
          >
            <span className="btn-text">Telas lejanas</span>
          </button>
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
