import style from '@/textInput.module.scss'

export default function TextInput({id, label, type}) {
    return (
        <div className={style.field}>
            <label htmlFor={id}>{label}:</label>
            <input id={id} type={type} placeholder={label} />
        </div>
    )
}