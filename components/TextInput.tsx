'use clien'

import style from '@/form/textInput.module.scss'

export default function TextInput({label, type, name, onChange, error}) {

    return (
        <div className={`${style.field} ${error ? style.errored : ''}`}>
            <label htmlFor={name}>{label}:</label>
            <input name={name} type={type} placeholder={label} onChange={onChange}/>
        </div>
    )
}
