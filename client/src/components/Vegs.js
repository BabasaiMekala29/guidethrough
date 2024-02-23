import React from 'react'
import Endgamee from './Endgamee'
import LoginPage from './LoginPage'

function sample({username}) {
    console.log("sample ",username)
  return (
    <div>
        {username?<Endgamee />:<LoginPage />}
    </div>
  )
}

export default sample