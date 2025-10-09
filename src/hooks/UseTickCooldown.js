import { useEffect, useRef } from 'react'

export default function useTickCooldown({ pet, setPet, tickIntervalMs, tickChanges }) {
  const intervalRef = useRef(null)

  useEffect(() => {
    const applyTick = () => {
      setPet(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger + tickChanges.hunger),
        energy: Math.max(0, prev.energy + tickChanges.energy),
        happiness: Math.max(0, prev.happiness + tickChanges.happiness)
      }))
    }
    intervalRef.current = setInterval(applyTick, tickIntervalMs)
    return () => clearInterval(intervalRef.current)
  }, [setPet, tickChanges, tickIntervalMs])
}
