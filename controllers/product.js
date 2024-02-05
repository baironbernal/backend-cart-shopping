const { response } = require('express');

const Product = require('../models/product');

const getProducts = async(req, res) => {
    const since = Number(req.query.since) || 0;
    const [products, total] = await Promise.all([
        Product.find()
        .skip(since)
        .limit(3)
        .populate('user', 'name'),

        Product.count()
    ])

    res.json({
        ok: true,
        products,
        total
    })
}

const updateProduct = async(req, res = response) => {
    const uid = req.params.id;
    try {

        const productExist = await Product.findById(uid);

        if (!productExist) {
            return res.status(404).json({
                ok: false,
                msg: 'NO existe un producto con ese id'
            })
        }

        const fields = req.body;

        const productUpdated = await Product.findByIdAndUpdate(uid, fields);

        res.json({
            ok: true,
            product: productUpdated,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


const getProductsById = async(req, res = response) => {
    const uid = req.params.id;
    const since = Number(req.query.since) || 0;

    try {

        const [products, total] = await Promise.all([
            Product.find({ user: uid })
            .sort('-date_at')
            .skip(since)
            .limit(3),

            Product.count(),

        ])

        if (!products) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe products para este usuario'
            })
        }


        res.json({
            ok: true,
            products,
            total
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const createProduct = async(req, res = response) => {
    
    const product = new Product({
        user: req.uid,
        ...req.body
    });

    try {
        //Save product
        const productSaved = await product.save();

        //Generate token with JWT
        //const token = await generateJWT(user.id)

        res.json({
            ok: true,
            product: productSaved,

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado en los productos, revisar logs',
            uid: req.uid
        })
    }
}


const deleteProduct = async(req, res = response) => {
    const uid = req.params.id;
    try {
        const productExist = await Product.findById(uid);

        if (!productExist) {
            return res.status(404).json({
                ok: false,
                msg: 'NO existe un producto con ese id'
            })
        }

        await Product.findByIdAndDelete(uid)

        res.json({
            ok: true,
            msg: 'Producto eliminado',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Producto no pudo ser borrado'
        })
    }

}

module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
    getProductsById,
    updateProduct
}