import React, { useState } from 'react'
import './SleepView.css'
import { usePet } from '../../contexts/PetContext'
import CooldownButton from '../../components/CooldownButton/CooldownButton'
import hornetSleep from '../../assets/HornetDurmiendo.jpg'

export default function SleepView() {
  const { pet, actions } = usePet()
  const [sleeping, setSleeping] = useState(false)

  const handleSleep = () => {
    setSleeping(true)
    actions.startSleep()
    setTimeout(() => setSleeping(false), 30000)
  }

  return (
    <div className="sleep-view">
      <h2>Dormir</h2>
      <img
        src={hornetSleep}
        alt="Hornet durmiendo"
        className={`sleep-sprite ${sleeping ? 'zz' : ''}`}
      />
      <CooldownButton label="Dormir 😴" onClick={handleSleep} cooldown={60} />
      {sleeping && <p>Hornet está descansando...</p>}
      {!sleeping && pet.sleeping === false && <p>Hornet se siente renovada 💪</p>}
    </div>
  )
}
