import style from '@/main.module.scss'

export default function Main() {
    return (
        <>
            <article className={style.about}>
                <section>
                    <h2>
                        Доставка по КубГУ
                    </h2>
                    <p>
                        Наша компания занимается доставкой 
                        по территории КубГУ. От мелкогабаритных 
                        грузов до холодильниика. В любую точку на 
                        территории КубГУ (включая аудитории) за 15 минут. 
                        Напоминаем, что приём пищи в аудиториях КРАЙНЕ 
                        СТРОГО запрещён.
                    </p>
                </section>
                <img height='20px' src="/logo.png" alt="logo" />

            </article>
        </>
    )
}