import React from "react"
import {Link , Outlet} from "react-router-dom";

const Header = () => {
    return (
        <>
            <header className="header">
                <nav className="header_nav">
                    <h5 className="header_nav_label">
                        Wackemon
                    </h5>
                    <ul className="header_nav_list">
                        <li className="header_nav_list_item">
                            <Link to="/">Pokedex</Link>
                        </li>
                        <li className="header_nav_list_item">
                            <Link to="/arenaLobby">Arena</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <div id="outlet">
                <Outlet/>
            </div>
        </>

    )
}

export default Header
