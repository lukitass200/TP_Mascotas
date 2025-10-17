import React from 'react'
import './HomeView.css'
import { usePet } from '../../contexts/PetContext'
import PetSprite from '../../components/PetSprite/PetSprite'
import StatBar, { StatsPanel } from '../../components/StatBar/StatBar'
import iconHappy from '../../assets/feliz.png'
import iconFood from '../../assets/cena.png'
import iconEnergy from '../../assets/trueno.png'

export default function HomeView() {
  const { pet } = usePet()

  return (
    <div className="home-view">
       <h2>Home</h2>
      <PetSprite />
      <div className="stats">
        <StatsPanel hunger={pet.hunger} energy={pet.energy} happiness={pet.happiness} icons={{ food: iconFood, energy: iconEnergy, happy: iconHappy }} />
      </div>
    </div>
  )
}
