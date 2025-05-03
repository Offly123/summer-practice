'use client'

import { useEffect, useState } from 'react'

import TextInput from '$/TextInput'
import RadioInput from '$/RadioInput'
import RadioButton from '$/RadioButton'
import Form from '$/Form'

import style from '@/update/update.module.scss'
import Loading from '$/Loading'


export default function Update() {

    const [defaultValues, setDefaultValues] = useState(undefined);
    useEffect(() => {
        const fetchValues = async () => {
            const res = await fetch('/api/showUpdate', {
                method: 'POST'
            });
            if (res.ok) {
                let fetchData = await res.json();
                setDefaultValues(fetchData);
            }
        };
        
        fetchValues();
    }, [])

    if (!defaultValues) {
        return  <Loading />;
    }
    
    if (defaultValues.error === true) {
        return (
            <>
                <p>Вы не вошли в систему</p>
                <a className={style.a} href="/login/">Войти</a>
            </>
        );
    }

    return (
        <Form defaultValues={defaultValues} action='/api/update' headText='Обновить данные' sendButtonText='Обновить'>
            <TextInput name='first_name' label='Имя' type='text' />
            <TextInput name='last_name' label='Фамилия' type='text' />
            <TextInput name='phone_number' label='Номер телефона' type='text' />
            <TextInput name='email' label='Email' type='text' />
        </Form>
    )
}
