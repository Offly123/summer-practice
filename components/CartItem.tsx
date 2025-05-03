// Компонент продукта, поулчает Object
'use client'

import style from '@/cart/cartItem.module.scss';
import { getCookies } from 'app/api/cook';
import { projectUpdate } from 'next/dist/build/swc/generated-native';



export default function CartItem( {
    onClick,
    product
}: {
    onClick: Function,
    product: Product
}) {
    
    return (
        <div className={style.cartItem}>
            <div className={style.imageWrap}>
                <img 
                    height={'150px'} 
                    src={product.src} 
                    alt={`${product.name}.png`} 
                    />
            </div>
            <h2>{ product.name }</h2>
            <p>{ product.description }</p>
            <div className={style.cardEnd}>
                <button onClick={onClick.bind(null, product)}>-</button>
                <p>{ product.cost }&#x20bd;</p>
            </div>
        </div>
    )

}

export type {
    Product
}

interface Product {
    id: string,
    name: string,
    description: string,
    src: string,
    cost: string
}
