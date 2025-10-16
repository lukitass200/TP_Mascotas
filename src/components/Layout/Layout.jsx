import React from 'react'
import { Link } from 'react-router-dom'
import './Layout.css'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>Mascota Virtual — Hornet</h1>
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/alimentar">Alimentar</Link>
          <Link to="/jugar">Jugar</Link>
          <Link to="/dormir">Dormir</Link>
        </nav>
      </header>
      <main className="layout-content">{children}</main>
      <footer className="layout-footer">© 2025 - Proyecto Integrador - lucas dagostino, Tomas Cabral y Ian Segade</footer>
    </div>
  )
}
