import React , {useEffect , useState} from "react"
import Axios from "axios"
import Card from "../components/pokemon-card";

const Pokedex = () => {
    const [ pokemonList , setPokemonList ] = useState ( [] );
    const [ pokemonDetails , setPokemonDetails ] = useState ( [] );
    const [ filteredPokemon , setFilteredPokemon ] = useState ( [] );
    const [ isLoading , setIsLoading ] = useState ( false );
    const [ searchQuery , setSearchQuery ] = useState ( '' );

    useEffect ( () => {
        setIsLoading ( true );
        Axios.get ( 'https://pokeapi.co/api/v2/pokemon/?limit=40' )
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
                setPokemonDetails ( responses.map ( response => response.data ) );
                setFilteredPokemon ( responses.map ( response => response.data ) );
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

    return (
        <div>
            <h1>Pokedex</h1>
            <div>
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
                            <Card
                                {...pokemon}
                                stats={pokemon.stats}
                                image={pokemon.sprites.other.dream_world.front_default}
                            />
                        ) )
                    )}
                    <div className="lst-pagination">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pokedex;
