import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext' // Make sure this import is correct
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
     {/* <Routes> */}
      <AuthProvider> {/* Wrap your app with AuthProvider */}
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
      {/* </Routes> */}
    </BrowserRouter>
  </React.StrictMode>,
)