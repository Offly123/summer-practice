'use client'

import { useState } from "react";

import { Order } from "app/api/courier/route";
import OrderProductCard from "$/OrderProductCard";

import style from "@/courier/courier.module.scss";

export default function CourierOrderCard({order}: {order: Order}) {

    const [orderInfo, setOrderInfo] = useState(order);

    const setAsShipping = async () => {
        const res = await fetch('/api/setShipping', {
            method: 'POST',
            body: JSON.stringify({
                order_id: orderInfo.order_id
            })
        })
        if (res.ok) {
            const newStatus = await res.text();
            setOrderInfo({
                ...orderInfo,
                order_status: newStatus
            })
        }
    }

    const setAsDelivered = async () => {
        const res = await fetch('/api/setDelivered', {
            method: 'POST',
            body: JSON.stringify({
                order_id: orderInfo.order_id
            })
        })
        if (res.ok) {
            const newStatus = await res.text();
            setOrderInfo({
                ...orderInfo,
                order_status: newStatus
            })
        }
    }

    return (
        <div className={`${style.orderCard} ${style[orderInfo.order_status]}`}>
            <h2>ID заказа: {orderInfo.order_id}</h2>
            <p>Дата заказа: {orderInfo.order_date.toString().substring(0, 10)}</p>
            <p>Имя: {orderInfo.first_name}</p>
            <p>Фамилия: {orderInfo.last_name}</p>
            <p>Адрес доставки: {orderInfo.order_address}</p>
            <p>Сумма: {orderInfo.cost}</p>
            <p>Статус: {orderInfo.order_status}</p>
            <p>Список продуктов:</p>
            <div className={style.productList}>
                {
                    orderInfo.product_list.map((product, index) => (
                        <OrderProductCard key={index} product={product} />
                    ))
                }
            </div>
                {
                    orderInfo.order_status === 'created' && (
                        <button className={style.buttonShipping} onClick={setAsShipping}>
                            Принять заказ
                        </button>
                    )
                }
                {
                    orderInfo.order_status === 'shipping' && ( 
                        <button className={style.buttonDelivered} onClick={setAsDelivered} >
                            Заказ доставлен
                        </button>
                    )
                }
        </div>
    )
}