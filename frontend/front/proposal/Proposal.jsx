import React from 'react'
import classes from "./Proposal.module.css"
import check from "../img/Check.svg"

function Proposal(props) {
    return (
        <div className={classes.proposal}>
            <div>
                <div className={classes.name}>{props.name}</div>
                <div className={classes.price}>{props.price}</div>
            </div>
            <button className={classes.check}>
                <img src={check} alt=""/>
            </button>   
        </div>
    );
}

export default Proposal;