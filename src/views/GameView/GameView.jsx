import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePet } from '../../contexts/PetContext'
import Modal from '../../components/Modal/Modal'
import './GameView.css'
import hornetSprite from '../../assets/HornetJugando.jpg'
import guaranaSprite from '../../assets/guarana.png'

export default function GameView() {
  const navigate = useNavigate()
  const { actions } = usePet()
  const gameAreaRef = useRef(null)
  const animationFrameRef = useRef(null)
  const endHandledRef = useRef(false)
  
  // Dimensiones del área de juego (agrandadas)
  const GAME_WIDTH = 720
  const GAME_HEIGHT = 520
  const HORNET_SIZE = 120
  const GUARANA_SIZE = 60

  // Estados del juego
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false) // Cambiado a false para mostrar popup primero
  const [hornetPosition, setHornetPosition] = useState({ x: (GAME_WIDTH - HORNET_SIZE) / 2, y: GAME_HEIGHT - HORNET_SIZE })
  const [guaranas, setGuaranas] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showInstructions, setShowInstructions] = useState(true)

  // Generar guaranas aleatorias
  const generateGuarana = useCallback(() => {
    if (!gameActive) return
    
    const newGuarana = {
      id: Date.now() + Math.random(),
      x: Math.random() * (GAME_WIDTH - GUARANA_SIZE),
      y: -GUARANA_SIZE,
      speed: 2 + Math.random() * 2, // Velocidad variable
      caught: false
    }
    
    setGuaranas(prev => [...prev, newGuarana])
  }, [gameActive])

  // Actualizar posición de las guaranas
  const updateGuaranas = useCallback(() => {
    setGuaranas(prev => {
      if (prev.length === 0) return prev // No hacer nada si no hay guaranas
      
      return prev.map(guarana => {
        if (guarana.caught || guarana.missed) return guarana
        
        const newY = guarana.y + guarana.speed
        
        // Si la guarana sale de la pantalla, el juego termina
        if (newY > GAME_HEIGHT) {
          setGameActive(false)
          return { ...guarana, missed: true }
        }
        
        // Verificar colisión con Hornet
        const hornetCenterX = hornetPosition.x + HORNET_SIZE / 2
        const hornetCenterY = hornetPosition.y + HORNET_SIZE / 2
        const guaranaCenterX = guarana.x + GUARANA_SIZE / 2
        const guaranaCenterY = guarana.y + GUARANA_SIZE / 2
        
        const distance = Math.sqrt(
          Math.pow(hornetCenterX - guaranaCenterX, 2) + 
          Math.pow(hornetCenterY - guaranaCenterY, 2)
        )
        
        if (distance < (HORNET_SIZE + GUARANA_SIZE) / 2) {
          setScore(prev => prev + 1) // Cada guarana da 1 punto
          return null // eliminar inmediatamente la guarana atrapada
        }
        
        return { ...guarana, y: newY }
      }).filter(Boolean)
    })
  }, [hornetPosition])

  // Manejar el drag del sprite
  const handleMouseDown = (e) => {
    if (!gameActive) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - hornetPosition.x,
      y: e.clientY - hornetPosition.y
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !gameActive) return
    
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    // Limitar movimiento dentro del área de juego
    const constrainedX = Math.max(0, Math.min(newX, GAME_WIDTH - HORNET_SIZE))
    const constrainedY = Math.max(GAME_HEIGHT - HORNET_SIZE, Math.min(newY, GAME_HEIGHT - HORNET_SIZE))
    
    setHornetPosition({ x: constrainedX, y: constrainedY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Función para iniciar el juego después de aceptar las instrucciones
  const startGame = () => {
    setShowInstructions(false)
    setGuaranas([]) // Limpiar cualquier guarana previa
    setScore(0) // Reiniciar puntuación
    endHandledRef.current = false // Reiniciar el flag de fin del juego
    setGameActive(true)
  }

  // Efectos
  useEffect(() => {
    if (!gameActive) return // Solo ejecutar si el juego está activo
    
    // Generar guaranas cada 1200ms
    const guaranaInterval = setInterval(generateGuarana, 1200)
    
    // Limpiar guaranas atrapadas y perdidas cada 500ms
    const cleanupInterval = setInterval(() => {
      setGuaranas(prev => prev.filter(guarana => !guarana.caught && !guarana.missed))
    }, 500)

    return () => {
      clearInterval(guaranaInterval)
      clearInterval(cleanupInterval)
    }
  }, [generateGuarana, gameActive])

  useEffect(() => {
    // Loop principal del juego
    const gameLoop = () => {
      if (gameActive) {
        updateGuaranas()
      }
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }
    
    animationFrameRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameActive, updateGuaranas])

  // Eventos del mouse
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e)
    const handleGlobalMouseUp = () => handleMouseUp()

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging])

  // Finalizar juego
  useEffect(() => {
    // Solo ejecutar si el juego estaba activo y ahora no lo está
    if (!gameActive && endHandledRef.current === false && score > 0) {
      endHandledRef.current = true
      // Ejecutar la acción de jugar (efecto completo)
      actions.play()
      
      // Volver a la vista anterior
      navigate(-1)
      
      // Despachar el evento con un pequeño delay para asegurar que PlayView esté montado
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('gameEnded', { detail: { score } }))
      }, 50)
    }
  }, [gameActive, actions, navigate, score])

  return (
    <div className="game-view">
      <div className="game-header">
        <h2>¡Atrapa las Guaranas!</h2>
        <div className="game-stats">
          <span>Puntos: {score}</span>
        </div>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="game-area"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Sprite de Hornet */}
        <div
          className={`hornet-player ${isDragging ? 'dragging' : ''}`}
          style={{
            left: hornetPosition.x,
            top: hornetPosition.y,
            width: HORNET_SIZE,
            height: HORNET_SIZE,
            backgroundImage: `url(${hornetSprite})`,
          }}
          onMouseDown={handleMouseDown}
        />
        
        {/* Guaranas */}
        {guaranas.map(guarana => (
          <div
            key={guarana.id}
            className={`guarana ${guarana.caught ? 'caught' : ''} ${guarana.missed ? 'missed' : ''}`}
            style={{
              left: guarana.x,
              top: guarana.y,
              width: GUARANA_SIZE,
              height: GUARANA_SIZE,
              backgroundImage: `url(${guaranaSprite})`,
            }}
          />
        ))}
      </div>
      
      {/* Popup de instrucciones */}
      {showInstructions && (
        <Modal title="¡Instrucciones del Juego!" onClose={startGame}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              🎮 <strong>¡Atrapa las Guaranas!</strong>
            </p>
            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <p>📝 <strong>Objetivo:</strong> Atrapa todas las guaranas que caen del cielo</p>
              <p>🖱️ <strong>Controles:</strong> Arrastra a Hornet con el mouse para moverla</p>
              <p>⚠️ <strong>Cuidado:</strong> Si se te escapa una guarana, ¡el juego termina!</p>
              <p>🏆 <strong>Puntuación:</strong> Cada guarana atrapada te da 2 puntos</p>
            </div>
            <button 
              onClick={startGame}
              style={{
                padding: '0.8rem 2rem',
                backgroundColor: '#ffcc00',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: "'Baloo 2', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}
            >
              ¡Comenzar Juego! 🚀
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
