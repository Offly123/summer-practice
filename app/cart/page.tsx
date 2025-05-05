'use client'

import { useState, useEffect } from "react";

import { getCookies } from "app/api/cook"
import Form from "$/Form";
import TextInput from "$/TextInput";
import Loading from "$/Loading";
import CartItem from "$/CartItem";
import { Product } from "$/ProductCard";

import style from '@/cart/cart.module.scss'


export default function Cart() {

    const [productList, setProductList] = useState([]);
    
    useEffect(() => {
        const fetchProducts = async () => {
            if (!getCookies().cart) {
                setProductList([{empty: true}]);
            }
            let res = await fetch('/api/cart', {
                method: 'POST',
                body: JSON.stringify(getCookies().cart ? getCookies().cart : {empty: true})
            });
            if (res.ok) {
                const fetchData = await res.json();
                setProductList(fetchData);
            }
        }
        fetchProducts();
    }, []);

    const removeFromCart = (product: Product) => {
        // Получаем печенье
        let cart = getCookies().cart;
        if (cart.constructor === String) {
            cart = JSON.parse(cart);
        }
        

        // Удаляем из печенья тыкнутый элемент
        cart.splice(cart.indexOf(product.id), 1);


        // Удаляем из productList тыкнутый элемент
        let temp = productList.filter((elem: Product) => {
            return elem.render_id !== product.render_id;
        });
        if (!temp.length) {
            setProductList([{empty: true}])
        } else {
            setProductList(temp);
        }
        
        
        // Ставим печенье
        document.cookie = `cart=${JSON.stringify(cart)}`;
    }

    if (!productList.length) {
        return <Loading />;
    }

    if (productList[0].empty || productList.empty) {
        return (
            <>
                <p>Корзина пуста</p>
                <a href="/" className={style.empty}>В магазин</a>
            </>
        )
    }

    return (
        <>
            <div>
                {
                    productList.map((product, index) => {
                        return (
                            <CartItem onClick={removeFromCart} key={index} product={product} />
                        )
                    })
                }
            </div>
            <Form action='/api/order' headText='Оформление' sendButtonText='Заказать' successRedirect='/profile/'>
                <TextInput error={false} onChange={undefined} name='order_address' label='Адрес Доставки' type='text' />
            </Form>
        </>
    )
}
