import React from "react"

const CardArena = (props) => {

    return (
        <div className="arena-card">
            <div className="arena-card_side">
                <img className="arena-card_side_image" src={props.image} alt={props.name}/>
            </div>
            <div className="arena-card_body">
                <div className="card_body_name">
                    <h2>{props.name}</h2>
                </div>
                <div className="arena-card_body_stats">
                    <div className="arena-card_body_stats_header">
                        <h3>stats:</h3>
                    </div>
                    <div className="arena-card_body_stats_list">
                        {props.stats.map ( stat => (
                            <div className="arena-card_body_stats_list_item">
                                <h5>{stat.stat.name}</h5>
                                <p>{stat.base_stat}</p>
                            </div>
                        ) )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardArena
