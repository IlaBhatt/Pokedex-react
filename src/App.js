import Homepage from './components/Homepage/Homepage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import PokemonDetail from './components/PokemonDetail/PokemonDetail';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/pokemon/:pokemonId' element={<PokemonDetail/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
