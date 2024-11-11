require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configurações de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

db.connect((err) => {
if (err) {
console.error('Erro ao conectar ao banco de dados: ', err);
return;
}
console.log('Conectado ao MySQL Workbench.');
});

// Rota para criar (C) um novo registro
app.post('/create', (req, res) => {
const { nome, categoria, hora } = req.body;

const query = 'INSERT INTO visitantes (nome, categoria, hora) VALUES (?, ?, ?)';
db.query(query, [nome, categoria, hora], (err, result) => {
if (err) {
console.error('Erro ao inserir dados: ', err);
return res.status(500).send('Erro ao inserir os dados.');
}
res.redirect('/'); // Redireciona para a página principal
});
});

// Rota para ler (R) todos os registros
app.get('/visitantes', (req, res) => {
db.query('SELECT * FROM visitantes', (err, results) => {
if (err) {
console.error('Erro ao buscar dados: ', err);
return res.status(500).send('Erro ao buscar os dados.');
}
res.json(results);
});
});

// Rota para atualizar (U) um registro
app.post('/update/:id', (req, res) => {
const { nome, categoria, hora } = req.body;
const { id } = req.params;

const query = 'UPDATE visitantes SET nome = ?, categoria = ?, hora = ? WHERE id = ?';
db.query(query, [nome, categoria, hora, id], (err, result) => {
if (err) {
console.error('Erro ao atualizar dados: ', err);
return res.status(500).send('Erro ao atualizar os dados.');
}
res.send('Registro atualizado com sucesso!');
});
});

// Rota para deletar (D) um registro
app.post('/delete/:id', (req, res) => {
const { id } = req.params;

const query = 'DELETE FROM visitantes WHERE id = ?';
db.query(query, [id], (err, result) => {
if (err) {
console.error('Erro ao deletar dados: ', err);
return res.status(500).send('Erro ao deletar os dados.');
}
res.send('Registro deletado com sucesso!');
});
});

// Servir o formulário na página inicial
app.get('/', (req, res) => {
res.sendFile(__dirname + '/public/formulario.html');
});

app.listen(port, () => {
console.log(`Servidor rodando na porta ${port}`);
});
// nosso código server.js
