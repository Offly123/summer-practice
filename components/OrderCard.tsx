'use client'

import { Order } from "app/api/profile/route"
import OrderProductCard from "$/OrderProductCard";

import style from "@/profile/profile.module.scss";

export default function OrderCard({order}: {order: Order}) {
    return (
        <div className={`${style.orderCard} ${style[order.order_status]}`}>
            <h2>ID заказа: {order.order_id}</h2>
            <p>Дата заказа: {order.order_date.toString().substring(0, 10)}</p>
            <p>Адрес доставки: {order.order_address}</p>
            <p>Сумма: {order.cost}</p>
            <p>Статус: {order.order_status}</p>
            <p>Список продуктов:</p>
            <div className={style.productList}>
                {
                    order.product_list.map((product, index) => (
                        <OrderProductCard key={index} product={product} />
                    ))
                }
            </div>
        </div>
    )
}
