import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPokemonData, fetchPokemonStats, fetchMoreData, fetchPokemonGender } from '../../features/pokemonSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import PokemonCard from '../PokemonCard/PokemonCard';
import { useNavigate } from 'react-router-dom';
import FilterComponent from '../FilterComponent/FilterComponent';
import Modal from '../Modal/Modal';
import InfiniteScroll from 'react-infinite-scroll-component';
import { colorMap } from '../../utils/colorMap';
import MultiSelectDropdown from '../MultiSelectDropdown/MultiSelectDropdown';
import { capitalizeFirstLetter } from '../../utils/utils';

const Homepage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedGenders, setSelectedGenders] = useState([]);
    const [selectedStats, setSelectedStats] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const {pokemonData, isLoading, isError, totalResults, next, gender, stats} = useSelector(state => state.pokemon);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const filters = ["Type", "Gender", "Stats"];

    useEffect(()=> { 
      dispatch(fetchPokemonData());
      dispatch(fetchPokemonGender());
      dispatch(fetchPokemonStats());
    } ,[dispatch]);

    useEffect(() => {
      const applyFilters = () => {
          let filteredData = pokemonData.results.filter(item => {
            const pokemonTypes = item.details.types.map(type => type.type.name);
            const pokemonStats = item.details.stats.map(stat => stat.stat.name);
            const matchedTypes = selectedTypes.length === 0 || selectedTypes.some(type => pokemonTypes.includes(type.value));
            const matchedStats = selectedStats.length === 0 || selectedStats.some(stat => pokemonStats.includes(stat.value));
      
            return matchedTypes && matchedStats && (searchTerm === '' || item.name.includes(searchTerm) || item.details.id.toString().includes(searchTerm));
        });
        console.log('Filtered data ',filteredData );
        setFilteredData(filteredData);
      };
    applyFilters();
  },[selectedTypes, selectedStats, searchTerm, pokemonData]);

    const types = Object.keys(colorMap);
    let typeOptions=[];
    let genderOptions= [];
    let statsOptions= [];
    types.forEach(type => {
      let optionObject = {
        label: capitalizeFirstLetter(type),
        value: type
      };
      typeOptions.push(optionObject);
    });
    gender?.forEach(gender => {
      let optionObject = {
        label: capitalizeFirstLetter(gender.name),
        value: gender.name
      };
      genderOptions.push(optionObject);
    });
    stats?.forEach(stat => {
      let optionObject = {
        label: capitalizeFirstLetter(stat.name),
        value: stat.name
      };
      statsOptions.push(optionObject);
    })

  const onCardClick = (id) => {
    navigate(`/pokemon/${id}`);
  }

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleFilter = () => {
    setShowFilter(true);
  }

  const handleCloseModal = () => {
    setShowFilter(false);
  }

  const fetchMore = () => {
      dispatch(fetchMoreData(next));
  };

  if(isLoading){
    return <p>Loading...</p>
  }
  if(isError){
    return <p>An error has occured!</p>
  }
  return (
    <div>
        <Modal isOpen={showFilter} onClose={handleCloseModal} title="Filters">
            <FilterComponent filteredData= {filteredData} setFilteredData={setFilteredData}/>
        </Modal>
        <header className='main-header'>
            <h1>Pokedex</h1>
            <hr/>
            <p className='search-text'>Search for any Pokemon that exists on the planet</p>
        </header>
        <div className='user-actions'>
            <div className='search-container'>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                <input type="text" name="search-form" className="search-input"
                placeholder="Name or Number" value={searchTerm} onChange={handleChange}/>
            </div>
            <button className='filter-btn' onClick={handleFilter}>
                <FontAwesomeIcon icon={faFilter}/>
            </button>
            <div className='filters'>
                {filters.map((filter, index) => (
                  <div className='filter-type' key={index}>
                  {filter === "Type" && <MultiSelectDropdown title={filter} options={typeOptions} selected={selectedTypes} setSelected={setSelectedTypes}/>}
                  {filter === 'Gender' && <MultiSelectDropdown title={filter} options={genderOptions} selected={selectedGenders} setSelected={setSelectedGenders}/>}
                  {filter === 'Stats' && <MultiSelectDropdown title={filter} options={statsOptions} selected={selectedStats} setSelected={setSelectedStats}/>}
                  </div>
                ))}
            </div>
        </div>

        <div id="scrollableDiv">
          <InfiniteScroll
            dataLength={pokemonData.results.length}
            next={fetchMore}
            hasMore={totalResults > pokemonData?.results?.length}
            scrollableTarget='scrollableDiv'
            loader={<div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <h4>Loading...</h4>
                    </div>}
          >
            <div className='card-container'>
            {filteredData.map(pokemon => (
                <PokemonCard 
                  key={pokemon.details.id} 
                  pokemon={pokemon.details} 
                  onCardClick={onCardClick} 
                  cardName={capitalizeFirstLetter(pokemon.details.name)}/>
            )) }
            </div>
          </InfiniteScroll>
        </div>
    </div>
  )
}

export default Homepage;