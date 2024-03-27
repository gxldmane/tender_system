import React from 'react'
import logo from '../img/logo.svg'
import classes from './Header.module.css'

function Header() {
    return (  
        <header className={classes.header}>
            <div className={classes.container}>
                <img src={logo} alt="#" className={classes.logo}></img>
                <div className={classes.menu}>
                    <div className={classes.menu__item}>
                        <a href="#">Каталог</a>
                    </div>
                    <div className={classes.menu__item}>
                        <a href="#">Разместить</a>
                    </div>
                    <div className={classes.menu__item}>
                        <a href="#">Контакты</a>
                    </div>
                </div>
                <a href="#" className={classes.headerButton}>Вход / Регистрация</a>
            </div>
        </header>
    )
}

export default Header;