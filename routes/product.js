const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/user/validate-fields');
const { validateJWT } = require('../middlewares/auth/validate-jwt');
const { getProducts, updateProduct, deleteProduct, createProduct } = require('../controllers/product');

const router = Router();

router.get('/', validateJWT, getProducts);
router.post('/', [
    check('title', 'el titulo del producto es obligatorio').not().isEmpty(),
    check('description', 'la descripción del producto es obligatorio').not().isEmpty(),
    check('price', 'el precio del producto es obligatorio').not().isEmpty(),
    validateFields
], createProduct);

router.put('/:id', [
    validateJWT,
    check('title', 'el titulo del producto es obligatorio').not().isEmpty(),
    check('description', 'la descripción del producto es obligatorio').not().isEmpty(),
    check('price', 'el precio del producto es obligatorio').not().isEmpty(),
], updateProduct)


router.delete('/:id', [
    validateJWT
], deleteProduct)


module.exports = router;