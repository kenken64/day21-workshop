const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

var pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'password@123',
    database: 'rsvpdb',
    connectionLimit: 5
});

const GET_ALL_RSVP = "SELECT id,name, status FROM rsvp";
const SAVE_ONE_RSVP = "INSERT INTO rsvp (name, status) VALUES (?, ?)";

var makeQuery = function(sql, pool) {
    console.log("SQL : " + sql);
    return function(args){
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, conn){
                if(err){
                    reject(err);
                    return;
                }

                conn.query(sql, args || [], (err, results)=>{
                    conn.release();
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            });
        });
    }
};

var findAll = makeQuery(GET_ALL_RSVP, pool);
var saveOne = makeQuery(SAVE_ONE_RSVP, pool);

app.get('/rsvp', function(req, res){
    findAll().then((results)=>{
        res.status(200).json(results);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error);
    })
});


app.post('/rsvp', function(req, res){
    console.log(req.body);
    var rsvpBody  = bodyToJSON(req.body);
    console.log("rsvpBody.statu " + rsvpBody.status);
    saveOne([rsvpBody.user, rsvpBody.status]).then((results)=>{
        console.log('resutls > ' + results);
        results.values =  rsvpBody;
        res.status(200).json(results);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error);
    })
});


function bodyToJSON(_body){
    var rsvpBodystr = JSON.stringify(_body);
    var rsvpBody = JSON.parse(rsvpBodystr);
    return rsvpBody;
}

const NODE_PORT = process.env.PORT;

app.listen(NODE_PORT, function(){
    console.log("Express server started, Listening at " + NODE_PORT);
});