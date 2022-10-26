import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";

const registrar = async (req, res) => {
    const {email} = req.body
    try {
        //revisar si esta duplicado el usuario
        const existeUsuario = await Veterinario.findOne({email})

        if(existeUsuario){
            const error = new Error('Usario ya registrado')
            return res.status(400).json({msg: error.message})
        }
        const veneterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veneterinario.save()
        res.json({
            msg : 'Registrando usuario',
            veterinarioGuardado
        })
    } catch (error) {
        console.log(error)
    }
};

const perfil = (req, res) => {
    const { veterinario } = req
    res.json({perfil : veterinario})
}

const confirmar = async (req, res) => {
    const {token} = req.params
    // console.log(req.params.token)
    const usuarioConfirmar = await Veterinario.findOne({token})
    if(!usuarioConfirmar){
        const error = new Error('Token no valido')
        res.status(400).json({
            msg: error.message
        })
    }
    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()
        res.status(200).json({
            msg: `Usuario confirmado correctamente`
        })

    } catch (error) {
        console.log(object)
    }
}

const autenticar = async (req, res) => {

    const {email, password} = req.body

    const usuario = await Veterinario.findOne({email})
    if(!usuario){
        const error = new Error('El usuario no existe')
        res.status(400).json({
            msg: error.message
        })
    }

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuentan no ha sido confirmada')
        res.status(400).json({
            msg: error.message
        })
    }

    // revisar el password
    // console.log(await usuario.comprobarPassword(password))
    if(await usuario.comprobarPassword(password)){
        //autenticar
        console.log('Correcto')
        res.json({token: generarJWT(usuario.id)})

    }else {
        const error = new Error('El password es incorrecto')
        res.status(400).json({
            msg: error.message
        })
    }
    
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar
}