import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter , RouterProvider} from "react-router-dom";
import Header from "./components/header";
import Pokedex from "./pages/pokedex";
import Arena from "./pages/arena";
import PokemonDetail from "./pages/pokemonDetail";


const BrowserRouter = createBrowserRouter ( [
    { path : '/' , element : <Header/>},
    { path : '/pokedex/:id', element : <PokemonDetail/> },
    { path : '/pokedex', element : <Pokedex/> },
    { path : '/arena', element : <Arena/> },

] );

const root = ReactDOM.createRoot ( document.getElementById ( 'root' ) );
root.render (
    <React.StrictMode>
        <RouterProvider router={BrowserRouter}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals ();
