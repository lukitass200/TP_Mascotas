import React from 'react'
import './FeedView.css'
import { usePet } from '../../contexts/PetContext'
import CooldownButton from '../../components/CooldownButton/CooldownButton'
import { StatsPanel } from '../../components/StatBar/StatBar'
import iconFood from '../../assets/cena.png'
import iconEnergy from '../../assets/trueno.png'
import iconHappy from '../../assets/feliz.png'
import PetSprite from '../../components/PetSprite/PetSprite'
import hornetFeed from '../../assets/HornetComiendo.jpg'
import knightFeed from '../../assets/knight_eating.jpg'

export default function FeedView() {
  const { pet, actions } = usePet()
  const isKnight = pet?.name === 'El Caballerito'
  const feedImg = isKnight ? knightFeed : hornetFeed

  return (
    <div className="feed-view">
      <h2>Alimentar</h2>
      <img src={feedImg} alt={isKnight ? 'Caballerito comiendo' : 'Hornet comiendo'} className="feed-sprite" />
      <StatsPanel hunger={pet.hunger} energy={pet.energy} happiness={pet.happiness} icons={{ food: iconFood, energy: iconEnergy, happy: iconHappy }} />
      <CooldownButton
        id="feed"
        label="Dar comida 🍎"
        onClick={actions.feed}
        cooldown={60}
        extraDisabled={!!pet?.sleeping}
      />
      <p>{isKnight ? 'El Caballerito' : 'Hornet'} recupera energía y calma su hambre.</p>
    </div>
  )
}
