import React from 'react'
import Tender from '../tender/Tender';
import classes from "./Tenders.module.css"

function Tenders(props) {
    return (
        <div className={classes.Tenders}>
            {props.contacts.map(c =>
            <Tender description={c.description} price={c.price}/>
            )}
        </div>
    );
}

export default Tenders;