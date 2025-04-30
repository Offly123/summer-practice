import style from '@/navbar.module.scss'

export default function Navbar() {
    return (
        <nav className={style.nav}>            
            <ul className={style.ul}>
                <a href="./catalog/">Каталог</a>
                <a href="./registration/">Регистрация</a>
                <a href="./login/">Вход</a>
            </ul>
        </nav>
    )
}