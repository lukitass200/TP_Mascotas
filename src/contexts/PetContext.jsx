import React, { createContext, useContext, useState } from 'react'

const PetContext = createContext()

export function PetProvider({ children }) {
  const [pet, setPet] = useState(null)

  const selectPet = newPet => {
    setPet(newPet)
    localStorage.setItem('mv:pet:default', JSON.stringify(newPet))
  }

  const actions = {
    feed: () => setPet(p => ({ ...p, hunger: Math.min(p.hunger + 20, 100) })),
    play: () => setPet(p => ({ ...p, happiness: Math.min(p.happiness + 15, 100), energy: Math.max(p.energy - 10, 0) })),
    startSleep: () => setPet(p => ({ ...p, sleeping: true })),
  }

  return (
    <PetContext.Provider value={{ pet, setPet, selectPet, actions }}>
      {children}
    </PetContext.Provider>
  )
}

export const usePet = () => useContext(PetContext)
