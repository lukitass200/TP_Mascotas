import React, { useState } from 'react'
import './SleepView.css'
import { usePet } from '../../contexts/PetContext'
import CooldownButton from '../../components/CooldownButton/CooldownButton'
import Modal from '../../components/Modal/Modal'
import hornetSleep from '../../assets/HornetDurmiendo.jpg'
import knightSleep from '../../assets/knight_resting.webp'
import { StatsPanel } from '../../components/StatBar/StatBar'
import iconFood from '../../assets/cena.png'
import iconEnergy from '../../assets/trueno.png'
import iconHappy from '../../assets/feliz.png'

export default function SleepView() {
  const { pet, actions } = usePet()
  const isKnight = pet?.name === 'El Caballerito'
  const [sleeping, setSleeping] = useState(false)
  const [showSleepModal, setShowSleepModal] = useState(false)

  const handleSleep = () => {
    if (pet?.sleeping) {
      setShowSleepModal(true)
      return false
    }
    setSleeping(true)
    actions.startSleep()
    setTimeout(() => setSleeping(false), 30000)
  }

  return (
    <div className="sleep-view">
      <h2>Dormir</h2>
      <img
        src={isKnight ? knightSleep : hornetSleep}
        alt={isKnight ? 'Caballerito durmiendo' : 'Hornet durmiendo'}
        className={`sleep-sprite ${pet?.sleeping ? 'zz' : ''}`}
      />
      <StatsPanel hunger={pet.hunger} energy={pet.energy} happiness={pet.happiness} icons={{ food: iconFood, energy: iconEnergy, happy: iconHappy }} />
      <CooldownButton id="sleep" label="Dormir 😴" onClick={handleSleep} cooldown={30} />
      {pet?.sleeping && <p>{isKnight ? 'El Caballerito' : 'Hornet'} está descansando...</p>}
      {!pet?.sleeping && pet?.sleeping === false && <p>{isKnight ? 'El Caballerito' : 'Hornet'} se siente renovado/a 💪</p>}
      {showSleepModal && (
        <Modal title="ZzZ..." onClose={() => setShowSleepModal(false)}>
          <p>{isKnight ? 'El Caballerito' : 'Hornet'} está durmiendo, ¡Espera hasta que se despierte!</p>
        </Modal>
      )}
    </div>
  )
}
