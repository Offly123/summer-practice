'use client'

import React, { act, useState } from 'react';

import FormHead from '$/FormHead';
import FormEnd from '$/FormEnd';
import FormError from '$/FormError';

import { FormResponse } from 'app/api/login/route';

import style from '@/form/form.module.scss';

export default function Form({ 
    action, 
    headText, 
    sendText,
    successRedirect, 
    children,
}: { 
    action: string, 
    headText: string, 
    sendText: string,
    successRedirect: string,
    children: React.ReactNode 
}) {

    // Создаём состояние для всех полей формы
    const [formData, setFormData] = useState(() => {
        let fieldList: FormResponse = {};
        React.Children.forEach(children, (child: Object) => {
            fieldList[child.props.name] = {error: false, message: ''};
        })
        return fieldList;
    })

    // Смена состояния полей формы
    const changeState = (event) => {
        const { name, value } = event.target;
        setFormData({...formData, [name]: value});
    }

    // Список ошибок, пока не доделано
    const [errorList, setErrorList] = useState<FormResponse>({});

    // При отправке меняем состояние
    const handleSumbit = async (event) => {
        event.preventDefault();

        const res = await fetch(action, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (!res.ok) {
            console.error('Something went wrong');
            return;
        }

        const errorList: FormResponse = await res.json();
        
        console.log(errorList);
        let anyErrors: boolean = false;
        Object.keys(errorList).map((elem: string) => {
            if (errorList[elem].error) {
                anyErrors = true;
            }
        });

        if (!anyErrors) {
            // window.location.href = successRedirect;
        }

        setFormData(formData);
        setErrorList(errorList);
    }

    
    // Возвращаем форму. Каждому полю ввода при изменении добавляем функцию 
    // смены состояния полей
    return (
        <form className={style.form} onSubmit={handleSumbit}>
            <FormHead>{ headText }</FormHead>
            <div className={style.main}>
                <FormError errorList={errorList} />
                {
                    React.Children.map(children, (child) => {
                        if (!React.isValidElement(child)) {
                            return child;
                        }
                        return React.cloneElement(child, {
                            value: formData[child.props.name],
                            onChange: changeState,
                            error: errorList[child.props.name]
                        })
                    })
                }
            </div>
            <FormEnd sendText={ sendText } ></FormEnd>
        </form>
    )
}
