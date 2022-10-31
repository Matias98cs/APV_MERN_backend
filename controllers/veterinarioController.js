import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import olvidePasswordUsuario from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const {email, nombre} = req.body
    try {
        //revisar si esta duplicado el usuario
        const existeUsuario = await Veterinario.findOne({email})

        if(existeUsuario){
            const error = new Error('Usario ya registrado')
            return res.status(400).json({msg: error.message})
        }
        const veneterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veneterinario.save()

        //enviar el emails
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

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
    res.json(veterinario)
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
        console.log(error)
    }
}

const autenticar = async (req, res) => {

    const {email, password} = req.body

    const usuario = await Veterinario.findOne({email})
    if(!usuario){
        const error = new Error('El usuario no existe')
        return res.status(400).json({
            msg: error.message
        })
    }

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuentan no ha sido confirmada')
        return res.status(400).json({
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
        return res.status(400).json({
            msg: error.message
        })
    }
    
}

const olvidePassword = async(req, res) => {
    const { email } = req.body

    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error('El usuario no existe')
        return res.status(400).json({msg: error.message})
    }
    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        //enviar el email
        olvidePasswordUsuario({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.status(200).json({msg: 'Hemos enviado un mensaje con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async(req, res) => {
    const {token} = req.params

    const tokenValido = await Veterinario.findOne({token})
    if(tokenValido){
        //El token es valido el usuario existe
        res.status(200).json({msg: 'Token valido y el usuario existe'})
        
    }else {
        const error = new Error('Token no valido')
        return res.status(400).json({msg: error.message})
    }
}

const nuevoPassword = async(req, res) => {
    const {token} = req.params
    const {password} = req.body

    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.token = null
        veterinario.password = password;
        await veterinario.save()
        res.status(200).json({msg: 'Password Modificado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}