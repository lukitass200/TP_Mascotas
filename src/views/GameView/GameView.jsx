import React, { useEffect, useRef, useState } from 'react'
import '../PlayView/PlayView.css'
import { useNavigate } from 'react-router-dom'
import { usePet } from '../../contexts/PetContext'
import Modal from '../../components/Modal/Modal'
import hornetPlay from '../../assets/HornetJugando.jpg'
import knightPlay from '../../assets/knight_playing.webp'
import guaranaImg from '../../assets/guarana.png'

export default function GameView() {
  const { pet, actions } = usePet()
  const navigate = useNavigate()
  const isKnight = pet?.name === 'El Caballerito'

  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const [showResult, setShowResult] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [, forceRenderTick] = useState(0)
  const areaRef = useRef(null)
  const petXRef = useRef(0)
  const [petX, setPetX] = useState(0)
  const fruitsRef = useRef([])
  const animRef = useRef(null)
  const lastTsRef = useRef(0)
  const lastRenderTsRef = useRef(0)
  const startedRef = useRef(false)
  const spawnAccumRef = useRef(0)

  const startGame = () => {
    if (pet?.sleeping) {
      // If sleeping, go back to play hub
      navigate('/jugar')
      return
    }
    setPlaying(true)
    setShowResult(false)
    setScore(0)
    scoreRef.current = 0
    fruitsRef.current = []
    lastTsRef.current = 0
    const area = areaRef.current
    if (area) {
      const rect = area.getBoundingClientRect()
      petXRef.current = rect.width / 2
      setPetX(petXRef.current)
    }
    // Reset spawn accumulator
    spawnAccumRef.current = 0
    // Apply split play effects twice: total happiness +15, energy -10
    actions.playHalf()
    actions.playHalf()
    // Spawn first fruit immediately
    if (areaRef.current) {
      spawnFruit(areaRef.current.clientWidth)
    }
    // Kick the loop immediately to avoid missing first frame
    lastTsRef.current = 0
    gameLoop(performance.now())
  }

  const endGame = () => {
    setPlaying(false)
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = null
    setFinalScore(scoreRef.current)
    setShowResult(true)
    // Start cooldown for play: 60s
    const key = 'mv:cooldown:play'
    const next = Date.now() + 60_000
    localStorage.setItem(key, String(next))
  }

  const handleCloseResult = () => {
    setShowResult(false)
    navigate('/jugar')
  }

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    startGame()
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const spawnFruit = (areaWidth) => {
    const x = Math.random() * Math.max(areaWidth - 40, 0) + 20
    fruitsRef.current.push({ id: Math.random().toString(36).slice(2), x, y: -20, size: 28, speed: 180 + Math.random() * 120 })
  }

  const gameLoop = (ts) => {
    const area = areaRef.current
    if (!area) return
    const rectWidth = area.clientWidth
    const rectHeight = area.clientHeight
    const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0
    const prevTs = lastTsRef.current
    lastTsRef.current = ts
    // Deterministic spawn every 700ms using accumulator
    spawnAccumRef.current += dt
    while (spawnAccumRef.current >= 0.7) {
      spawnAccumRef.current -= 0.7
      spawnFruit(rectWidth)
    }
    const fruits = fruitsRef.current
    for (let i = fruits.length - 1; i >= 0; i -= 1) {
      const f = fruits[i]
      f.y += f.speed * dt
      const petY = rectHeight - 80
      const petW = 80
      const petH = 80
      const petLeft = petXRef.current - petW / 2
      const petRight = petLeft + petW
      const petTop = petY
      const petBottom = petY + petH
      const fruitLeft = f.x - f.size / 2
      const fruitRight = f.x + f.size / 2
      const fruitTop = f.y - f.size / 2
      const fruitBottom = f.y + f.size / 2
      const overlap = !(fruitRight < petLeft || fruitLeft > petRight || fruitBottom < petTop || fruitTop > petBottom)
      if (overlap) {
        fruits.splice(i, 1)
        scoreRef.current += 1
        setScore(scoreRef.current)
        continue
      }
      if (f.y - f.size / 2 > rectHeight) {
        endGame()
        return
      }
    }
    // Throttle React re-render to ~10 fps for smoother performance
    if (!lastRenderTsRef.current || ts - lastRenderTsRef.current > 100) {
      lastRenderTsRef.current = ts
      forceRenderTick(v => v + 1)
    }
    // Always schedule next frame; we'll cancel in endGame()
    animRef.current = requestAnimationFrame(gameLoop)
  }

  const onPointerDown = (e) => {
    e.preventDefault()
    const startX = ('touches' in e) ? e.touches[0].clientX : e.clientX
    const area = areaRef.current
    if (!area) return
    const rect = area.getBoundingClientRect()
    const move = (ev) => {
      const clientX = ('touches' in ev) ? ev.touches[0].clientX : ev.clientX
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
      petXRef.current = x
      setPetX(x)
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', up)
    move({ clientX: startX })
  }

  return (
    <div className="play-view">
      <h2>Jugar</h2>
      <div className="game-area" ref={areaRef} onMouseDown={onPointerDown} onTouchStart={onPointerDown}>
        {fruitsRef.current.map(f => (
          <img key={f.id} src={guaranaImg} alt="guaraná" className="fruit" style={{ left: `${f.x}px`, top: `${f.y}px`, width: `${f.size}px`, height: `${f.size}px` }} />
        ))}
        <img
          src={isKnight ? knightPlay : hornetPlay}
          alt={isKnight ? 'Caballerito' : 'Hornet'}
          className="pet-draggable"
          style={{ left: `${petX}px` }}
          draggable={false}
        />
      </div>
      <p>Puntaje: {score}</p>
      {showResult && (
        <Modal title="¡Buen juego!" onClose={handleCloseResult}>
          <p>{isKnight ? 'El Caballerito' : 'Hornet'} jugó y alcanzó un puntaje de {finalScore} 🎮</p>
        </Modal>
      )}
    </div>
  )
}


