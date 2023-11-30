const express = require("express")
const exphbs = require("express-handlebars")
const mysql = require("mysql2")

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.post('/completar', (require, response) => {
    const id = require.body.id

    const sql = `
        UPDATE tarefas
        SET completa = '1'
        WHERE ID =  ${id}
    `

    conexao.query(sql, (erro) => {
        if (erro) {
            return console.log(erro)
        }

        response.redirect('/')
    })
})

app.post('/descompletar', (require, response) => {
    const id = require.body.id

    const sql = `
        UPDATE tarefas
        SET completa = '0'
        WHERE id = ${id}
    `

    conexao.query(sql, (erro) => {
        if (erro) {
            return console.log(erro)
        }

        response.redirect('/')
    })
})

app.post('/criar', (require, response) => {
    const descricao = require.body.descricao
    const completa = 0

    const sql = `
        INSERT INTO tarefas(descricao, completa)
        VALUES ('${descricao}', '${completa}')
    `

    conexao.query(sql, (erro) => {
        if (erro) {
            return console.log(erro)
        }

        response.redirect('/')
    })
})

app.get('/ativas', (require, response) => {
    const sql = `
        SELECT * FROM tarefas
        WHERE completa = 0
    `

    conexao.query(sql, (erro, dados) => {
        if (erro) {
            return console.log(erro)
        }

        const tarefas = dados.map((dado) => {
           return {
                id: dado.id,
                descricao: dado.descricao,
                completa: false
           }
        })

        const quantidadeTarefas = tarefas.length

        response.render('ativas', { tarefas, quantidadeTarefas })
    })
    
})

app.get('/', (require, response) => {
    const sql = 'SELECT * FROM tarefas'

    conexao.query(sql, (erro, dados) => {
        if (erro) {
            return console.log(erro)
        }

        const tarefas = dados.map((dado) => {
            return {
                id: dado.id,
                descricao: dado.descricao,
                completa: dado.completa === 0 ? false : true
            }
        })

        const tarefasAtivas = tarefas.filter((tarefa) => {
            return tarefa.completa === false && tarefa
        })

        const quantidadeTarefasAtivas = tarefasAtivas.length

        response.render('home', {tarefas, quantidadeTarefasAtivas})
    }) 
})

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "todoapp",
    port: 3306
})

conexao.connect((erro) => {
    if (erro) {
        return console.log(erro)
    }

    console.log("Estou conectado ao MySQL")

    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000!")
    })
})