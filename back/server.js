const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require("cors");
var corsOptions = {};

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'root',
   database: 'testdb_spring'
});

db.connect(err => {
   if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
   }
   console.log('Connected to the database');
});

app.post('/articles', (req, res) => {
    const {
       Code_article,
       Designation_article,
       Designation_famille_article,
       Prix_achat,
       Prix_vente,
       Taux_marge,
       Stock_disponible_quantite,
       Stock_disponible_valeur,
       Statut_article
    } = req.body;
 
    const sql = `
       INSERT INTO articles
       (Code_article, Designation_article, Designation_famille_article, Prix_achat, Prix_vente, Taux_marge, Stock_disponible_quantite, Stock_disponible_valeur, Statut_article)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
 
    db.query(
       sql,
       [
          Code_article,
          Designation_article,
          Designation_famille_article,
          Prix_achat,
          Prix_vente,
          Taux_marge,
          Stock_disponible_quantite,
          Stock_disponible_valeur,
          Statut_article
       ],
       (err, result) => {
          if (err) {
             res.status(500).json({ error: 'Internal Server Error' });
             return;
          }
 
          res.status(201).json({ message: 'Article created successfully', id: result.insertId });
       }
    );
 });

 app.delete('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    const sql = 'DELETE FROM articles WHERE id = ?';
 
    db.query(sql, [articleId], (err, result) => {
       if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
          return;
       }
 
       if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Article not found' });
          return;
       }
 
       res.status(200).json({ message: 'Article deleted successfully' });
    });
 });

 app.put('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    const {
       Code_article,
       Designation_article,
       Designation_famille_article,
       Prix_achat,
       Prix_vente,
       Taux_marge,
       Stock_disponible_quantite,
       Stock_disponible_valeur,
       Statut_article
    } = req.body;
 
    const sql = `
       UPDATE articles
       SET Code_article=?, Designation_article=?, Designation_famille_article=?, Prix_achat=?, Prix_vente=?, Taux_marge=?, Stock_disponible_quantite=?, Stock_disponible_valeur=?, Statut_article=?
       WHERE id=?
    `;
 
    db.query(
       sql,
       [
          Code_article,
          Designation_article,
          Designation_famille_article,
          Prix_achat,
          Prix_vente,
          Taux_marge,
          Stock_disponible_quantite,
          Stock_disponible_valeur,
          Statut_article,
          articleId
       ],
       (err, result) => {
          if (err) {
             res.status(500).json({ error: 'Internal Server Error' });
             return;
          }
 
          if (result.affectedRows === 0) {
             res.status(404).json({ error: 'Article not found' });
             return;
          }
 
          res.status(200).json({ message: 'Article updated successfully' });
       }
    );
 });



 app.get('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    const sql = 'SELECT * FROM articles WHERE id = ?';
 
    db.query(sql, [articleId], (err, result) => {
       if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
          return;
       }
 
       if (result.length === 0) {
          res.status(404).json({ error: 'Article not found' });
          return;
       }
 
       res.status(200).json(result[0]);
    });
 });

 app.get('/articles', (req, res) => {
   const page = parseInt(req.query.page) || 1;
   const pageSize = parseInt(req.query.pageSize) || 10;
   const offset = (page - 1) * pageSize;
 
   const countSql = 'SELECT COUNT(*) AS totalItems FROM articles';
   db.query(countSql, (countErr, countResult) => {
     if (countErr) {
       res.status(500).json({ error: 'Internal Server Error' });
       return;
     }
 
     const totalItems = countResult[0].totalItems;
 
     const dataSql = 'SELECT * FROM articles LIMIT ? OFFSET ?';
     db.query(dataSql, [pageSize, offset], (dataErr, dataResult) => {
       if (dataErr) {
         res.status(500).json({ error: 'Internal Server Error' });
         return;
       }
 
       const totalPages = Math.ceil(totalItems / pageSize);
 
       res.status(200).json({
         page,
         pageSize,
         totalItems,
         totalPages,
         articles: dataResult,
       });
     });
   });
 });

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
