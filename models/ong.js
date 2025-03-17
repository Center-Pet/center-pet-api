const mongoose = require("mongoose");

const ongSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    cep: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    uf: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    }
})