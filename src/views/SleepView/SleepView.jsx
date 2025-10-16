import React, { useState } from 'react'
import './SleepView.css'
import { usePet } from '../../contexts/PetContext'
import CooldownButton from '../../components/CooldownButton/CooldownButton'
import hornetSleep from '../../assets/HornetDurmiendo.jpg'

export default function SleepView() {
  const { pet, actions } = usePet()
  const [sleeping, setSleeping] = useState(false)

  const handleSleep = () => {
    if (pet?.sleeping) return
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
        className={`sleep-sprite ${pet?.sleeping ? 'zz' : ''}`}
      />
      <CooldownButton id="sleep" label="Dormir 😴" onClick={handleSleep} cooldown={30} extraDisabled={!!pet?.sleeping} />
      {pet?.sleeping && <p>Hornet está descansando...</p>}
      {!pet?.sleeping && pet?.sleeping === false && <p>Hornet se siente renovada 💪</p>}
    </div>
  )
}
