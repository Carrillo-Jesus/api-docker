const Product = require('@/models/product.model');
const { Op } = require('sequelize');
const Category = require('@/models/category.model');
const path = require('path');
const fs = require('fs');
// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, category, order = 'ASC', search } = req.query;
        
        // Convertir a números enteros y asegurarse de que sean valores válidos
        limit = parseInt(limit);
        page = parseInt(page);
        if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
            return res.status(400).json({ message: 'Parámetros de paginación no válidos' });
        }

        // Calcular offset para paginación
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (category) {
            whereClause.category_id = category;
        }
        if (search) {
            whereClause.title = { [Op.like]: `%${search}%` };
        }

        // Validar orden
        if (order !== 'ASC' && order !== 'DESC') {
            return res.status(400).json({ message: 'El parámetro de orden no es válido' });
        }

        // Consultar productos con paginación, búsqueda y orden
        const products = await Product.findAndCountAll({
            where: whereClause,
            order: [['id', order]],
            limit: limit,
            offset: offset,
            include: {
                model: Category,
            },
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

// Obtener un producto por su ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(
            id,
            {
                include: {
                    model: Category,
                },
            }
        );
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {

    try {
        const { title, price, description, category, countInStock, active } = req.body;
        if(!title || !price || !description || !category || !countInStock || active === undefined) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        if(!req.file) {
            return res.status(400).json({ message: 'La imagen es obligatoria' });
        }
        
        const image = req.file ? `${process.env.DOMINIO}/public/images/products/${req.file.filename}` : 'no-image.jpg';

        const objectCategory = JSON.parse(category);

        if (!objectCategory.id) {
            return res.status(400).json({ message: 'La categoría es obligatoria' });
        }
    
        const product = await Product.create({
            title,
            price,
            description,
            category_id: objectCategory.id,
            countInStock,
            active,
            image,
        });
  
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el producto' });
    }
};

// Actualizar un producto existente
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, price, description, category, countInStock, active, image } = req.body;

    if(!title || !price || !description || !category || !countInStock || active === undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const objectCategory = JSON.parse(category);

    if (!objectCategory.id) {
        return res.status(400).json({ message: 'La categoría es obligatoria' });
    }

    const endImage = req.file ? `${process.env.DOMINIO}/public/images/products/${req.file.filename}` : image ? image :'no-image.jpg';

    try {
        const product = await Product.findByPk(id);

        if (product) {
            if(req.file && product.image && product.image != 'no-image.jpg') {
                let productImage = product.image.split('/');
                if( productImage[productImage.length - 1]) {
                    try {
                        const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'products', productImage[productImage.length - 1] );
                        fs.unlinkSync(oldImagePath);
                    } catch (error) {
                        // Manejo del error
                        if (error.code === 'ENOENT') {
                            console.log('El archivo no existe');
                        } else {
                            // Otro tipo de error
                            console.error('Ocurrió un error al eliminar el archivo:', error);
                        }
                    }
                }  
            }  
            product.title = title;
            product.price = price;
            product.description = description;
            product.category_id = objectCategory.id;
            product.countInStock = countInStock;
            product.active = active;
            product.image = endImage;
            await product.save();
            res.json(product);
        }
        else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (product) {
            await product.destroy();
            res.json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const { category_id } = req.params;
    try {
        const products = await Product.findAll({
            where: {
                category_id,
            },
            include: {
                model: Category,
            },
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};