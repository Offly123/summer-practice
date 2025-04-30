import React, { Children } from 'react'
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import style from '../styles/layout.module.css';


export default function RootLayout( 
    {children} : { children: React.ReactNode }
) {
    return (
        <html lang="ru" className={style.html}>
            <head>
                <title>КубГУ Доставки</title>
            </head>
            <body className={style.body}>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    )
}
