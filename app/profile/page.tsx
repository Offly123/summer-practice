'use client'

import { useEffect, useState } from 'react'

import Loading from '$/Loading';

import style from '@/profile/profile.module.scss'

export default function Profile() {

    const [defaultValues, setDefaultValues] = useState(undefined);
    useEffect(() => {
        const fetchValues = async () => {
            const res = await fetch('/api/profile', {
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
        <>
            <div>
                <h2>Список заказов:</h2>
                <div>
                    {
                        JSON.stringify(defaultValues)
                    }
                </div>
            </div>
            <a href="/profile/update/">Обновить данные</a>
        </>
    )
}
