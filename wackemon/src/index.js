import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter , RouterProvider} from "react-router-dom";
import Header from "./components/header";
import Pokedex from "./pages/pokedex";
import ArenaLobby from "./pages/arenaLobby";
import Arena from "./pages/arena";
import PokemonDetail from "./pages/pokemonDetail";
import {PokemonProvider} from "./context/context";


const BrowserRouter = createBrowserRouter ( [
    {
        path : '/' , element : <Header/> ,
        children : [
            { path : '/' , element : <Pokedex/> } ,
            { path : '/pokedex/:id' , element : <PokemonDetail/> } ,
            { path : '/arenaLobby' , element : <ArenaLobby/> } ,
            { path : '/arena' , element : <Arena/> }
        ]
    } ] );


const root = ReactDOM.createRoot ( document.getElementById ( 'root' ) );
root.render (
    <PokemonProvider>
        <RouterProvider router={BrowserRouter}/>
    </PokemonProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals ();
