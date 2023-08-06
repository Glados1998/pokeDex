import React from "react"

const CardArena = ({onClick, ...props }) => {

    return (
        <div className="card" onClick={onClick}>
            <div className="card_body">
                <div className="card_body_header">
                    <h2 className="card_body_header_name">{props.name}</h2>
                    <span className="card_body_header_order">Order: {props.order}</span>
                </div>
                <img className="card_body_image" src={props.image} alt={props.name}/>
                <div className="card_body_details-column">
                    <div className="card_body_details_types-row">
                        <h5>Types:</h5>
                        {props.types.map ( type => (
                            <div className="card_body_details_types_type">{type.type?.name}</div>
                        ) )}
                    </div>
                    <div className="card_body_details_stats-row">
                        <h5>stats:</h5>
                        {props.stats.map ( stat => (
                            <div className="card_body_details_stats_stat-column">
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
