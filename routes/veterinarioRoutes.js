import express from 'express'
import checkAuth from '../middleware/authMiddleware.js'
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword } from '../controllers/veterinarioController.js'

const router = express.Router()

//area publica
router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/olvide-password', olvidePassword)
// router.get('/olvide-passoword/:token', comprobarToken)
// router.post('/olvide-passoword/:token', nuevoPassword)

//mas corta si son las mismas rutas
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)

//area privada
router.get('/perfil', checkAuth , perfil)

export default router