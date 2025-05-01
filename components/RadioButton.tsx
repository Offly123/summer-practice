'use client'

import style from '@/form/radioButton.module.scss'

export default function RadioButton({label, name, value, onChange, error}) {

    return (
        <div className={`${style.field} ${error ? style.errored : ''}`}>
            <label htmlFor={name}>{label}:</label>
            <input className={style.input} type='radio' name={name} onChange={onChange}/>
        </div>
    )
}
