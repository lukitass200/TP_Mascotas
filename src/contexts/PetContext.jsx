import React, { createContext, useContext, useEffect, useState } from 'react'

const PetContext = createContext()

export function PetProvider({ children }) {
  const [pet, setPet] = useState(null)

  // Wake up logic: if sleeping and time passed, wake up and restore energy
  useEffect(() => {
    if (!pet || !pet.sleeping || !pet.sleepUntil) return
    const tick = () => {
      if (Date.now() >= pet.sleepUntil) {
        setPet(prev => {
          if (!prev) return prev
          const newEnergy = Math.min(100, (prev.energy || 0) + 25)
          return { ...prev, sleeping: false, sleepUntil: null, energy: newEnergy }
        })
      }
    }
    const interval = setInterval(tick, 500)
    tick()
    return () => clearInterval(interval)
  }, [pet])

  const selectPet = newPet => {
    setPet(newPet)
    localStorage.setItem('mv:pet:default', JSON.stringify(newPet))
  }

  const actions = {
    feed: () => setPet(p => {
      if (!p) return p
      if (p.sleeping) return p
      return { ...p, hunger: Math.min(p.hunger + 20, 100) }
    }),
    play: () => setPet(p => {
      if (!p) return p
      if (p.sleeping) return p
      return { ...p, happiness: Math.min(p.happiness + 15, 100), energy: Math.max(p.energy - 10, 0) }
    }),
    startSleep: () => setPet(p => {
      if (!p) return p
      if (p.sleeping) return p
      const until = Date.now() + 30_000
      return { ...p, sleeping: true, sleepUntil: until }
    }),
  }

  return (
    <PetContext.Provider value={{ pet, setPet, selectPet, actions }}>
      {children}
    </PetContext.Provider>
  )
}

export const usePet = () => useContext(PetContext)
