require("dotenv").config()
const mongoose = require("mongoose")

async function main(){
  try {
    const dbUser = process.env.DB_USER
    const dbPassword = process.env.DB_PASS

    mongoose.set("strictQuery", true);

    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.ajbud9r.mongodb.net/?retryWrites=true&w=majority`
    )

    console.log("Conectado ao banco!");
  } catch (error) {
    console.log(`Erro: ${error}`);
  }

}

module.exports = main;