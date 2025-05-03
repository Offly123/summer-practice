'use client'

import React, { useEffect, useState } from 'react';

import FormHead from '$/FormHead';
import FormEnd from '$/FormEnd';
import FormError from '$/FormError';

import style from '@/form/form.module.scss';
import RadioInput from './RadioInput';

interface FieldResponse {
    error: boolean,
    message: string,
}

export interface FormData {
    [fieldName: string]: FieldResponse
}

export default function Form({ 
    action,
    headText,
    sendButtonText,
    successRedirect,
    defaultValues,
    children,
}: { 
    action: string, 
    headText: string, 
    sendButtonText: string,
    successRedirect?: string,
    defaultValues?: Object
    children: React.ReactNode 
}) {

    // Создаём состояние для всех полей формы
    const [formData, setFormData] = useState(() => {
        let fieldList: Object = {};
        React.Children.forEach(children, (child: Object) => {
            fieldList[child.props.name] = {error: false, message: ''};
        })
        return fieldList;
    });


    // Смена состояния полей формы
    const changeState = (event) => {
        if (event.target.type == RadioInput) {
            const { name, checked } = event.target;
            setFormData({...formData, [name]: checked});
        } else {
            const { name, value } = event.target;
            setFormData({...formData, [name]: value});
        }
    }


    // Если переданы стандартные значения полей
    useEffect(() => {
        if (defaultValues) {
            setFormData({...defaultValues})
        }
    }, [defaultValues]);


    // Состояние для списка ошибок
    const [errorList, setErrorList] = useState<Object>({});


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
            console.error('Form component error');
            return;
        }

        const errorList: Object = await res.json();
        

        let anyErrors: boolean = false;
        Object.keys(errorList).map((elem: string) => {
            if (errorList[elem].error) {
                anyErrors = true;
            }
        });

        if (!anyErrors && successRedirect) {
            window.location.href = successRedirect;
        }

        
        setFormData(formData);
        setErrorList(errorList);

        console.log(errorList);
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
                            defaultValue: defaultValues ? defaultValues[child.props.name] : undefined,
                            value: formData[child.props.name],
                            onChange: changeState,
                            error: errorList[child.props.name]
                        })
                    })
                }
            </div>
            <FormEnd sendButtonText={ sendButtonText } ></FormEnd>
        </form>
    )
}
