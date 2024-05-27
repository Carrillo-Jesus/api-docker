# Plantilla de api express con docker

Esta aplicación es una API RESTful, el objetivo es que veas cómo usar docker con node. Esta api está construida con Node.js y Express que proporciona endpoints para gestionar productos, categorías y usuarios. La aplicación utiliza Sequelize como ORM (Object-Relational Mapping) para interactuar con una base de datos MySQL. La autenticación se implementa mediante JSON Web Tokens (JWT).

## Características

- **Gestión de productos**: Endpoints para crear, leer, actualizar y eliminar productos.
- **Gestión de categorías**: Endpoints para crear, leer, actualizar y eliminar categorías de productos.
- **Autenticación de usuarios**: Registro de nuevos usuarios y autenticación mediante JSON Web Tokens.
- **Docker y Docker Compose**: La aplicación se puede desplegar utilizando Docker y Docker Compose para facilitar el proceso de desarrollo y despliegue.
- **Proxy Nginx**: Se utiliza un proxy Nginx para enrutar las solicitudes entrantes a la aplicación Node.js.

## Requisitos

- Docker
- Docker Compose

## Configuración

1. Clona el repositorio:

```
git clone https://github.com/Carrillo-Jesus/api-docker.git
```
## Requisitos

- Docker
- Docker Compose

2. Navega al directorio del proyecto:
```
cd api
```
3. Copia el archivo .env.example y renómbralo a .env Luego, configura las variables de entorno según tus necesidades. Recuerda que el host es el servicio 'db' en el docker-compose.yml

```
DB_HOST=db
DB_PORT=3306
DB_NAME=db_app
DB_USER=appuser
DB_PASSWORD=root
DB_DIALECT=mysql
APP_PORT=4000
NODE_ENV=dev
...
```

4. Construye e inicia los contenedores Docker utilizando Docker Compose:

```
docker-compose up
```
Este comando construirá las imágenes de Docker para la aplicación Node.js, la base de datos MySQL y el proxy Nginx, y luego iniciará los contenedores.
La aplicación estará disponible en http://localhost:8080.

4.1. Prueba con:
```
http://localhost:8080/api/products/1
```

## Estructura del proyecto

```
├── api/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── ....js
│   ├── models/
│   │   ├── categoryModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── productRoutes.js
│   ├── index.js
|   ├── Dockerfile
|   ├── docker-compose.yml
├── ops/
    ├── nginx.conf
    └── db.sql

```
## Contribución:
Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu característica o corrección de errores: git checkout -b mi-rama
3. Realiza los cambios y confirma tus modificaciones: git commit -m 'Agregar nueva característica'
4. Sube tus cambios a la rama remota: git push origin mi-rama
5. Crea una nueva solicitud de extracción en GitHub.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT.

## Autor

[Linkedin](https://www.linkedin.com/in/jesus-david-carrillo/) - Jesus Carrillo
