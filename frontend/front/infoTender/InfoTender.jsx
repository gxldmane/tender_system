import React from 'react'
import classes from './InfoTender.module.css'

function InfoTender(props) {
    return ( 
        <form className={classes.InfoTender}>
            <div>
            <div className={classes.inputContainer}>
                <label for="name" className={classes.label}>Наименование</label>
                <input type="text" name="name" defaultValue={props.name} className={classes.input}/>
            </div>
            <div className={classes.inputContainer}>
                <label for="category" className={classes.label}>Категория</label>
                <input type="text" name="category" defaultValue={props.category} className={classes.input}/>
            </div>
            <div className={classes.inputContainer}>
                <label for="description" className={classes.label}>Описание</label>
                <input type="text" name="description" defaultValue={props.description} className={classes.input}/>
            </div>
            <div className={classes.inputContainer}>
                <label for="region" className={classes.label}>Регион проведения</label>
                <input type="text" name="region" defaultValue={props.region} className={classes.input}/>
            </div>
            <div className={classes.inputContainer}>
                <label for="executor" className={classes.label}>Исполнитель</label>
                <input type="text" name="executor" defaultValue={props.executor} className={classes.input}/>
            </div>
            <div className={classes.inputContainer}>
                <label for="price" className={classes.label}>Вознаграждение</label>
                <input type="text" name="price" defaultValue={props.price} className={classes.input}/>
            </div>
            <div className={classes.inputContainer}>
                <label for="time" className={classes.label}>Срок выполнения</label>
                <input type="text" name="time" defaultValue={props.time} className={classes.input}/>
            </div>
            </div>
            <div className={classes.buttons}>
                <div className={classes.buttonsContainer}>
                    <button className={`${classes.button} ${classes.buttonSave}`}>Сохранить</button>
                    <button className={`${classes.button} ${classes.buttonDownload}`}>Скачать все документы</button>
                    <button className={`${classes.button} ${classes.buttonAdd}`}>+</button>
                </div>
                <button className={`${classes.button} ${classes.buttonDelete}`}>Удалить</button>
            </div>
        </form>
    );
}

export default InfoTender;