import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { capitalizeFirstLetter, getBgColor } from '../../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { fetchPokemonDescription, fetchPokemonTraits } from '../../features/pokemonSlice';
import Modal from '../Modal/Modal';
import { colorMap } from '../../utils/colorMap';

const PokemonDetail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [readMore, setReadMore] = useState(false);
    const {pokemonId} = useParams();
    const {pokemonData,pokemonDescription, pokemonTraits} = useSelector((state)=> state.pokemon);
    const pokemonDataDetail = pokemonData.results.filter(function(pokemon) { return pokemon.details.id == pokemonId});
    const pokemonDetails = pokemonDataDetail[0].details;
    const gradientStyle = getBgColor(pokemonDetails);
    const colors= Object.values(colorMap);
    const applyRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    }
    useEffect(()=>{
        dispatch(fetchPokemonDescription(pokemonId));
        dispatch(fetchPokemonTraits(pokemonId));
    }, [pokemonId,dispatch]);
    let description='';
    let displayDescription='';
    if(Object.keys(pokemonDescription).length>0){
        pokemonDescription.flavor_text_entries.forEach((entry) => {
            if(entry.language.name === 'en') {
                const cleanedText = entry.flavor_text.replace(/\n/g, ' ');
                description= description.concat(cleanedText)
            }
        });
        displayDescription = description.slice(0,120);
    }
    const handleClose = () =>{
        navigate('/');
    }
    const toggleReadMore = () => {
        setReadMore(prev => !prev);
    }
  return (
    <div className='pokemon-detail-overlay'>
        <div className="pokemon-detail-container">
        {/* {readMore &&
            <Modal isOpen={readMore} onClose={toggleReadMore} title="Pokemon Description">
            <div className='read-more-content'>
                {description}
            </div>
            </Modal> 
        } */}
        { readMore && 
            <div className='popup-description'>
                {description}
            </div> 
        }
        <FontAwesomeIcon icon={faXmark} className='x-close' onClick={handleClose}/> 
        <div className='pokemon-header'>
            <h1>{pokemonDetails.name.toUpperCase()}</h1>
            <h1>0{pokemonDetails.id}</h1>
        </div>
        <div className='pokemon-detail'>
            <img style={gradientStyle} src={pokemonDetails.sprites.front_shiny} className='img-card'/>  
            <div className='description-container'>
                <p className='description'>{displayDescription}...</p>
                <button className='read-more' onClick={toggleReadMore}>Read more</button>
            </div>
        </div>
        <div className='characterstic-container'>
            <div className='characterstics-1'>
                <p className='char-group'>
                    <h2>Height</h2>
                    <p className='char-group-item'>{pokemonDetails.height}</p>
                </p>
                <p className='char-group'>
                    <h2>Gender(s)</h2>
                    <p className='char-group-item'>Male</p>
                </p>
                <p className='char-group'>
                    <h2>Abilities</h2>
                    <div className='char-group-item'>
                    {pokemonDetails.abilities.map((item, index) => (
                            <span key={index} style={{marginRight: '0.2rem'}}>
                                {capitalizeFirstLetter(item.ability.name)}{index < pokemonDetails.abilities.length - 1 && ','}
                            </span>
                    ))}
                    </div>
                </p>
                <p className='char-group'>
                    <h2>Weakest Against</h2>
                    <div className='char-group-item'>
                        {pokemonTraits?.double_damage_from.map((item, index) => (
                            <span key={index} style={{marginRight: '0.3rem', backgroundColor : applyRandomColor()}} className='char-group-box'>
                                {capitalizeFirstLetter(item.name)}
                            </span>
                        ))}
                    </div>
                </p>
            </div>
            <div className='characterstics-2'>
                <p className='char-group'>
                    <h2>Weight</h2>
                    <p className='char-group-item'>{pokemonDetails.weight}Kg</p>
                </p>
                <p className='char-group'>
                    <h2>Egg Groups</h2>
                    <div className='char-group-item'>
                        {Object.keys(pokemonDescription).length>0 && pokemonDescription.egg_groups.map((item, index) => (
                            <span key={index} style={{marginRight: '0.2rem'}}>
                                {capitalizeFirstLetter(item.name)}{index < pokemonDescription.egg_groups.length - 1 && ','}
                            </span>
                        ))}
                    </div>
                </p>
                <p className='char-group'>
                    <h2>Types</h2>
                    <div className='char-group-item'>
                        {pokemonDetails && pokemonDetails.types.map((item, index) => (
                            <span key={index} style={{marginRight: '0.3rem', backgroundColor: applyRandomColor()}} className='char-group-box'>
                                {capitalizeFirstLetter(item.type.name)}{index < pokemonDetails.types.length - 1 && ','}
                            </span>
                        ))}
                    </div>
                </p>
            </div>
            </div>
            <div className='stats'>
                <h1 style={{marginBottom: '0.5rem'}}>Stats</h1>
                {pokemonDetails && pokemonDetails.stats.map(item => (
                    < div key={pokemonDetails.id} className='stat-progress'>
                        <label>{item.stat.name.toUpperCase()}</label>
                        <progress value={item.base_stat/100} className='progress-bar'/>
                    </div>
                ))}
            </div>
            <div className='evolution-chain-container'>
                <h1>Evolution Chain</h1>  
                <div className='evolution-chain'>
                    {
                        pokemonData.results.slice(pokemonId-3 >= 0 ? pokemonId-3 : 0, pokemonId).map((pokemonData, index) =>
                        <div className='img'>
                            <img style={getBgColor(pokemonData.details)} src={pokemonData.details.sprites.front_shiny} className='img-card' key={index}/>
                            {index!==2  && <FontAwesomeIcon icon={faArrowRight} className='right-arrow'/>}
                        </div>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default PokemonDetail