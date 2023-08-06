import React , {useContext , useEffect , useState} from "react";
import Axios from "axios";
import CardArena from "../components/pokemon-card-lobby";
import {PokemonContext} from "../context/context";
import {Link} from "react-router-dom";

const ArenaLobby = () => {
    const {
        selectedPokemon , errorMsg , addPokemonToArena , removePokemonFromArena , resetSelection , dispatch
    } = useContext ( PokemonContext );
    const [ pokemonList , setPokemonList ] = useState ( [] );
    const [ pokemonDetails , setPokemonDetails ] = useState ( [] );
    const [ filteredPokemon , setFilteredPokemon ] = useState ( [] );
    const [ isLoading , setIsLoading ] = useState ( false );
    const [ searchQuery , setSearchQuery ] = useState ( '' );

    useEffect ( () => {
        setIsLoading ( true );
        Axios.get ( 'https://pokeapi.co/api/v2/pokemon/?limit=100' )
            .then ( response => {
                setPokemonList ( response.data.results );
            } )
            .catch ( error => console.error ( error ) )
            .finally ( () => setIsLoading ( false ) );
    } , [] );

    useEffect ( () => {
        setIsLoading ( true );
        const promises = pokemonList.map ( pokemon => Axios.get ( pokemon.url ) );
        Promise.all ( promises )
            .then ( responses => {
                let pokemonDetails = responses.map ( response => response.data );
                setPokemonDetails ( pokemonDetails );
                setFilteredPokemon ( pokemonDetails );
            } )
            .catch ( error => console.error ( error ) )
            .finally ( () => setIsLoading ( false ) );
    } , [ pokemonList ] );


    const handleSearch = (query) => {
        if ( query === '' ) {
            setFilteredPokemon ( pokemonDetails );
            return;
        }

        const result = pokemonDetails.filter (
            (pokemon) =>
                pokemon.name.toLowerCase ().includes ( query.toLowerCase () ) ||
                pokemon.order === Number ( query )
        );

        setFilteredPokemon ( result );
    };

    const startBattle = () => {
        if ( selectedPokemon.length > 6 ) {
            errorMsg ( 'You need to select 6 pokemons to start the battle' )
            return;
        }
    };


    return (
        <div>
            <h1>Arena Lobby</h1>
            {errorMsg && <p>{errorMsg}</p>}
            <div>
                {selectedPokemon.length > 0 && (
                    <div className="arena-slots">
                        <div className="arena-slots_header">
                            <h2>Selected Pokemons</h2>
                        </div>
                        <div className="arena-slots_list">
                            {selectedPokemon.length > 0 ? (
                                selectedPokemon.map((pokemon, index) => (
                                    <div className="arena-slots_list-item" key={index}>
                                        <CardArena {...pokemon}
                                                   image={pokemon.sprites?.other?.dream_world?.front_default || 'https://static.wikia.nocookie.net/pokemon-fano/images/6/6f/Poke_Ball.png/revision/latest?cb=20140520015336'}/>
                                        <button
                                            className="arena-slots_list-item_action btn-danger"
                                            onClick={() => removePokemonFromArena(pokemon)}>
                                            Remove {pokemon.name}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div>No Pokémon selected. Please select a Pokémon to proceed.</div>
                            )}
                        </div>
                        <div className="arena-slots_actions">
                            {selectedPokemon.length === 6 && (
                                <Link className="btn-success" onClick={startBattle}
                                      disabled={selectedPokemon.length < 6} to={"/arena"}>Start Battle</Link>
                            )}
                            <button className="btn btn-danger" onClick={resetSelection}>Reset Selection</button>
                        </div>
                    </div>
                )}
                <div>
                    <input
                        type="text"
                        placeholder="Search by name or order"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery ( e.target.value );
                            handleSearch ( e.target.value );
                        }}
                    />
                </div>
                <div className="list-grid">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        filteredPokemon.map ( (pokemon) => (
                            <CardArena
                                {...pokemon}
                                image={pokemon.sprites.other.dream_world.front_default}
                                onClick={() => addPokemonToArena ( pokemon )}
                            />
                        ) )
                    )}

                </div>
            </div>
        </div>
    );
};

export default ArenaLobby;
