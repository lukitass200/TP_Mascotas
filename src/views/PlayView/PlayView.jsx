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

  const handleGoToGame = () => {
    if (pet?.sleeping) {
      setShowSleepModal(true)
      return false // prevent CooldownButton from starting cooldown
    }
    navigate('/jugar/partida')
    return false // start cooldown only when game ends
  }

  return (
    <div className="play-view">
      <h2>Jugar</h2>
      <PetSprite />
      <StatsPanel hunger={pet.hunger} energy={pet.energy} happiness={pet.happiness} icons={{ food: iconFood, energy: iconEnergy, happy: iconHappy }} />
      <CooldownButton id="play" label={'Jugar 🎮'} onClick={handleGoToGame} cooldown={60} />
      {showSleepModal && (
        <Modal title="ZzZ..." onClose={() => setShowSleepModal(false)}>
          <p>{isKnight ? 'El Caballerito' : 'Hornet'} está durmiendo, ¡Espera hasta que se despierte!</p>
        </Modal>
      )}
    </div>
  )
}
