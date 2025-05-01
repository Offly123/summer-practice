'use client'

import TextInput from '$/TextInput';
import RadioInput from '$/RadioInput';
import RadioButton from '$/RadioButton';
import Form from '$/Form';


export default function Registration() {

    return (
        <Form action='/api/registration' headText='Регистрация' sendText='Отправить' successRedirect='/profile/'>
            <TextInput error={false} onChange={undefined} name='first_name' label='Имя' type='text' />
            <TextInput error={false} onChange={undefined} name='last_name' label='Фамилия' type='text' />
            <TextInput error={false} onChange={undefined} name='phone_number' label='Номер телефона' type='text' />
            <TextInput error={false} onChange={undefined} name='email' label='Email' type='text' />
            {/* <RadioInput name={'Пол:'}>
                <RadioButton label='Мужской' name='sex' value='male' onChange={undefined} error={false} />
                <RadioButton label='Женский' name='sex' value='female' onChange={undefined} error={false} />
            </RadioInput> */}
            <div>
                {(/^[а-яА-ЯеЁ\s-]+$/).test('Имя') ? 'true' : 'false'}
            </div>
        </Form>
    )
}
