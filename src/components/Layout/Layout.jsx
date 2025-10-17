import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Layout.css'
import { usePet } from '../../contexts/PetContext'
import { useAuth } from '../../contexts/AuthContext'
import iconHappy from '../../assets/feliz.png'
import iconFood from '../../assets/cena.png'
import iconEnergy from '../../assets/trueno.png'
import iconHome from '../../assets/hogar.png'
import iconMoon from '../../assets/luna.png'

export default function Layout({ children }) {
  const { setPet } = usePet()
  const { user } = useAuth()
  const nav = useNavigate()

  const handleChangeCharacter = () => {
    setPet(null)
    try {
      if (user && user.id) localStorage.removeItem(`mv:pet:${user.id}`)
    } catch (e) {}
    nav('/auth')
  }
  return (
    <div className="layout">
      <header className="layout-header">
        <button className="change-btn" onClick={handleChangeCharacter}>Cambiar mascota</button>
        <h1>Mascota Virtual</h1>
      </header>
      <main className="layout-content">{children}</main>
      <footer className="layout-footer">
        <nav className="bottom-nav">
          <Link to="/" className="nav-item" aria-label="Inicio">
            <img src={iconHome} alt="Inicio" />
            <span>Inicio</span>
          </Link>
          <Link to="/alimentar" className="nav-item" aria-label="Alimentar">
            <img src={iconFood} alt="Comida" />
            <span>Comer</span>
          </Link>
          <Link to="/jugar" className="nav-item" aria-label="Jugar">
            <img src={iconHappy} alt="Feliz" />
            <span>Jugar</span>
          </Link>
          <Link to="/dormir" className="nav-item" aria-label="Dormir">
            <img src={iconMoon} alt="Dormir" />
            <span>Dormir</span>
          </Link>
        </nav>
        <div className="credits">© 2025 - Proyecto Integrador - lucas dagostino, Tomas Cabral y Ian Segade</div>
      </footer>
    </div>
  )
}
