import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import AuthView from './views/AuthView/AuthView'
import HomeView from './views/HomeView/HomeView'
import FeedView from './views/FeedView/FeedView'
import PlayView from './views/PlayView/PlayView'
import SleepView from './views/SleepView/SleepView'
import GameView from './views/GameView/GameView'
import { usePet } from './contexts/PetContext'
import { useAuth } from './contexts/AuthContext'

export default function App() {
  const { user } = useAuth()
  const { pet } = usePet()

  // Si no hay mascota, mostrar flujo de selección
  if (!pet) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthView />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    )
  }

  // Si hay mascota, muestra el layout con todas las rutas del juego
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/alimentar" element={<FeedView />} />
        <Route path="/jugar" element={<PlayView />} />
        <Route path="/jugar/partida" element={<GameView />} />
        <Route path="/dormir" element={<SleepView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
