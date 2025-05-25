import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './DetallePokemon.css';

function DetallePokemon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [allPokemon, setAllPokemon] = useState([]);
  const [showAll, setShowAll] = useState(!id); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (id) {
      async function fetchPokemon() {
        setLoading(true);
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          if (!res.ok) throw new Error("Pokémon no encontrado");
          const data = await res.json();
          setPokemon({
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
            stats: data.stats.map(stat => ({
              name: stat.stat.name,
              value: stat.base_stat,
            })),
          });
          setShowAll(false); 
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchPokemon();
    }
  }, [id]);

  
  useEffect(() => {
    if (showAll) {
      async function fetchAllPokemon() {
        setLoading(true);
        try {
          const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
          const data = await res.json();
          const pokemonWithIds = data.results.map((p, index) => ({
            ...p,
            id: index + 1
          }));
          setAllPokemon(pokemonWithIds);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchAllPokemon();
    }
  }, [showAll]);

  const handleShowAll = () => {
    navigate('/pokemon'); 
    setShowAll(true);
    setPokemon(null);
    setError(null);
  };

  const handlePokemonClick = (pokemonId) => {
    navigate(`/pokemon/${pokemonId}`);
  };

  const handleGoBack = () => {
    navigate('/pokemon');
    setShowAll(true);
    setPokemon(null);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      {!showAll ? (
        <button 
          onClick={handleShowAll}
          style={{
            padding: '8px 16px',
            margin: '10px 0',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ver Todos
        </button>
      ) : (
        <button 
          onClick={handleGoBack} 
          style={{
            padding: '8px 16px',
            margin: '10px 0',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Volver
        </button>
      )}

{pokemon && !showAll && (
  <div className="pokemon-detail-container">


    <h2 className="pokemon-name">{pokemon.name} #{pokemon.id}</h2>
    <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />

    <div className="stats-section">
      <h3>Estadísticas:</h3>
      {pokemon.stats.map((stat, idx) => (
        <div key={idx} className="stat-row">
          <span className="stat-name">{stat.name}</span>
          <span className="stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  </div>
)}


      {showAll && (
        <div>
          <h1>Todos los Pokémon</h1>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '20px',
            padding: '20px 0'
          }}>
            {allPokemon.map((p) => (
              <div 
                key={p.id} 
                onClick={() => handlePokemonClick(p.id)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  ':hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} 
                  alt={p.name}
                  style={{ width: '100px', height: '100px' }}
                />
                <p style={{ margin: '5px 0 0', fontWeight: 'bold' }}>
                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </p>
                <p style={{ margin: 0, color: '#666' }}>#{p.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DetallePokemon;