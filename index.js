const express = require("express")
const exphbs = require("express-handlebars")

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.get('/', (require, response) => {
    response.send("Olá, Mundo")
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000!")
})