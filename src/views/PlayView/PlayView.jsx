import React from 'react'
import './PlayView.css'
import { useNavigate } from 'react-router-dom'
import { usePet } from '../../contexts/PetContext'
import CooldownButton from '../../components/CooldownButton/CooldownButton'
import Modal from '../../components/Modal/Modal'
import PetSprite from '../../components/PetSprite/PetSprite'
import { StatsPanel } from '../../components/StatBar/StatBar'
import iconFood from '../../assets/cena.png'
import iconEnergy from '../../assets/trueno.png'
import iconHappy from '../../assets/feliz.png'

export default function PlayView() {
  const { pet } = usePet()
  const navigate = useNavigate()
  const isKnight = pet?.name === 'El Caballerito'
  const [showSleepModal, setShowSleepModal] = React.useState(false)
  const [gameEndSignal, setGameEndSignal] = React.useState(0)
  const [showScorePopup, setShowScorePopup] = React.useState(false)
  const [finalScore, setFinalScore] = React.useState(0)

  const handleGoToGame = () => {
    if (pet?.sleeping) {
      setShowSleepModal(true)
      return false // prevent CooldownButton from starting cooldown
    }
    navigate('/jugar/partida')
    return false // start cooldown only when game ends
  }

  // Función para activar el cooldown cuando termine el juego
  const handleGameEnd = React.useCallback(() => {
    setGameEndSignal(prev => prev + 1)
  }, [])

  // Escuchar el evento personalizado del juego
  React.useEffect(() => {
    const handleGameEndEvent = (event) => {
      handleGameEnd()
      // Obtener puntuación del evento si está disponible
      const score = event.detail?.score || 0
      setFinalScore(score)
      setShowScorePopup(true)
      
      // Ocultar popup después de 3 segundos
      setTimeout(() => {
        setShowScorePopup(false)
      }, 3000)
    }

    window.addEventListener('gameEnded', handleGameEndEvent)
    return () => window.removeEventListener('gameEnded', handleGameEndEvent)
  }, [handleGameEnd])

  return (
    <div className="play-view">
      <h2>Jugar</h2>
      <PetSprite />
      <StatsPanel hunger={pet.hunger} energy={pet.energy} happiness={pet.happiness} icons={{ food: iconFood, energy: iconEnergy, happy: iconHappy }} />
      <CooldownButton 
        id="play" 
        label={'Jugar 🎮'} 
        onClick={handleGoToGame} 
        cooldown={60} 
        manualStart={true}
        startCooldownSignal={gameEndSignal}
      />
      {showSleepModal && (
        <Modal title="ZzZ..." onClose={() => setShowSleepModal(false)}>
          <p>{isKnight ? 'El Caballerito' : 'Hornet'} está durmiendo, ¡Espera hasta que se despierte!</p>
        </Modal>
      )}
      
      {showScorePopup && (
        <Modal title="¡Resultado!" onClose={() => setShowScorePopup(false)}>
          <p>obtuviste {finalScore} puntos</p>
        </Modal>
      )}
    </div>
  )
}
