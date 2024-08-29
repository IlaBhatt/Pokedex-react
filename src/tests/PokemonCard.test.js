import React from 'react';
import { render, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PokemonCard from '../components/PokemonCard/PokemonCard';

jest.mock('../utils/utils', () => ({
    capitalizeFirstLetter: jest.fn((str) =>{
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }),
    getBgColor: jest.fn(() => ({ background: 'blue' }))
  }));

describe('PokemonCard Component', () => {
    const mockOnCardClick = jest.fn();
    const mockPokemon = {
        id: 1,
        name: 'Bulbasaur',
        sprites: {
            front_shiny: 'http://example.com/bulbasaur.png'
        }
    }
    beforeEach(()=> {
        render(
            <PokemonCard 
                pokemon={mockPokemon}
                onCardClick={mockOnCardClick}
                cardName={mockPokemon.name}/>
        )
    })
    test('renders Pokemon name and ID correctly', () => {
        const nameElement = screen.getByText('Bulbasaur');
        const idElement = screen.getByText('01');

        expect(nameElement).toBeInTheDocument();
        expect(idElement).toBeInTheDocument();
    });

    test('renders Pokemon image with correct src and alt text', () => {
        const expectedSrc = mockPokemon.sprites.front_shiny ;
        const expectedAlt  = mockPokemon.name;
        const img = screen.getByRole('img', {name : 'Bulbasaur'});
        expect(img).toHaveAttribute('src', expectedSrc);
        expect(img).toHaveAttribute('alt', expectedAlt);
    });

    test('calls onCardClick with correct ID when the card is clicked', () => {
        const {container} = render(
            <PokemonCard 
                pokemon={mockPokemon}
                onCardClick={mockOnCardClick}
                cardName={mockPokemon.name}/>
        );
        const card = container.querySelector('.pokemon-card');
        userEvent.click(card);
        expect(mockOnCardClick).toHaveBeenCalledWith(1);
    });
});