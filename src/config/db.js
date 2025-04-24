// filepath: /c:/Users/dti/CenterPet.API/config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

console.log("Tentando conectar ao MongoDB...");
console.log("📦 URI recebida do .env:", process.env.MONGO_URI);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Removidas opções obsoletas
        console.log("🔥 MongoDB Atlas conectado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB Atlas:", error);
        process.exit(1);
    }
};

if (require.main === module) {
    connectDB();
}

module.exports = connectDB;