// Компонент продукта, поулчает Object
'use client'


import style from '@/shop/productCard.module.scss';


interface Product {
    name: string,
    description: string,
    src: string,
    cost: string
}

export default function ProductCard({product}) {

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
            <p>{ product.cost }&#x20bd;</p>
        </div>
    )

}
