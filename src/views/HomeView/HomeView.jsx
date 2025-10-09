import React from 'react'
import './HomeView.css'
import { usePet } from '../../contexts/PetContext'
import PetSprite from '../../components/PetSprite/PetSprite'
import StatBar from '../../components/StatBar/StatBar'
import Log from '../../components/Log/Log'

export default function HomeView() {
  const { pet } = usePet()

  return (
    <div className="home-view">
      <PetSprite />
      <div className="stats">
        <StatBar label="Hambre" value={pet.hunger} color="#ff6666" />
        <StatBar label="Energía" value={pet.energy} color="#66ccff" />
        <StatBar label="Felicidad" value={pet.happiness} color="#ffcc00" />
      </div>
      <Log logs={pet.logs} />
    </div>
  )
}
