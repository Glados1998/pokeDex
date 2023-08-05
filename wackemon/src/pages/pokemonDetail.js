import React , {useEffect , useState} from 'react';
import Axios from 'axios';
import {Link , useParams} from 'react-router-dom';

const PokemonDetail = () => {
    const { id } = useParams ();
    const [ pokemon , setPokemon ] = useState ( null );
    const [ learnableMoves , setLearnableMoves ] = useState ( [] );
    const [ movesCrossReferenced , setMovesCrossReferenced ] = useState ( [] );
    const [ evolutionChain , setEvolutionChain ] = useState ( null );

    const buildEvolutionChain = async (chain, arr = []) => {
        // Make a call to the species' Pokemon URL to get ID and image
        const response = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${chain.species.name}`);
        const data = response.data;
        arr.push({name: chain.species.name, id: data.id, image: data.sprites.other.dream_world.front_default});

        if (chain.evolves_to.length > 0) {
            await buildEvolutionChain(chain.evolves_to[0], arr);
        }

        return arr;
    }



    useEffect ( () => {
        Axios.get ( `https://pokeapi.co/api/v2/pokemon/${id}` )
            .then ( response => {
                setPokemon ( response.data );
                const moves = response.data.moves;
                setLearnableMoves ( moves );

                // get species details for evolution chain
                Axios.get ( response.data.species.url )
                    .then ( speciesResponse => {
                        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

                        // get evolution chain
                        Axios.get(evolutionChainUrl)
                            .then(async evolutionResponse => {
                                const chain = await buildEvolutionChain(evolutionResponse.data.chain);
                                setEvolutionChain(chain);
                            })

                        // get moves learned by Pokemon
                        const movePromises = moves.map ( move => Axios.get ( move.move.url ) );
                        Promise.all ( movePromises )
                            .then ( moveResponses => {
                                const moveData = moveResponses.map ( moveResponse => moveResponse.data );
                                const movesLearnedByCurrentPokemon = moveData.filter ( move => {
                                    return move.learned_by_pokemon.some ( poke => poke.name === response.data.name );
                                } );
                                setMovesCrossReferenced ( movesLearnedByCurrentPokemon );
                            } )
                            .catch ( error => console.error ( error ) );
                    } )
                    .catch ( error => console.error ( error ) );
            } )
            .catch ( error => console.error ( error ) );
    } , [ id ] );

    console.log ( "evolutionChain" , evolutionChain );


    return (
        <div>
            <div>
                {pokemon ? (
                    <>
                        <Link to={'/'}>Back to Pokedex</Link>
                        <div className="pokemon">
                            <div className="pokemon_body">
                                <div className="pokemon_body_left">
                                    <div className="pokemon_body_left_header">
                                        <h2 className="pokemon_body_left_header_name">{pokemon.name}</h2>
                                        <span className="pokemon_body_left_header_order">Number: {pokemon.order}</span>
                                    </div>
                                    <img className="pokemon_body_left_image"
                                         src={pokemon.sprites.other.dream_world.front_default}
                                         alt={pokemon.name}/>
                                    <div className="pokemon_body_left_stats">
                                        <h4>Stats:</h4>
                                        <div className="pokemon_body_left_stats_column">
                                            {pokemon.stats.map ( stat => (
                                                <div className="pokemon_body_left_stats_column_stat">
                                                    <h5>{stat.stat.name}</h5>
                                                    <p>{stat.base_stat}</p>
                                                </div>
                                            ) )}
                                        </div>
                                    </div>
                                </div>
                                <div className="pokemon_body_right">
                                    <div className="pokemon_body_right_details">
                                        <div className="pokemon_body_right_details_height-weight">
                                            <b>Height</b> <br/> <span> {pokemon.height}</span>
                                            <b>Weight</b> <br/> <span> {pokemon.weight}</span>
                                        </div>
                                        <div className="pokemon_body_right_details_abilities">
                                            <h4>Abilities:</h4>
                                            {pokemon.abilities.map ( ability => (
                                                <div
                                                    className="pokemon_body_right_details_abilities_ability">
                                                    {ability.ability.name}
                                                </div>
                                            ) )}
                                        </div>
                                    </div>
                                    <div className="pokemon_body_right_moves">
                                        <h4>All the moves {pokemon.name} can learn</h4>
                                        <div className="pokemon_body_right_moves_list">
                                            {movesCrossReferenced.map ( move => (
                                                <div className="pokemon_body_right_moves_list_move">
                                                    {move.name}
                                                </div>
                                            ) )}
                                        </div>
                                    </div>
                                    <div className="pokemon_body_right_types">
                                        <h4>Types:</h4>
                                        <div className="pokemon_body_right_types_list">
                                            {pokemon.types.map ( type => (
                                                <div
                                                    className="pokemon_body_right_types_list_type">{type.type.name}</div>
                                            ) )}
                                        </div>
                                    </div>
                                    <div className="pokemon_body_right_evolution">
                                        <h4>Evolution Chain:</h4>
                                        <div className="pokemon_body_right_evolution_pokemon">
                                        {evolutionChain && evolutionChain.map((pokemon, index) => (
                                            <div className="pokemon_body_right_evolution_pokemon_list"  key={index}>
                                                <h5>{pokemon.name}</h5>
                                                <div className="pokemon_body_right_evolution_pokemon_list_item">
                                                    <Link to={`/pokedex/${pokemon.id}`}>
                                                        <img src={pokemon.image} alt={pokemon.name}/>
                                                    </Link>
                                                    {index < evolutionChain.length - 1 && <span> evolves to </span>}
                                                </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default PokemonDetail;
