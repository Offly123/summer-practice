'use client'

import { useEffect, useState } from 'react'

import Loading from '$/Loading';
import OrderCard from '$/OrderCard';
import { Order } from 'app/api/profile/route';

import style from '@/profile/profile.module.scss'


export default function Profile() {

    const [orderList, setOrderList] = useState<Order[]>([]);
    useEffect(() => {
        const fetchValues = async () => {
            const res = await fetch('/api/profile', {
                method: 'POST'
            });
            if (res.ok) {
                let fetchData = await res.json();
                setOrderList(fetchData);
            }
        };
        
        fetchValues();
    }, [])

    if (!orderList) {
        return  <Loading />;
    }
    
    if (orderList[0] && orderList[0].error) {
        return (
            <>
                <p>Вы не вошли в систему</p>
                <a className={style.a} href="/login/">Войти</a>
            </>
        );
    }


    return (
        <>
            <a className={style.update} href="/profile/update/">Обновить данные</a>
            <h2 className={style.h2}>Список заказов:</h2>
            <div className={style.orderList}>
                {
                    orderList.map((order, index) => (
                        <OrderCard key={index} order={order}/>
                    ))
                }
            </div>
        </>
    )
}
