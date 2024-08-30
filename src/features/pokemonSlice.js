import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPokemonData = createAsyncThunk('fetchPokemonData', async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
    const initialData = await response.json();

    // Nested API calls based on initial data
    const nestedCalls = initialData.results.map(item =>
      fetch(`${item.url}`).then(res => res.json())
    );

    // Wait for all nested calls to complete
    const nestedResults = await Promise.all(nestedCalls);

    const combinedData = initialData.results.map((item, index) => ({
      ...item,
      details: nestedResults[index]
    }));
    initialData.results = combinedData;
    return initialData;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
});

export const fetchPokemonDescription = createAsyncThunk('fetchPokemonDescription', async(param) => {
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${param}`);
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error('Failed to fetch data');
    }
})

export const fetchPokemonGender = createAsyncThunk('fetchPokemonGender', async() => {
    try{
        const response = await fetch('https://pokeapi.co/api/v2/gender');
        const {results} = await response.json();
        return results;
    }catch(error){
        throw new Error('Failed to fetch data');
    }
})

export const fetchPokemonStats = createAsyncThunk('fetchPokemonStats', async() => {
    try{
        const response = await fetch('https://pokeapi.co/api/v2/stat');
        const {results} = await response.json();
        return results;
    }catch(error){
        throw new Error('Failed to fetch data');
    }
})

export const fetchPokemonTraits = createAsyncThunk('fetchPokemonTraits', async(param) => {
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/type/${param}`);
        const {damage_relations} = await response.json();
        return damage_relations;
    }catch(error){
        throw new Error('Failed to fetch data');
    }
})

export const fetchMoreData = createAsyncThunk('fetchMoreData', async (url) => {
    try{
      const response = await fetch(url);
      const data = await response.json();

      const nestedCalls = data.results.map(item =>
        fetch(`${item.url}`).then(res => res.json())
      );
        const nestedResults = await Promise.all(nestedCalls);
  
      const combinedData = data.results.map((item, index) => ({
        ...item,
        details: nestedResults[index]
      }));
      data.results = combinedData;
      return data;
    }catch(error){
        throw new Error('Failed to fetch more data');
    }
});

const initialState = {
    pokemonData: {
        results: [],
        count: 0,
        next: null
    },
    pokemonDescription: {},
    gender: null,
    stats: null,
    pokemonTraits: null,
    isLoading: false,
    isError: false,
    totalResults: null,
    next: null
};

export const pokemonSlice = createSlice({
    name: "pokemon",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchPokemonData.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPokemonData.rejected,(state, action) => {
            console.log('Error', action.payload);
            state.isError=true;
        });
        builder.addCase(fetchPokemonData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.pokemonData.count = action.payload.count;
            state.pokemonData.next = action.payload.next;
            state.pokemonData.results = action.payload.results;
            state.totalResults = action.payload.count;
            state.next = action.payload.next;
        })
        builder.addCase(fetchPokemonDescription.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPokemonDescription.rejected,(state, action) => {
            console.log('Error', action.payload);
            state.isError=true;
        });
        builder.addCase(fetchPokemonDescription.fulfilled, (state, action) => {
            state.isLoading = false;
            state.pokemonDescription = action.payload;
        })
        builder.addCase(fetchPokemonGender.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPokemonGender.rejected,(state, action) => {
            console.log('Error', action.payload);
            state.isError=true;
        });
        builder.addCase(fetchPokemonGender.fulfilled, (state, action) => {
            state.isLoading = false;
            state.gender = action.payload;
        });
        builder.addCase(fetchPokemonStats.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPokemonStats.rejected,(state, action) => {
            console.log('Error', action.payload);
            state.isError=true;
        });
        builder.addCase(fetchPokemonStats.fulfilled, (state, action) => {
            state.isLoading = false;
            state.stats = action.payload;
        });
        builder.addCase(fetchPokemonTraits.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPokemonTraits.rejected,(state, action) => {
            console.log('Error', action.payload);
            state.isError=true;
        });
        builder.addCase(fetchPokemonTraits.fulfilled, (state, action) => {
            state.isLoading = false;
            state.pokemonTraits = action.payload;
        });
        builder.addCase(fetchMoreData.rejected,(state, action) => {
            console.log('Error', action.payload);
            state.isError=true;
        });
        builder.addCase(fetchMoreData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.pokemonData.results = [ ...state.pokemonData.results, ...action.payload.results];
            state.next = action.payload.next;
        });
    }

})

export const {addPokemonData} = pokemonSlice.actions;
export default pokemonSlice.reducer;
