// Компонент навигации, содержится в хэдере



import style from '@/navbar.module.scss';

export default function Navbar() {
    return (
        <nav className={style.nav}>
            <ul className={style.ul}>
                <a href="./cart/">Корзина</a>
                <a href="./login/">Вход</a>
                <a href="./registration/">Регистрация</a>
                <a href="./about/">О нас</a>
            </ul>
        </nav>
    )
}