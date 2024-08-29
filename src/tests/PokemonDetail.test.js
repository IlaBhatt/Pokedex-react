import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import PokemonDetail from '../components/PokemonDetail/PokemonDetail'; 
import '@testing-library/jest-dom';
import pokemonReducer from '../features/pokemonSlice';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ pokemonId: '1' }),
  useNavigate: () => jest.fn()
}));

jest.mock('../utils/utils', () => ({
    capitalizeFirstLetter: jest.fn((str) =>{
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }),
    getBgColor : jest.fn( () => {{background: 'blue'}})
}));

describe('PokemonDetail Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        pokemon: pokemonReducer
      },
      preloadedState: {
        pokemon: {
          pokemonData: {
            results: [{
              details: {
                id: '1',
                name: 'Bulbasaur',
                sprites: { front_shiny: 'url' },
                height: '7',
                weight: '69',
                abilities: [{ ability: { name: 'overgrow' } }],
                stats: [{ stat: { name: 'speed', base_stat: 45 } }]
              }
            }]
          },
          pokemonDescription: { flavor_text_entries: [{ language: { name: 'en' }, flavor_text: 'A strange seed was planted.' }] },
          pokemonTraits: { double_damage_from: [{ name: 'fire' }] }
        }
      }
    });
  });

  test('renders and fetches data correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/pokemon/1']}>
          <Routes>
            <Route path="/pokemon/:pokemonId" element={<PokemonDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const pokemonTitle= screen.getByText('BULBASAUR');
      const readMore = screen.getByText('Read more')
      expect(pokemonTitle).toBeInTheDocument();
      expect(readMore).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Read more'));
    const readMoreText = screen.getByText('A strange seed was planted.');
    expect(readMoreText).toBeInTheDocument();
  });

  test('closes modal and navigates on close icon click', () => {
    const navigate = useNavigate();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <PokemonDetail />
        </MemoryRouter>
      </Provider>
    );
    const closeBtn = container.querySelector('.x-close');
    userEvent.click(closeBtn);
    waitFor ( () => { 
        expect(navigate).toHaveBeenCalled('/');
    });
  });

});
