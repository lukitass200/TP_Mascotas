import React, { useRef, useState } from 'react'
import './PlayView.css'
import { usePet } from '../../contexts/PetContext'
import CooldownButton from '../../components/CooldownButton/CooldownButton'
import hornetPlay from '../../assets/HornetJugando.jpg'
import knightPlay from '../../assets/knight_playing.webp'
import { StatsPanel } from '../../components/StatBar/StatBar'
import iconFood from '../../assets/cena.png'
import iconEnergy from '../../assets/trueno.png'
import iconHappy from '../../assets/feliz.png'

export default function PlayView() {
  const { pet, actions } = usePet()
  const isKnight = pet?.name === 'El Caballerito'
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const [showResult, setShowResult] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const handlePlay = () => {
    if (pet?.sleeping) return
    setScore(0)
    scoreRef.current = 0
    const timer = setInterval(() => {
      scoreRef.current += 1
      setScore(scoreRef.current)
    }, 300)
    setTimeout(() => {
      clearInterval(timer)
      actions.play()
      setFinalScore(scoreRef.current)
      setShowResult(true)
    }, 3000)
  }

  return (
    <div className="play-view">
      <h2>Jugar</h2>
      <img src={isKnight ? knightPlay : hornetPlay} alt={isKnight ? 'Caballerito jugando' : 'Hornet jugando'} className="play-sprite" />
      <StatsPanel hunger={pet.hunger} energy={pet.energy} happiness={pet.happiness} icons={{ food: iconFood, energy: iconEnergy, happy: iconHappy }} />
      <CooldownButton id="play" label="Jugar 🎮" onClick={handlePlay} cooldown={60} extraDisabled={!!pet?.sleeping} />
      <p>Puntaje: {score}</p>
      {showResult && (
        <div className="modal-overlay" onClick={() => setShowResult(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>¡Buen juego!</h3>
            <p>{isKnight ? 'El Caballerito' : 'Hornet'} jugó y alcanzó un puntaje de {finalScore} 🎮</p>
            <button className="modal-btn" onClick={() => setShowResult(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}
