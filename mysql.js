const mysql = require('mysql');

//DB Connect
module.exports = mysql.createConnection({
    host: "localhost",
    user: "goigarg",
    password: "1goigarg",
    database: "translation"
  });

