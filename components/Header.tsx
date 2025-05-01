// Компонент хэдера, отображается на всех страницах



import Navbar from '$/Navbar';

import style from '@/header/header.module.scss';

export default function Header() {
    return (
        <header className={style.header}>
            <h1>
                <a href='/'>
                <img height='45px' src="/logo.png" alt="logo" />
                    КубГУ.Доставка
                </a>
            </h1>
            <Navbar />
        </header>
    )
}