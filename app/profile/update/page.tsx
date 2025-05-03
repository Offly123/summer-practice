'use client'

import { useEffect, useState } from 'react';

import TextInput from '$/TextInput';
import RadioInput from '$/RadioInput';
import RadioButton from '$/RadioButton';
import Form from '$/Form';


export default function Update() {

    const [defaultValues, setDefaultValues] = useState(undefined);
    useEffect(() => {
        const fetchValues = async () => {
            const res = await fetch('/api/update', {
                method: 'POST'
            });
            let fetchData = await res.json();
            console.log(fetchData);
            if (res.ok && fetchData.error !== true) {
                setDefaultValues(fetchData);
            } else {
                window.location.href = "/";
            }
        };

        fetchValues();
    }, [])

    console.log(defaultValues);

    return (
        <Form defaultValues={defaultValues} action='/api/profile' headText='Обновить данные' sendButtonText='Обновить' successRedirect='/profile/'>
            <TextInput name='client_login' label='Логин' type='text' />
            <TextInput name='client_password' label='Пароль' type='text' />
            <TextInput name='first_name' label='Имя' type='text' />
            <TextInput name='last_name' label='Фамилия' type='text' />
            <TextInput name='phone_number' label='Номер телефона' type='text' />
            <TextInput name='email' label='Email' type='text' />
            <RadioInput label='Пол:'>
                <RadioButton label='Мужской' name='gender' value='male' onChange={undefined} error={false} />
                <RadioButton label='Женский' name='gender' value='female' onChange={undefined} error={false} />
            </RadioInput>
        </Form>
    )
}
