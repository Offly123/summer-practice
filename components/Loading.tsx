'use client';

import style from '@/loading.module.scss';

export default function Loading() {
    return (
        <p className={style.p}>
            <img className={style.img} src="/logo.png" alt="загрузка" />
            Загрузка...
        </p>
    )
}