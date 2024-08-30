import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { colorMap } from '../../utils/colorMap';
import { capitalizeFirstLetter } from '../../utils/utils';

const FilterComponent = ({filteredData, setFilteredData}) => {
    const filters = ["Type", "Gender", "Stats"];
    const [selected, setSelected] = useState(null);
    const { gender, stats } = useSelector((state) => state.pokemon);
    const types = Object.keys(colorMap);
    let typeCheckboxInitial={};
    let genderCheckboxInitial= {};
    let statsCheckboxInitial= {};

    types.forEach(type => {
        typeCheckboxInitial[[type]] = false;
    })
    gender.forEach(gender => {
        genderCheckboxInitial[[gender.name]] = false;
    })
    stats.forEach(stat => {
        statsCheckboxInitial[[stat.name]] = false;
    })
    
    const [typeCheckboxes, setTypeCheckboxes] = useState(typeCheckboxInitial);
    const [genderCheckboxes, setGenderCheckboxes] = useState(genderCheckboxInitial);
    const [statsCheckboxes, setStatsCheckboxes] = useState(statsCheckboxInitial);

    const toggle = (index) => {
        if(selected === index){
            setSelected(null);
        }
        setSelected(index);
    }

    const handleChangeType = (event) => {
        const {name, checked} = event.target;
        setTypeCheckboxes(prev => ({
            ...prev,
            [name]: checked
        }));
    }

    const handleChangeGender = (event) => {
        const {name, checked} = event.target;
        setGenderCheckboxes(prev => ({
            ...prev,
            [name]: checked
        }));
    }

    const handleChangeStat = (event) => {
        const {name, checked} = event.target;
        setStatsCheckboxes(prev => ({
            ...prev,
            [name]: checked
        }));
    }

    const deselectAll = () => {
        setTypeCheckboxes(typeCheckboxInitial);
        setGenderCheckboxes(genderCheckboxInitial);
        setStatsCheckboxes(statsCheckboxInitial);
    }

    const applyAll = () => {
        const selectedTypes = Object.keys(typeCheckboxes).filter(type => typeCheckboxes[type] === true);
        const selectedStats = Object.keys(statsCheckboxes).filter(stat => statsCheckboxes[stat] === true);
        let filterData = filteredData.filter(item => {
            const pokemonTypes = item.details.types.map(type => { return type.type.name});
            const pokemonStats = item.details.stats.map(stat => { return stat.stat.name});
            const matchedTypes = selectedTypes.length === 0 || selectedTypes.some(type => pokemonTypes.includes(type));
            const matchedStats = selectedStats.length === 0 || selectedStats.some(stat => pokemonStats.includes(stat));
      
            return matchedTypes && matchedStats;
        });
        console.log('Filtered data ',filteredData );
        setFilteredData(filterData);
        
    }

  return (
        <div className='accordion'>
            {filters.map((filter, index) => (
                <div className='item' onClick={() => toggle(index)}>
                    <div className='title'>
                        <h2>{filter}</h2>
                        <h1>{selected === index ? '-' : '+'}</h1>
                    </div>
                    <div className={selected === index ? 'content show': 'content'}>
                        {filter === 'Type' && <div className='type-items'>
                            {types.map((type) => (
                                <label className='type-item'>
                                    <input type='checkbox' name={type} checked={typeCheckboxes[type]} onChange={(e) => handleChangeType(e)} style={{marginRight: '3px'}}/>
                                    {capitalizeFirstLetter(type)}
                                </label>
                            ))}
                        </div>}
                        {filter === 'Gender' && <div className='type-items'>
                            {gender.map((type) => (
                                <label className='type-item'>
                                    <input type='checkbox' name={type.name} checked={genderCheckboxes[type.name]} onChange={(e) => handleChangeGender(e)} style={{marginRight: '3px'}}/>
                                    {capitalizeFirstLetter(type.name)}
                                </label>
                            ))}
                        </div>}
                        {filter === 'Stats' && <div className='type-items'>
                            {stats.map((type) => (
                                <label className='type-item'>
                                    <input type='checkbox' name={type.name} checked={statsCheckboxes[type.name]} onChange={(e) => handleChangeStat(e)} style={{marginRight: '3px'}}/>
                                    {capitalizeFirstLetter(type.name)}
                                </label>
                            ))}
                        </div>}
                    </div>
                </div>
            )
            )}
            <div className='btn-list'>
                <button className='reset-btn' onClick={deselectAll}>Reset</button>
                <button className='apply-btn' onClick={applyAll}>Apply</button>
            </div>
        </div>
  );
}

export default FilterComponent