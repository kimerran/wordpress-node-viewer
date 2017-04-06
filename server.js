const express = require('express');
const mysql = require('mysql');
const striptags = require('striptags');

const app = express();

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'usr_moneygizmo',
  password : 'password',
  database : 'db_moneygizmo'
});

connection.connect();

app.set('view engine', 'pug');
app.get('/', (req,res) => {
	connection
		.query(`SELECT * FROM \`wp_posts\` WHERE post_status = "publish" ORDER BY post_date`,
			(err, rows, fields) => {
				if (err) throw err;
				res.render('index', {rows: rows});
			});
});

app.get('/post/:postID/', (req,res) => {
	connection
		.query(`SELECT * FROM \`wp_posts\` WHERE ID="${req.params.postID}"`, 
			(err, rows, fields) => {
				if (err) throw err;
				var content = rows[0];
				content.post_content = striptags(content.post_content);
				res.render('details', {post: content});
			});
});

app.listen(3000, function(req,res) {
	console.log('Server started at localhost:3000')
});