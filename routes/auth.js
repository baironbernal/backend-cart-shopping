const { Router } = require('express');
const { check } = require('express-validator');

const { login, renewToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/auth/validate-jwt');

const router = Router();

router.post('/', [
    check('password', 'el password es obligatorio').not().isEmpty(),
    check('email', 'el email es obligatorio').isEmail(),
], login)


router.get('/renew',
    validateJWT,
    renewToken
)

module.exports = router;