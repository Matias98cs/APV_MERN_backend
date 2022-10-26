import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import generarId from '../helpers/generarId.js'

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
})

//pre revisar docu de mongoose
veterinarioSchema.pre('save', async function(next) {
    // console.log(`Antes de almacenar`)
    // console.log(this)

    //para que un password que fue hasheado no lo vuevla a hashear
    //lo ignora
    if(!this.isModified('password')){
        //el next nos dice que se vaya la siguiente middleware
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;