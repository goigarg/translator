//Required Items
const express = require('express');
const db = require('./mysql');
const https = require('https');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { response } = require('express');

//App Configuration
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//API Key
const API_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
const API = 'YOUR API';

//Server
app.get('/', function(req, res) {
    
    const title = "Hello world";
    res.render('main', {
        title: title
    });
});

app.post('/', function(req, res) {
    const word = req.body.word.toLowerCase();
    const url = API_URL + '?key=' + API + '&lang=hi' + '&text=' + word;
    db.query("SELECT hindi FROM history WHERE english = '" + word + "'", function (err, result) {
        if (result.length == 0) { //check if result is empty
            //Calling API
            https.get(url, (response) => {
                response.on('data', (data) => {
                    let langData = JSON.parse(data);
                    console.log(langData.text);
                    var text = langData.text;

                    //Saving Data in Database
                    
                        const sql = "INSERT INTO history (english, hindi) VALUES ('" + word + "', '" + text + "')";
                        db.query(sql, function (err, result) {
                          if (err) throw err;
                          console.log("1 record inserted");
                        });

                    //Rendering Response
                    res.render('res', {translation: text, type: 'Data Received from API'});
                });
            });

        } else {
            res.render('res', {translation: result[0].hindi, type: 'Data Received from Database'});
        }
    });
});

//Server Listen
app.listen('3000', () => {
    console.log('Server started at port 3000');
});
