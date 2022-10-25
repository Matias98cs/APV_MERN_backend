const registrar =  (req, res) => {
    res.json({
        msg : 'Registrando usario'
    })
};

const perfil = (req, res) => {
    res.json({
        msg : 'Monstrando Perfil'
    })
}

export {
    registrar,
    perfil
}