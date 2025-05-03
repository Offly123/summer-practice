import style from '@/not-found.module.scss';

export default function Custom404() {
    return (
        <>
            <p>
                404 Страница не найдена
            </p>
            <a href="./" className={style.a}><p>

            На главную
            </p>
            </a>
        </>
    )
}