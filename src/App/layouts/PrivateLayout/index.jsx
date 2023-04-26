import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateLayout = ({children}) => {
    const authenticated = true
  return authenticated ? children : <Navigate to='/signin' replace={true}/>
    
  
}

export default PrivateLayout