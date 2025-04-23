require("dotenv").config();
const connectDB = require("./src/config/db");

connectDB();

const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));