import express from "express"
import bootstrap from "./src/app.controller.js"
import chalk from "chalk";
const app = express()
const port = process.env.PORT||5000;


await bootstrap(app,express)
app.listen(port, () => console.log(chalk.bgCyan.bold(`Example app listening on port ${port}!`)))