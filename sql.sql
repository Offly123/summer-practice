CREATE TABLE clients (
    client_id       INT AUTO_INCREMENT PRIMARY KEY,
    client_login    VARCHAR(50) NOT NULL,
    client_password VARCHAR(100) NOT NULL,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    phone_number    VARCHAR(20) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    gender          ENUM('male', 'female')
);

CREATE TABLE client_addresses (
    client_id       INT NOT NULL,
    client_address  VARCHAR(50) NOT NULL,
    PRIMARY KEY (client_id, client_address),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

CREATE TABLE products (
    product_id          INT AUTO_INCREMENT PRIMARY KEY,
    product_name        VARCHAR(50),
    cost                INT,
    src                 VARCHAR(50),
    product_description VARCHAR(100)
);

CREATE TABLE couriers (
    courier_id       INT AUTO_INCREMENT PRIMARY KEY,
    courier_login    VARCHAR(50) NOT NULL,
    courier_password VARCHAR(100) NOT NULL,
    first_name       VARCHAR(50) NOT NULL,
    last_name        VARCHAR(50) NOT NULL,
    phone_number     VARCHAR(20) NOT NULL,
    email            VARCHAR(100) NOT NULL,
    gender           ENUM('male', 'female')
);

CREATE TABLE orders (
    order_id        INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT NOT NULL,
    courier_id      INT,
    order_date      DATE NOT NULL,
    order_address   VARCHAR(100) NOT NULL,
    order_status    ENUM('created', 'shipping', 'delivered'),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (courier_id) REFERENCES couriers(courier_id) ON DELETE CASCADE
);

CREATE TABLE ordered_products (
    order_id    INT,
    product_id  INT,
    amount      INT,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

--Очистить все таблицы (кроме products)
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE clients;
TRUNCATE client_addresses;
TRUNCATE couriers;
TRUNCATE products;
TRUNCATE orders;
TRUNCATE ordered_products;

SET FOREIGN_KEY_CHECKS = 1;

--Удалить все таблицы
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE clients;
DROP TABLE client_addresses;
DROP TABLE couriers;
DROP TABLE products;
DROP TABLE orders;
DROP TABLE ordered_products;

SET FOREIGN_KEY_CHECKS = 1;


-- CLIENTS

--Вставка нового клиента
INSERT IGNORE INTO clients 
    (client_login, client_password, first_name, last_name, phone_number, email, gender) 
values (?, ?, ?, ?, ?, ?, ?);

-- Получение пароля по логину
SELECT client_password FROM clients
WHERE client_login=?;

-- Получение всех данных для вставки в профиль
SELECT client_login, client_password, first_name, last_name, phone_number, email, gender FROM clients
WHERE client_id=?;

-- Обновить данные пользователя
UPDATE clients
SET first_name=?, last_name=?, phone_number=?, email=?
WHERE client_id=?;



-- CLIENT_ADDRESSES

-- Вставка нового адреса
INSERT IGNORE INTO client_addresses
    (client_id, client_address)
values (?, ?);

-- Получение всех адресов клиента
SELECT client_address FROM client_addresses
WHERE client_id = ?;



-- PRODUCTS

-- Вставить тестовые продукты
INSERT IGNORE INTO products
    (product_name, cost, src, product_description)
VALUES('Chips', 50, '/products/lays.png', 'Chachka pipsov lays');
INSERT IGNORE INTO products
    (product_name, cost, src, product_description)
VALUES('Refrigerator', 30000, '/products/refrigerator.png', 'Picture of refrigerator');
INSERT IGNORE INTO products
    (product_name, cost, src, product_description)
VALUES('Guitar', 5000, '/products/guitar.png', 'Broken guitar');
INSERT IGNORE INTO products
    (product_name, cost, src, product_description)
VALUES('Notebook', -100, '/products/notebook.png', 'Some notebook');
INSERT IGNORE INTO products
    (product_name, cost, src, product_description)
VALUES('Milk', 70, '/products/milk.png', 'Milk milk');

-- Получить список всех продуктов
SELECT * FROM products;

-- Получить данные одного продукта
SELECT * FROM products
WHERE product_id=?;



-- COURIERS

-- Вставить тестового курьера (password)
INSERT IGNORE INTO couriers 
    (courier_login, courier_password, first_name, last_name, phone_number, email, gender) 
values ("test", "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg", "Courier", "Courier2", "88001231231", "some@mail.mail", "male");

-- Получить пароль курьера
SELECT courier_password FROM couriers
WHERE courier_login=?;



-- ORDERS

-- Получить список заказов клиента
SELECT
    client_id, order_date, order_address, order_status, amount, product_id
FROM orders o 
JOIN ordered_products op ON o.order_id=op.order_id;
WHERE client_id=?;


-- Создать заказ
INSERT IGNORE INTO orders
    (client_id, order_date, order_address, order_status)
VALUES (?, ?, ?, 'created');



-- ORDERED_PRODUCTS

-- Вставить заказанные продукты
INSERT IGNORE INTO ordered_products
    (order_id, product_id, amount)
VALUES (?, ?, ?);