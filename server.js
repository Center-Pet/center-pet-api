const dotenvFlow = require('dotenv-flow');
dotenvFlow.config();

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI:", process.env.MONGO_URI);

const connectDB = require("./src/config/db");
connectDB();

const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));