import React from 'react'
import './PetSprite.css'
import hornetSprite from '../../assets/Hornet_Idle.jpg'
import knightSprite from '../../assets/knight.jpg'
import hornetSleepSprite from '../../assets/HornetDurmiendo.gif'
import knightSleepSprite from '../../assets/knight_resting.webp'
import { usePet } from '../../contexts/PetContext'

export default function PetSprite({ frames = 6, fps = 6 }) {
  const { pet } = usePet()
  const duration = `${frames / fps}s`
  const isKnight = pet?.name === 'El Caballerito'
  
  // Seleccionar sprite según si está dormida o no
  const getSprite = () => {
    if (pet?.sleeping) {
      return isKnight ? knightSleepSprite : hornetSleepSprite
    }
    return isKnight ? knightSprite : hornetSprite
  }
  
  const sprite = getSprite()
  const isSleeping = pet?.sleeping
  
  return (
    <div className="pet-sprite-wrap">
      <div
        className="pet-sprite"
        style={{
          backgroundImage: `url(${sprite})`,
          animation: isSleeping ? 'none' : `spriteAnim ${duration} steps(${frames}) infinite`
        }}
      />
    </div>
  )
}
