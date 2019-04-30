const mysql = require('mysql');
const express = require('express');
var cors = require('cors')
var Config = require('./config.json');

const db = mysql.createConnection({
  host     : Config.host,
  user     : Config.user,
  password : Config.password,
  database : Config.database
});

// https://github.com/mysqljs/mysql

db.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + db.threadId);
});

const app = express();
app.use(cors())

app.get('/frontpage_threads',(req,res)=>{

  let sql = 'SELECT * FROM thread t JOIN user_details u ON u.user_id = t.user_id WHERE removed=0 ORDER BY created_utc DESC LIMIT 100';

  db.query({
    sql: sql,
    timeout: 40000, // 40s
  }, function (error, results, fields) {
    if (error) {
      console.error('error connecting: ' + error.stack);
      return;
    }
    console.log(results)
    res.send(results);
    console.log(fields);
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
  });


});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port '+PORT));
