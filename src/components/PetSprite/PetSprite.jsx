import React from 'react'
import './PetSprite.css'
import hornetSprite from '../../assets/Hornet_Idle.jpg'
import knightSprite from '../../assets/knight.jpg'
import { usePet } from '../../contexts/PetContext'

export default function PetSprite({ frames = 6, fps = 6 }) {
  const { pet } = usePet()
  const duration = `${frames / fps}s`
  const isKnight = pet?.name === 'El Caballerito'
  const sprite = isKnight ? knightSprite : hornetSprite
  return (
    <div className="pet-sprite-wrap">
      <div
        className="pet-sprite"
        style={{
          backgroundImage: `url(${sprite})`,
          animation: `spriteAnim ${duration} steps(${frames}) infinite`
        }}
      />
      {pet.sleeping && <div className="sleep-overlay">💤</div>}
    </div>
  )
}
