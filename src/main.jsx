import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PetProvider } from './contexts/PetContext'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PetProvider>
          <App />
        </PetProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
