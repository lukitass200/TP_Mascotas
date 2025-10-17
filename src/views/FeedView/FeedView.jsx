import React from 'react'
import './FeedView.css'
import { usePet } from '../../contexts/PetContext'
import Modal from '../../components/Modal/Modal'
import guaranaImg from '../../assets/guarana.png'
import PetSprite from '../../components/PetSprite/PetSprite'
import hornetFeed from '../../assets/HornetComiendo.jpg'
import knightFeed from '../../assets/knight_eating.jpg'

export default function FeedView() {
  const { pet, actions } = usePet()
  const isKnight = pet?.name === 'El Caballerito'
  const feedImg = isKnight ? knightFeed : hornetFeed
  const [showSleepModal, setShowSleepModal] = React.useState(false)
  const [isEating, setIsEating] = React.useState(false)
  const [cooldownRemaining, setCooldownRemaining] = React.useState(0)
  const [nextFeedAt, setNextFeedAt] = React.useState(null)

  // 🔹 Cargar cooldown guardado al montar
  React.useEffect(() => {
    const savedNextFeedAt = localStorage.getItem('nextFeedAt')
    if (savedNextFeedAt) {
      const parsedTime = parseInt(savedNextFeedAt, 10)
      if (parsedTime > Date.now()) {
        setNextFeedAt(parsedTime)
      } else {
        localStorage.removeItem('nextFeedAt')
      }
    }
  }, [])

  // 🔹 Actualizar cada segundo y limpiar al terminar
  React.useEffect(() => {
    if (!nextFeedAt) return
    const tick = () => {
      const secs = Math.max(0, Math.ceil((nextFeedAt - Date.now()) / 1000))
      setCooldownRemaining(secs)
      if (secs <= 0) {
        setNextFeedAt(null)
        localStorage.removeItem('nextFeedAt')
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [nextFeedAt])

  // 🔹 Manejar alimentación
  const handleDropFood = () => {
    if (!pet || pet.name !== 'Hornet') return
    if (pet?.sleeping) {
      setShowSleepModal(true)
      return
    }
    if (cooldownRemaining > 0) return // ⛔ Cooldown activo
    setIsEating(true)
    actions.feed()
    const cooldownTime = Date.now() + 60_000 // 1 minuto
    setNextFeedAt(cooldownTime)
    localStorage.setItem('nextFeedAt', cooldownTime.toString()) // 💾 Guardar cooldown
    setTimeout(() => setIsEating(false), 3000)
  }

  const onDragOver = (e) => e.preventDefault()

  const onDrop = (e) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('text/food')
    if (type === 'guarana') handleDropFood()
  }

  const onDragStartFood = (e) => {
    if (cooldownRemaining > 0) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/food', 'guarana')
    e.dataTransfer.effectAllowed = 'move'
    const target = e.currentTarget.querySelector('img')
    if (target) {
      const rect = target.getBoundingClientRect()
      e.dataTransfer.setDragImage(target, rect.width / 2, rect.height / 2)
    }
  }

  return (
    <div className="feed-view">
      <h2>Alimentar</h2>

      <div className="feed-zone" onDragOver={onDragOver} onDrop={onDrop}>
        {isEating ? (
          <img src={feedImg} alt={isKnight ? 'Caballerito comiendo' : 'Hornet comiendo'} className="feed-sprite" />
        ) : (
          <PetSprite />
        )}
      </div>

      <div className="food-dock">
        <div
          className={`food-item ${cooldownRemaining > 0 ? 'disabled' : ''}`}
          draggable={cooldownRemaining === 0}
          onDragStart={onDragStartFood}
          aria-label="guaraná"
        >
          <img src={guaranaImg} alt="guaraná" />
        </div>
      </div>

      <p>
        {cooldownRemaining > 0
          ? `⏳ Espera ${cooldownRemaining}s antes de alimentar de nuevo`
          : 'Dale de comer a tu mascota'}
      </p>

      {showSleepModal && (
        <Modal title="ZzZ..." onClose={() => setShowSleepModal(false)}>
          <p>{isKnight ? 'El Caballerito' : 'Hornet'} está durmiendo, ¡Espera hasta que se despierte!</p>
        </Modal>
      )}
    </div>
  )
}
