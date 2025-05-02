'use client'

import React, { useState } from 'react';

import { FormData } from '$/Form';

import style from '@/form/radioInput.module.scss';

export default function RadioInput({
    label,
    onChange,
    children
}: {
    label: string,
    onChange: Function,
    children: React.ReactNode
}) {

    const [ isChecked, setIsChecked ] = useState(() => {
        let radioButtons = {};
        React.Children.forEach(children, (child) => {
            radioButtons[child.props.value] = false;
        });
        return radioButtons;
    });

    const handleChange = (event) => {
        console.log(isChecked);
        const { value } = event.target;
        const newState = {};
        React.Children.forEach(children, (child) => {
            newState[child.props.value] = (child.props.value === value);
        });
        setIsChecked(newState);
    }

    return (
        <div className={style.radioInput}>
            <label>
                { label }
            </label>
            <div className={style.buttons}>
                {
                    React.Children.map(children, (child) => (
                        React.cloneElement(child, {
                            checked: isChecked[child.props.name], 
                            onChange: onChange
                        })
                    ))
                }
            </div>
        </div>
    );
}
