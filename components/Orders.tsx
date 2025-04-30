import style from '@/order.module.scss';

export default function Orders() {
    return (
        <div className={style.productList}>
            {
                productList.map((product, index) => (
                    <div key={index} className={style.productCard}>
                        <div className={style.imageWrap}>
                            <img height={'150px'} src={product.photoSrc} alt={`${product.name}.png`} />
                        </div>
                        <h2>{ product.name }</h2>
                        <p>{ product.description }</p>
                        <p>{ product.cost }&#x20bd;</p>
                    </div>
                ))
            }
        </div>
    )
}

interface Product {
    name: string,
    description: string,
    photoSrc: string,
    cost: string
}

let productList : Product[] = [
    {name: 'Чипсы', description: 'Чачка пипсов', photoSrc: '/products/lays.png', cost: '50'},
    {name: 'Холодильник', description: 'Картинка какого-то холодильника', photoSrc: '/products/refrigerator.png', cost: '30.000'},
    {name: 'Гитара', description: 'Сломанная гитара', photoSrc: '/products/guitar.png', cost: '5.000'},
    {name: 'Тетрадь с лекциями по латыни 2015-го года', description: 'Древний манускрипт, призывающий ещё более древних богов', photoSrc: '/products/notebook.png', cost: '-100'}
]