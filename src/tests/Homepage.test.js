import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import Homepage from '../components/Homepage/Homepage';
import '@testing-library/jest-dom';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  }));

describe('Homepage Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      pokemon: {
        pokemonData: { results: [], totalResults: 0, next: null },
        isLoading: false,
        isError: false,
        gender: [],
        stats: []
      }
    });

    store.dispatch = jest.fn();
  });

  test('renders loading state correctly', () => {
    store = mockStore({
      pokemon: {
        isLoading: true,
        isError: false,
        pokemonData: { results: [], totalResults: 0, next: null },
        gender: [],
        stats: []
      }
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Homepage />
        </MemoryRouter>
      </Provider>
    );
    const element = getByText('Loading...');
    expect(element).toBeInTheDocument();
  });

  test('handles search input changes', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Homepage />
        </MemoryRouter>
      </Provider>
    );

    const input = getByPlaceholderText('Name or Number');
    fireEvent.change(input, { target: { value: 'Bulbasaur' } });
    expect(input.value).toBe('Bulbasaur');
  });

  test('navigates to Pokemon detail on card click', () => {
    const navigate = useNavigate();
    store = mockStore({
        pokemon: {
          pokemonData: { results: [{name: 'Bulbasaur', details : { id : 1, types: [{type: {name: 'grass'}}], stats: [{stat:{name: 'hp'}}] } }, {name: 'Ivysaur', details : { id : 1, types: [{type: {name: 'grass'}}], stats: [{stat:{name: 'hp'}}] } }]},
          isLoading: false,
          isError: false,
          totalResults: 2,
          next: null
        }
      });
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Homepage />
        </MemoryRouter>
      </Provider>
    );
    const element = getByText("Bulbasaur");
    fireEvent.click(element);
    expect(navigate).toHaveBeenCalledWith('/pokemon/1');
  });

});