import React from 'react'
import Proposal from '../proposal/Proposal'
import classes from "./ChoosingPerformer.module.css"

function ChoosingPerformer(props) {
    return (
        <div className={classes.choosingPerformer}>
            {props.contacts.map(c =>
            <Proposal name={c.name} price={c.price}/>
            )}
        </div>
    );
}

export default ChoosingPerformer;