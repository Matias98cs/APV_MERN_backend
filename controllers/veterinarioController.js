import Veterinario from "../models/Veterinario.js";

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
    res.json({
        msg : 'Monstrando Perfil'
    })
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

export {
    registrar,
    perfil,
    confirmar
}