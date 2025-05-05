// Компонент навигации, содержится в хэдере



import style from '@/header/navbar.module.scss';

export default function Navbar() {
    return (
        <nav className={style.nav}>
            <a href="/cart/">Корзина</a>
            <a href="/profile/">Профиль</a>
            <a href="/login/">Вход</a>
            <a href="/registration/">Регистрация</a>
            <a href="/courier/">Курьеру</a>
        </nav>
    )
}