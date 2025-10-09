import React, { useState } from 'react'
import './PlayView.css'
import { usePet } from '../../contexts/PetContext'
import CooldownButton from '../../components/CooldownButton/CooldownButton'
import hornetPlay from '../../assets/HornetJugando.jpg'

export default function PlayView() {
  const { actions } = usePet()
  const [score, setScore] = useState(0)

  const handlePlay = () => {
    setScore(0)
    const timer = setInterval(() => setScore(s => s + 1), 300)
    setTimeout(() => {
      clearInterval(timer)
      actions.play()
      alert(`Hornet jugó y alcanzó un puntaje de ${score}! 🎮`)
    }, 3000)
  }

  return (
    <div className="play-view">
      <h2>Jugar</h2>
      <img src={hornetPlay} alt="Hornet jugando" className="play-sprite" />
      <CooldownButton label="Jugar 🎮" onClick={handlePlay} cooldown={60} />
      <p>Puntaje: {score}</p>
    </div>
  )
}
