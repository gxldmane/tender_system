import React from 'react'
import classes from './Tender.module.css'

function Tender(props) {
    return (
        <a href='#' className={classes.tender}>
            <div className={classes.description}>{props.description}</div>
            <div className={classes.price}>{props.price}</div>
        </a>
    );
}

export default Tender;