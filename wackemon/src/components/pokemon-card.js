import React from "react"
import {Link} from "react-router-dom";

const Card = (props) => {

    return (
        <Link className="card-link" to={`/pokedex/${props.id}`}>
            <div className="card">
                <div className="card_body">
                    <div className="card_body_header">
                        <h2 className="card_body_header_name">{props.name}</h2>
                        <span className="card_body_header_order">Order: {props.order}</span>
                    </div>
                    <img className="card_body_image" src={props.image} alt={props.name}/>
                    <div className="card_body_details">
                        <div className="card_body_details_types">
                            <h5>Types:</h5>
                            {props.types.map ( type => (
                                <div className="card_body_details_types_type">{type.type.name}</div>
                            ) )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Card
