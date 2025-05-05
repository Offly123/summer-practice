'use client'

// Главная страница при заходе на сайт
import { useEffect, useState } from 'react';

import ProductCard, { Product } from '$/ProductCard';

import style from '@/shop/shop.module.scss';
import Loading from '$/Loading';


export default function Shop() {

    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            let res = await fetch('/api/shop', {
                method: 'GET'
            });
            if (res.ok) {
                const fetchData = await res.json();
                setProductList(fetchData);
            }
        }
        fetchProducts();
    }, []);

    if (!productList.length) {
        return <Loading />;
    }
    
    return (
        <div className={style.productList}>
            {
                productList.map((product: Product, index) => (
                    <ProductCard key={index} product={product} />
                ))
            }
        </div>
    )
}

// Временно для теста, в идеале брать из БД
// let productList : Product[] = [
//     {name: 'Чипсы', description: 'Чачка пипсов', src: '/products/lays.png', cost: '50'},
//     {name: 'Холодильник', description: 'Картинка какого-то холодильника', src: '/products/refrigerator.png', cost: '30.000'},
//     {name: 'Гитара', description: 'Сломанная гитара', src: '/products/guitar.png', cost: '5.000'},
//     {name: 'Тетрадь с лекциями по латыни 2015-го года', description: 'Древний манускрипт, призывающий ещё более древних богов', src: '/products/notebook.png', cost: '-100'}
// ]