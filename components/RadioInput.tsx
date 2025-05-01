'use client'

import React, { useState } from 'react';

import { FormResponse } from 'app/api/login/route';

import style from '@/form/radioInput.module.scss';

export default function RadioInput({
    name,
    children
}: {
    name: string,
    children: React.ReactNode
}) {

    const [radioButtons, setRadioButtons] = useState(() => {
        let fieldList: FormResponse = {};
        React.Children.forEach(children, (child: Object) => {
            fieldList[child.props.name] = {error: false, message: ''};
        })
        return fieldList;
    })

    // Смена состояния полей формы
    const changeState = (event) => {
        const { name, value } = event.target;
        setRadioButtons({...radioButtons, [name]: value});
    }

    return (
        <div>
            <label>
                {name}
            </label>
            {
                React.Children.map(children, (child) => {
                    if (!React.isValidElement(child)) {
                        return child;
                    }
                    return React.cloneElement(child, {
                        checked: true,
                        onChange: changeState,
                    })
                })
            }
        </div>
    )
}
