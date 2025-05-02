'use client'

import style from '@/form/radioButton.module.scss'


export default function RadioButton({label, name, value, checked, onChange, error}) {

    const foo = () => {
        console.log('hehe');
    }
    
    return (
        <div className={style.radio}>
            <label htmlFor={value}>{label}</label>
            <input id={value} className={style.input} type='radio' name={name} value={value} checked={checked} onChange={onChange} />
        </div>
    )
}
