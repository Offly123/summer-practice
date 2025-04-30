import React from 'react';

import Header from '$/Header';
import Footer from '$/Footer';

import style from '@/layout.module.scss'
import '@/global.scss';

import localFont from 'next/font/local';

const manrope = localFont({
    src: '../public/fonts/Manrope-VariableFont_wght.ttf'
})

export default function RootLayout({ 
    children 
} : { 
    children : React.ReactNode
}) {
    return (
        <html lang='ru' className={manrope.className}>
            <head>
                <link rel="icon" href="/logo.png" />
                <title>КубГУ.Доставка</title>
            </head>
            <body>
                <Header />
                <main className={'main'}>
                    { children }
                </main>
                <Footer />
            </body>
        </html>
    )
}