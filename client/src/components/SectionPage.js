import React from 'react'
import { useParams } from 'react-router-dom'
import Endgame from './Endgame'
function SectionPage() {
    const {head,subhead,page} = useParams();
  return (
    <div>
        
        <h1>{head}</h1>
        <h1>{subhead}</h1>
        <h1>{page}</h1>
    </div>
  )
}

export default SectionPage