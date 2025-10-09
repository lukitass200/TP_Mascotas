import React from 'react'
import './FeedView.css'
import { usePet } from '../../contexts/PetContext'
import CooldownButton from '../../components/CooldownButton/CooldownButton'
import PetSprite from '../../components/PetSprite/PetSprite'
import hornetFeed from '../../assets/HornetComiendo.jpg'

export default function FeedView() {
  const { actions } = usePet()

  return (
    <div className="feed-view">
      <h2>Alimentar</h2>
      <img src={hornetFeed} alt="Hornet comiendo" className="feed-sprite" />
      <CooldownButton
        label="Dar comida 🍎"
        onClick={actions.feed}
        cooldown={60}
      />
      <p>Hornet recupera energía y calma su hambre.</p>
    </div>
  )
}
