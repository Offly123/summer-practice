'use client'

import { useState, useEffect } from 'react';

import Loading from '$/Loading';
import CourierOrderCard from '$/CourierOrderCard';
import { Order } from 'app/api/courier/route';

import style from '@/courier/courier.module.scss';


export default function Courier() {
    const [orderList, setOrderList] = useState<Order[]>([]);
    useEffect(() => {
        const fetchValues = async () => {
            const res = await fetch('/api/courier', {
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
        return <Loading />
    }

    if (orderList.error) {
        return (
            <>
                <p>Вы не вошли в систему</p>
                <a className={style.a} href="/courier-login/">Войти</a>
            </>
        );
    }

    return (
        <>
            <h2 className={style.h2}>Список заказов:</h2>
            <div className={style.orderList}>
                {
                    orderList.map((order, index) => (
                        <CourierOrderCard key={index} order={order}/>
                    ))
                }
            </div>
        </>
    )
}