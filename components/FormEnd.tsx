'use client'

import style from '@/form/formEnd.module.scss';

export default function FormEnd({ sendText, children }: { sendText: string, children?: React.ReactNode }) {
    return (
        <div className={style.end}>
            <button type='submit'>
                <p>{ sendText }</p>
            </button>
            { children }
        </div>
    )
}
