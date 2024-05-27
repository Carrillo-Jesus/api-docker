CREATE USER 'appuser'@'%' IDENTIFIED WITH mysql_native_password BY 'root';

GRANT ALL PRIVILEGES ON db_app.* TO 'appuser'@'%' WITH GRANT OPTION;

CREATE DATABASE IF NOT EXISTS db_app;

USE db_app;