import React, { createContext, useContext, useEffect, useState } from 'react'

const PetContext = createContext()

export function PetProvider({ children }) {
  const [pet, setPet] = useState(null)

  // Global decay tick every 5 minutes: hunger -5, energy -3, happiness -2 (min 0)
  useEffect(() => {
    const TICK_MS = 5 * 60 * 1000
    const STORAGE_KEY = 'mv:tick:last'
    let timer = null
    const applyDecay = (times) => {
      if (!times || times <= 0) return
      setPet(prev => {
        if (!prev) return prev
        const hunger = Math.max(0, (prev.hunger || 0) - 5 * times)
        const energy = Math.max(0, (prev.energy || 0) - 3 * times)
        const happiness = Math.max(0, (prev.happiness || 0) - 2 * times)
        return { ...prev, hunger, energy, happiness }
      })
    }
    const tickCheck = () => {
      const now = Date.now()
      const raw = localStorage.getItem(STORAGE_KEY)
      const last = raw ? parseInt(raw, 10) : now
      if (Number.isNaN(last)) {
        localStorage.setItem(STORAGE_KEY, String(now))
        return
      }
      const elapsed = now - last
      const times = Math.floor(elapsed / TICK_MS)
      if (times > 0) {
        applyDecay(times)
        const remainderBase = last + times * TICK_MS
        localStorage.setItem(STORAGE_KEY, String(remainderBase))
      }
    }
    // Initialize last tick if missing and run a check immediately
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    }
    tickCheck()
    timer = setInterval(tickCheck, 30 * 1000)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [])

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
    // Half play effect: energy -5, happiness +(7 or 8) alternating so 2 calls => +15/-10 total
    playHalf: () => setPet(p => {
      if (!p) return p
      if (p.sleeping) return p
      const toggle = localStorage.getItem('mv:play:halfToggle') === '1'
      const happinessDelta = toggle ? 7 : 8
      localStorage.setItem('mv:play:halfToggle', toggle ? '0' : '1')
      const nextHappiness = Math.min((p.happiness || 0) + happinessDelta, 100)
      const nextEnergy = Math.max((p.energy || 0) - 5, 0)
      return { ...p, happiness: nextHappiness, energy: nextEnergy }
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
