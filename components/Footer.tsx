// Компонент футера, отображается на всех страницах



import React from 'react';
import style from '@/footer/footer.module.scss';

export default function Footer() {
    return (
        <footer className={style.footer}>
            <p>
                &copy; { new Date().getFullYear() } КубГУ.Доставка. Все права атакованы.
            </p>
        </footer>
    )
}