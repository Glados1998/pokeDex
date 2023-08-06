import React , {createContext , useReducer} from 'react';

export const PokemonContext = createContext ( undefined );
const pokemonReducer = (state , action) => {
    switch (action.type) {
        case 'ADD_POKEMON':
            if ( state.selectedPokemon.some ( p => p.id === action.pokemon.id ) ) {
                return { ...state , errorMsg : 'You cannot select the same Pokémon twice.' };
            } else if ( state.selectedPokemon.length < 6 ) {
                return { ...state , selectedPokemon : [ ...state.selectedPokemon , action.pokemon ] , errorMsg : '' };
            } else {
                return { ...state , errorMsg : 'You can only select up to 6 Pokémon for the arena.' };
            }
        case 'SET_SELECTED_POKEMON':
            return { ...state , selectedPokemon : [ ...state.selectedPokemon , action.pokemon ] , errorMsg : '' };
        case 'REMOVE_POKEMON':
            return {
                ...state , selectedPokemon : state.selectedPokemon.filter ( p => p.id !== action.pokemon.id ) ,
                errorMsg : ''
            };
        case 'RESET_SELECTION':
            return { ...state , selectedPokemon : [] , errorMsg : '' };
        case 'START_BATTLE':
            if ( state.selectedPokemon.length !== 6 ) {
                return { ...state , errorMsg : 'You need to select 6 Pokémon to start a battle.' };
            } else {
                return { ...state , readyForBattle : true };
            }
        default:
            throw new Error ( `Unknown action type: ${action.type}` );
    }
};
export const PokemonProvider = ({ children }) => {
    const [ state , dispatch ] = useReducer ( pokemonReducer , {
        selectedPokemon : [] , pokemonDetails : [] , errorMsg : ''
    } );
    return (
        <PokemonContext.Provider value={{
            selectedPokemon : state.selectedPokemon ,
            setSelectedPokemon : (pokemon) => dispatch ( { type : 'SET_SELECTED_POKEMON' , pokemon } ) ,
            pokemonDetails : state.pokemonDetails ,
            errorMsg : state.errorMsg ,
            addPokemonToArena : (pokemon) => dispatch ( { type : 'ADD_POKEMON' , pokemon } ) ,
            removePokemonFromArena : (pokemon) => dispatch ( { type : 'REMOVE_POKEMON' , pokemon } ) ,
            resetSelection : () => dispatch ( { type : 'RESET_SELECTION' } ) ,
            dispatch
        }}>
            {children}
        </PokemonContext.Provider>
    );
};

