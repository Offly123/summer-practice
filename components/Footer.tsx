import React from 'react';
import style from '@/footer.module.scss';

export default function Footer() {
    return (
        <footer className={style.footer}>
            &copy; { new Date().getFullYear() } КубГУ.Доставка. Все права атакованы.
        </footer>
    )
}