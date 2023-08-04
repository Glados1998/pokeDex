import React from "react"

const Card = (props) => {

    return (
        <div className="card">
            <div className="card_body">
                <div className="card_body_header">
                    <h2 className="card_body_header_name">{props.name}</h2>
                    <span className="card_body_header_order">Number: {props.order}</span>
                </div>
                <img className="card_body_image" src={props.image} alt={props.name}/>
                <div className="card_body_details">

                    <div className="card_body_details_height-weight">
                        <span><b>Height:</b> {props.height}</span>
                        <span><b>Weight:</b> {props.weight}</span>
                    </div>
                    <div className="card_body_details_types">
                        <h5>Types:</h5>
                        {props.types.map ( type => (
                            <div className="card_body_details_types_type">{type.type.name}</div>
                        ) )}
                    </div>
                    <div className="card_body_details_abilities">
                        <h5>Abilities:</h5>
                        {props.abilities.map ( ability => (
                            <div className="card_body_details_abilities_ability">{ability.ability.name}</div>
                        ) )}
                    </div>

                </div>
                <div className="card_body_stats">
                    {props.stats.map ( stat => (
                        <div className="card_body_stats_stat">
                            <h5>{stat.stat.name}</h5>
                            <p>{stat.base_stat}</p>
                        </div>
                    ) )}
                </div>
            </div>
        </div>
    )
}

export default Card
