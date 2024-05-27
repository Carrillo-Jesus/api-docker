const Category = require('@/models/category.model');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

exports.createCategory = async (req, res) => {
    const { name, short_name, active } = req.body;
    if (!name || !short_name, active == undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if(!req.file) {
        return res.status(400).json({ message: 'La imagen es obligatoria' });
    }
    
    const image = req.file ? `${process.env.DOMINIO}/public/images/categories/${req.file.filename}` : 'no-image.jpg';


    try {
        const category = await Category.create({ name, short_name, active, image });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la categoría' });
    }
}

exports.getAllCategories = async (req, res) => {

    let { limit = 10, page = 1, order = 'DESC', search="" } = req.query;

    limit = +limit;
    page = +page;

    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
        return res.status(400).json({ message: 'Parámetros de paginación no válidos' });
    }

    // Validar orden
    if (order !== 'ASC' && order !== 'DESC') {
        return res.status(400).json({ message: 'El parámetro de orden no es válido' });
    }

    let whereClause = {};
    if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
    }

    const offset = (page - 1) * limit;

    try {
        const categories = await Category.findAndCountAll({
            where: whereClause,
            order: [['id', order]],
            limit,
            offset
        });

        res.json({categories, hola: 'hola'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
}

exports.getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la categoría' });
    }
}

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, short_name, active, image } = req.body;

    if (!name || !short_name, active == undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const endImage = req.file ? `${process.env.DOMINIO}/public/images/categories/${req.file.filename}` : image ? image :'no-image.jpg';

    try {
        const category = await Category.findByPk(id);
        if (category) {
            if(req.file && category.image && category.image != 'no-image.jpg') {
                let categoryImage = category.image.split('/');
                if( categoryImage[categoryImage.length - 1]) {
                    try {
                        const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'categories', categoryImage[categoryImage.length - 1] );
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
            category.name = name;
            category.short_name = short_name;
            category.image = endImage;
            category.active = active;
            await category.save();
            res.json(category);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la categoría' });
    }
}

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (category) {
            await category.destroy();
            res.json({ message: 'Categoría eliminada' });
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la categoría' });
    }
}