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

  React.useEffect(() => {
    if (!nextFeedAt) return
    const tick = () => {
      const secs = Math.max(0, Math.ceil((nextFeedAt - Date.now()) / 1000))
      setCooldownRemaining(secs)
      if (secs <= 0) {
        setNextFeedAt(null)
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [nextFeedAt])

  const handleDropFood = () => {
    if (!pet || pet.name !== 'Hornet') return
    if (pet?.sleeping) {
      setShowSleepModal(true)
      return
    }
    if (cooldownRemaining > 0) return
    setIsEating(true)
    actions.feed()
    setNextFeedAt(Date.now() + 60_000)
    setTimeout(() => setIsEating(false), 3000)
  }

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const onDrop = (e) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('text/food')
    if (type === 'guarana') {
      handleDropFood()
    }
  }

  const onDragStartFood = (e) => {
    e.dataTransfer.setData('text/food', 'guarana')
    e.dataTransfer.effectAllowed = 'move'
    // Prefer using the existing DOM node to preserve natural aspect ratio
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
        <div className="food-item" draggable onDragStart={onDragStartFood} aria-label="guaraná">
          <img src={guaranaImg} alt="guaraná" />
        </div>
      </div>
      <p>Dale de comer a tu mascota</p>
      {showSleepModal && (
        <Modal title="ZzZ..." onClose={() => setShowSleepModal(false)}>
          <p>{isKnight ? 'El Caballerito' : 'Hornet'} está durmiendo, ¡Espera hasta que se despierte!</p>
        </Modal>
      )}
    </div>
  )
}
