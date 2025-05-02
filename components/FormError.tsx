import style from '@/form/formError.module.scss';

import { FormResponse } from 'app/api/login/route';

export default function FormError({ errorList }: {errorList: FormResponse}) {
    // console.log('FormError');
    // console.log(errorList);
    return (
        <div className={style.errors}>
            {
                Object.keys(errorList).map((field: string, index: number) => (
                    <p className={style.errorText} key={index}>
                        {errorList[field].message}
                    </p>
                ))
            }
        </div>
    )
}
