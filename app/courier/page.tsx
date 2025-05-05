'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Loading from '$/Loading';
import Form from '$/Form';
import TextInput from '$/TextInput';

import style from '@/courier/courier.module.scss';


export default function Courier() {
    const [defaultValues, setDefaultValues] = useState(undefined);
    useEffect(() => {
        const fetchValues = async () => {
            const res = await fetch('/api/courier/', {
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
        return (
            <>
                <p>Вы не вошли в систему</p>
                <a className={style.a} href="/courier-login/">Войти</a>
            </>
        );
    }

    return (
        <>{JSON.stringify(defaultValues)}</>
    )
}