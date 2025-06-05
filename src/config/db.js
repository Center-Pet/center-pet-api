// filepath: /c:/Users/dti/CenterPet.API/config/db.js
const mongoose = require("mongoose");

console.log("Tentando conectar ao MongoDB...");
console.log("MONGO_URI:", process.env.MONGO_URI); // Adicione este log para depuração

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔥 MongoDB Atlas conectado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB Atlas:", error);
        process.exit(1);
    }
};

module.exports = connectDB;