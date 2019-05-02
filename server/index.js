// IMPORT STUFFS

const mysql = require('mysql');
const express = require('express');
var cors = require('cors')
var Config = require('./config.json');

// MIDDLEWARE

const app = express();
app.use(cors());

// ESTABLISH MYSQL CONNECTION
// https://github.com/mysqljs/mysql

const db = mysql.createConnection({
  host     : Config.host,
  user     : Config.user,
  password : Config.password,
  database : Config.database
});

db.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + db.threadId);
});

// ESTABLISH MONGODB CONNECTION

//const mongoDB = [write code]

// RETRIEVE THREADS FOR FRONTPAGE

app.get('/frontpage_threads',(req,res)=>{

  param = JSON.parse(req.query.param);

  let sql_component = '';
  var i = 0;
  var values = []

  for (const [key, value] of Object.entries(param)) {

    values.push(value)
    if (i==0)
      {sql_component += 'AND (t.subforum_id = ?';}
    else
      {sql_component += ' OR t.subforum_id = ?';}
    i+=1

  }

  if (i != 0){
    sql_component += ") "
  }

  let sql = 'SELECT * \
             FROM thread t JOIN user_details u ON u.user_id = t.user_id \
             WHERE removed=0 '+sql_component+'\
             ORDER BY CAST(t.created_utc/100 AS INT) DESC, t.score DESC \
             LIMIT 100';

  db.query({
    sql: sql,
    timeout: 40000, // 40s
    values: values
  }, function (error, results, fields) {
    if (error) {
      console.error('error connecting: ' + error.stack);
      return;
    }
    res.send(results);
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
  });
});

// RETRIEVE CATEGORIES FOR SIDE BAR IN FRONTPAGE

app.get('/categories',(req,res)=>{

  let sql = 'SELECT * FROM category';

  db.query({
    sql: sql,
    timeout: 40000, // 40s
  }, function (error, results, fields) {
    if (error) {
      console.error('error connecting: ' + error.stack);
      return;
    }
    res.send(results);
  });
});

// RETRIEVE SUBCATEGORIES (SUBFORUMS) FOR SIDE BAR IN FRONTPAGE

app.get('/subcategories',(req,res)=>{

  category_id = req.query.category_id;

  let sql = 'SELECT * FROM subforum WHERE category_id = ?';

  db.query({
    sql: sql,
    timeout: 40000,
    values: [category_id]
  }, function (error, results, fields) {
    if (error) {
      console.error('error connecting: ' + error.stack);
      return;
    }
    res.send(results);
  });
});

// ESTABLISH SERVER PORT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port '+PORT));
