// Главная страница при заходе на сайт



import ProductCard from '$/ProductCard';

import style from '@/shop.module.scss';


export default function Shop() {

    return (
        <div className={style.productList}>
            {
                productList.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))
            }
        </div>
    )
}

// Временно для теста, в идеале брать из БД
let productList : Object[] = [
    {name: 'Чипсы', description: 'Чачка пипсов', src: '/products/lays.png', cost: '50'},
    {name: 'Холодильник', description: 'Картинка какого-то холодильника', src: '/products/refrigerator.png', cost: '30.000'},
    {name: 'Гитара', description: 'Сломанная гитара', src: '/products/guitar.png', cost: '5.000'},
    {name: 'Тетрадь с лекциями по латыни 2015-го года', description: 'Древний манускрипт, призывающий ещё более древних богов', src: '/products/notebook.png', cost: '-100'}
]