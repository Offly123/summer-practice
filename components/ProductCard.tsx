// Компонент продукта, поулчает Object
'use client'

import style from '@/shop/productCard.module.scss';
import { getCookies } from 'app/api/cook';



export default function ProductCard( {product}: {product: Product}) {
    
    const addToCart = () => {
        let cart = getCookies().cart;
        
        if (!cart) {
            document.cookie = `cart=${JSON.stringify([product.id])}`;
            return;
        }
        cart = JSON.parse(cart);

        document.cookie = `cart=${JSON.stringify([...cart, product.id])}`;
    }
    
    return (
        <div className={style.productCard}>
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
                <button onClick={addToCart}>+</button>
                <p>{ product.cost }&#x20bd;</p>
            </div>
        </div>
    )

}

export type {
    Product
}

interface Product {
    render_id: number
    id: string,
    name: string,
    description: string,
    src: string,
    cost: string
}
