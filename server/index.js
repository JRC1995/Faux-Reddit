// IMPORT STUFFS

const mysql = require('mysql');
const express = require('express');
var cors = require('cors')
var Config = require('./config.json');
var mongoDB = require('mongodb');

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
             ORDER BY CAST(t.created_utc/(360*24) AS INT) DESC, t.score DESC \
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

// RETRIEVE USER DETAILS

app.get('/userdetails',(req,res)=>{

  username = req.query.username;

  let sql = 'SELECT user_id, user_name, email, karma FROM user_details WHERE user_name = ?';

  db.query({
    sql: sql,
    timeout: 40000, // 40s
    values: [username],
  }, function (error, results, fields) {
    if (error) {
      console.error('error connecting: ' + error.stack);
      return;
    }
    res.send(results);
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

// RETRIEVE CATEGORY AND SUBCATEGORY OF A SELECTED THREAD

app.get('/description',(req,res)=>{

  thread_id = req.query.thread_id;

  let sql = 'SELECT c.name as category_name,s.name as subforum_name, c.description as category_description, s.description as subforum_description \
             FROM (thread t JOIN subforum s ON t.subforum_id = s.subforum_id) JOIN category c ON s.category_id = c.category_id \
             WHERE t.thread_id = ?';

  db.query({
    sql: sql,
    timeout: 40000, // 40s
    values: [thread_id]
  }, function (error, results, fields) {
    if (error) {
      console.error('error connecting: ' + error.stack);
      return;
    }
    console.log(results)
    res.send(results);
  });
});

/* Backup code ---> using cursor to iterate through rows

app.get('/comments',(req,res)=>{

  thread_id = req.query.thread_id;

  var MongoClient = mongoDB.MongoClient;
  var url = "mongodb://localhost/";
  var comments_list = []

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("proto_reddit");
    var cursor = dbo.collection("comments").find({parent_id: "t"+thread_id});
    cursor.forEach(function(doc,err){
      comments_list.push(doc)
    },function(){
      db.close();
      res.send(comments_list);
    });
  });
});

*/
app.get('/comments',(req,res)=>{

  thread_id = req.query.thread_id;
  console.log(thread_id)

  var MongoClient = mongoDB.MongoClient;
  var url = "mongodb://localhost/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("proto_reddit");
    dbo.collection("comments").findOne({_id: "t"+thread_id}, function(err, result) {
        if (err) throw err;
        if (result==null){
          output = [];
        }
        else
        {
          output = result.child;
        }
        console.log(output);
        db.close();
        res.send(output);
      });
  });
});

app.get('/subcomments',(req,res)=>{

  comment_id = req.query.comment_id;

  var MongoClient = mongoDB.MongoClient;
  var url = "mongodb://localhost/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("proto_reddit");
    dbo.collection("comments").findOne({_id: comment_id}, function(err, result) {
        if (err) throw err;
        if (result==null){
          output = [];
        }
        else
        {
          output = result.child;
        }
        console.log(output);
        db.close();
        res.send(output);
      });
  });
});


// ESTABLISH SERVER PORT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port '+PORT));
