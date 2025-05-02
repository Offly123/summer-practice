CREATE TABLE clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    client_login VARCHAR(50) NOT NULL,
    client_password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female')
);

--Вставка нового клиента
INSERT IGNORE INTO clients 
    (client_login, client_password, first_name, last_name, phone_number, email, gender) 
values (?, ?, ?, ?, ?, ?, ?)

--Получение пароля по логину
SELECT client_password FROM clients
WHERE client_login=?