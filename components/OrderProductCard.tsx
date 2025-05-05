'use client'

import { OrderedProduct } from "app/api/profile/route"

import style from "@/profile/orderProductCard.module.scss"

export default function OrderProductCard({ product }: { product: OrderedProduct }) {
    return (
        <div className={style.orderProductCard}>
            <h3>
                {product.product_name}
            </h3>
            <img width='50px' src={product.src} alt={`${product.product_name}.png`} />
            <p>Количество: {product.amount}</p>
            <p>Описание: {product.product_description}</p>
        </div>
    )
}