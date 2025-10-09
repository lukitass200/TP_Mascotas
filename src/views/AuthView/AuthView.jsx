import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePet } from '../../contexts/PetContext'
import hornet from '../../assets/Hornet_Idle.jpg'
import './AuthView.css'

export default function AuthView() {
  const { selectPet } = usePet()
  const nav = useNavigate()

  const handleSelect = () => {
    selectPet({
      name: 'Hornet',
      sprite: hornet,
      hunger: 100,
      energy: 100,
      happiness: 100,
      sleeping: false,
      logs: []
    })
    // Redirige a la pantalla principal
    nav('/')
  }

  return (
    <div className="auth-view">
      <h2>Elige tu mascota</h2>
      <div className="pet-choice">
        <div className="pet-card" onClick={handleSelect}>
          <img src={hornet} alt="Hornet" />
          <h3>Hornet</h3>
          <p>La valiente guardiana del nido 🐝</p>
        </div>
      </div>
      <p className="hint">✨ Haz clic en la mascota para comenzar tu aventura</p>
    </div>
  )
}
