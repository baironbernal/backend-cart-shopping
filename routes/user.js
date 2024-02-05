const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user');
const { validateFields } = require('../middlewares/user/validate-fields');
const { validateJWT } = require('../middlewares/auth/validate-jwt');

const router = Router();

router.get('/', validateJWT, getUsers);
router.post('/', [
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    check('email', 'el email es obligatorio').isEmail(),
    validateFields
], createUser);

router.put('/:id', [
    validateJWT,
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('email', 'el email es obligatorio').isEmail(),
], updateUser)


router.delete('/:id', [
    validateJWT
], deleteUser)


module.exports = router;