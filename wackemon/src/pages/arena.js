import React , {useContext , useEffect , useState} from "react";
import {PokemonContext} from "../context/context";
import CardArena from "../components/pokemon-card-arena";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';
const Arena = () => {

    const { selectedPokemon , setSelectedPokemon } = useContext ( PokemonContext );
    const { resetSelection } = useContext(PokemonContext);
    const [ playerTeam , setPlayerTeam ] = useState ( selectedPokemon );
    const [ adversaryTeam , setAdversaryTeam ] = useState ( [] );
    const [ playerTurn , setPlayerTurn ] = useState ( false );
    const [ playerMoves , setPlayerMoves ] = useState ( [] );
    const [ adversaryMoves , setAdversaryMoves ] = useState ( [] );
    const [ activePokemon , setActivePokemon ] = useState ( playerTeam[0] );
    const [ activeAdversaryPokemon , setActiveAdversaryPokemon ] = useState ( adversaryTeam[0] );
    let navigate = useNavigate();


    useEffect ( () => {

        // Fetch 6 random Pokémon for the adversary team
        const fetchPokemon = async () => {
            try {
                const response = await Axios.get ( 'https://pokeapi.co/api/v2/pokemon/?limit=40' );
                const allPokemon = response.data.results;
                const responses = await Promise.all ( allPokemon.map ( pokemon => Axios.get ( pokemon.url ) ) );
                const detailedPokemon = responses.map ( response => response.data );

                let adversaryPokemon = [];
                while (adversaryPokemon.length < 6) {
                    let randomIndex = Math.floor ( Math.random () * detailedPokemon.length );
                    let selectedPokemonForAdversary = detailedPokemon[randomIndex];

                    if ( !adversaryPokemon.some ( p => p.id === selectedPokemonForAdversary.id ) ) {
                        adversaryPokemon.push ( selectedPokemonForAdversary );
                    }
                }
                setAdversaryTeam ( adversaryPokemon );
            } catch (error) {
                console.error ( error );
            }
        };

        fetchPokemon ();
    } , [] );

    useEffect ( () => {
        if ( activePokemon === null ) {
            // All player's Pokémon have been defeated
            alert ( "Your team was defeated! Redirecting to the lobby." );
            resetSelection(); // Resetting the selection
            navigate( "/" );
        } else if ( activeAdversaryPokemon === null ) {
            // All adversary's Pokémon have been defeated
            alert ( "You won! Redirecting to the lobby." );
            resetSelection(); // Resetting the selection
            navigate( "/" );
        }
    } , [ activePokemon , activeAdversaryPokemon, resetSelection ] );

    // Set the active Pokémon for the player and the adversary
    useEffect ( () => {
        let initialPlayerTurn = true;

        if ( activePokemon && activeAdversaryPokemon ) {
            const playerSpeed = activePokemon.stats.find ( stat => stat.stat.name === "speed" ).base_stat;
            const adversarySpeed = activeAdversaryPokemon.stats.find ( stat => stat.stat.name === "speed" ).base_stat;
            initialPlayerTurn = playerSpeed > adversarySpeed;
        }

        setPlayerTurn ( initialPlayerTurn );
    } , [ activePokemon , activeAdversaryPokemon ] );

    // Handle the adversary turn
    useEffect ( () => {
        if ( !playerTurn && adversaryMoves.length ) {
            const randomMove = adversaryMoves[Math.floor ( Math.random () * adversaryMoves.length )];
            handleAdversaryMove ( randomMove ).then ( r =>
                !r && setPlayerTurn ( true ) );
        } else {
            setPlayerTurn ( true );
        }
    } , [ playerTurn , adversaryMoves ] );

    // Select 4 random moves for the player and the adversary
    useEffect ( () => {
        if ( selectedPokemon[0] && selectedPokemon[0].moves ) {
            setPlayerMoves ( selectRandomMoves ( selectedPokemon[0].moves ) );
        }
        if ( adversaryTeam[0] && adversaryTeam[0].moves ) {
            setAdversaryMoves ( selectRandomMoves ( adversaryTeam[0].moves ) );
        }
    } , [ selectedPokemon , adversaryTeam ] );

    // Select 4 random moves from the list of moves
    const selectRandomMoves = (pokemonMoves) => {
        const selectedMoves = [];
        while (selectedMoves.length < 4) {
            const randomIndex = Math.floor ( Math.random () * pokemonMoves.length );
            if ( !selectedMoves.includes ( pokemonMoves[randomIndex] ) ) {
                selectedMoves.push ( pokemonMoves[randomIndex].move.name );
            }
        }
        return selectedMoves;
    };

// Handle the player turn
    const handlePlayerMove = async (moveName) => {
        try {
            const moveDetailsResponse = await Axios.get ( `https://pokeapi.co/api/v2/move/${moveName}` );
            const moveData = moveDetailsResponse.data;

            const damage = moveData.power || 10;
            setAdversaryTeam ( prevAdversary => {
                const updatedAdversary = [ ...prevAdversary ];
                updatedAdversary[0].stats[0].base_stat -= damage;
                if ( updatedAdversary[0].stats[0].base_stat <= 0 ) {
                    // Remove the Pokémon whose HP went below or equals to 0
                    updatedAdversary.shift ();

                    // If there's a next Pokémon in adversaryTeam, make it active
                    if ( updatedAdversary.length > 0 ) {
                        setActiveAdversaryPokemon ( updatedAdversary[0] );
                    } else {
                        setActiveAdversaryPokemon ( null );
                        // If needed, handle the condition where all adversary Pokémon are defeated
                    }
                }
                return updatedAdversary;
            } );
            // After the move, switch turn to the adversary turns
            setPlayerTurn ( false );

        } catch (error) {
            console.error ( "Failed to fetch move details:" , error );
        }
    };

    // Handle the adversary turn (random move) and substraction of HP from the player's active Pokémon
    const handleAdversaryMove = async (moveName) => {
        try {
            const moveDetailsResponse = await Axios.get ( `https://pokeapi.co/api/v2/move/${moveName}` );
            const moveData = moveDetailsResponse.data;

            const damage = moveData.power || 10;

            setPlayerTeam ( prevTeam => {
                const updatedTeam = [ ...prevTeam ];

                // Deduct the HP of the active Pokémon
                updatedTeam[0].stats[0].base_stat -= damage;

                // If the active Pokémon's HP is 0 or below
                if ( updatedTeam[0].stats[0].base_stat <= 0 ) {
                    // Remove the Pokémon from the team
                    updatedTeam.shift ();

                    // Log for debugging

                    // If there are Pokémon left, the next one becomes the active Pokémon
                    if ( updatedTeam.length > 0 ) {
                        setActivePokemon ( updatedTeam[0] );
                    } else {
                        // If all Pokémon are defeated, set active Pokémon to null
                        setActivePokemon ( null );
                    }
                }

                return updatedTeam;
            } );

        } catch (error) {
            console.error ( "Failed to fetch move details:" , error );
        }
    };
    console.log ( " team player Pokémon of top:" , playerTeam)
    console.log ( "team opponent Pokémon of top:", adversaryTeam)
    console.log ( "Active Pokémon of player:", activePokemon)
    console.log ( "Active Pokémon of opponent:", activeAdversaryPokemon)

    // Get the unique moves for the player and the adversary
    const uniqueMoves = [ ...new Set ( playerMoves ) ];

    return (
        <div>
            <div className="arena">
                <div className="arena_header">
                    <h1>Arena</h1>
                </div>
                <div className="arena_body">
                    <div className="arena_body_pokemon">
                        <div className="arena_body_pokemon_header">
                            <h2>Your Team</h2>
                        </div>
                        <div className="arena_body_pokemon_list">
                            {playerTeam.map ( pokemon => (
                                <CardArena key={pokemon.id} {...pokemon}
                                           image={pokemon.sprites.other.dream_world.front_default}/>
                            ) )}
                        </div>
                    </div>
                    <div className="arena_body_arena_message">

                    </div>
                    <div className="arena_body_pokemon-rigth">
                        <div className="arena_body_pokemon_header">
                            <h2>Adversary Team</h2>
                        </div>
                        <div className="arena_body_pokemon_list">
                            {adversaryTeam.map ( pokemon => (
                                <CardArena key={pokemon.id} {...pokemon}
                                           image={pokemon.sprites.other.dream_world.front_default}/>
                            ) )}
                        </div>
                    </div>
                </div>
                <div className="arena_footer">
                    <div className="moves">
                        <div className="moves_header">
                            <h3>Available moves:</h3>
                        </div>
                        <div className="moves_list">
                            {uniqueMoves.map ( move =>
                                <button disabled={!playerTurn} key={move} className="btn-info"
                                        onClick={() => handlePlayerMove ( move )}>
                                    {move}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Arena;
