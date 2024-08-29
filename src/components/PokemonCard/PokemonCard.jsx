import React from 'react'
import { getBgColor } from '../../utils/utils';

const PokemonCard = ({pokemon, onCardClick, cardName}) => {
    const gradientStyle = getBgColor(pokemon);
  return (
    <div style={gradientStyle} className="pokemon-card" onClick={() => onCardClick(pokemon.id)}>
        <img src={pokemon.sprites.front_shiny} className='pokemon-image' alt={pokemon.name}/>
        {cardName && 
        <>
         <h3 className='card-text'>{cardName}</h3>
         <h3>0{pokemon.id}</h3>
        </>
        }
    </div>
  )
}

export default PokemonCard;