var express = require('express');
var router = express.Router();
var util = require("util");
var fs = require("fs");
var path = require('path');
const { MongoClient } = require('mongodb');
const url = "mongodb+srv://admin:admin@cluster0.1uqfh.mongodb.net/anainfo?retryWrites=true&w=majority";
var arrayval = [], adminarrayval = [];
const client = new MongoClient(url);
var MongoClient1 = require('mongodb').MongoClient;

async function mongoconnect() {
	try {
		await client.connect();
		const admin = client.db("anainfo").collection("admin");
		const worker = client.db("anainfo").collection("worker");
		try {
			arrayval = await worker.find().toArray();
			adminarrayval = await admin.find().toArray();
		}
		catch {
			console.log("aaaa");
		}

	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

mongoconnect().catch(console.error);

async function mongoinsert(value) {
	try {
		MongoClient1.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("anainfo");
			console.log(value.username);
			var myobj = { username: value.username, email: value.email, password: value.password };
			dbo.collection(value.collection).insertOne(myobj, function(err, res) {
				if (err) throw err;
				console.log("1 document inserted");
				if(value.collection === "worker"){
					delete value["collection"]
					arrayval.push(value);
				}
				else if(value.collection === "admin"){
					delete value["collection"]
					adminarrayval.push(value);
				}
				
			  db.close();
			});
		  });
	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

router.get('/', function (req, res, next) {
	var db = req.con;
	var data = "";
	db.query('SELECT * FROM worker', function (err, rows) {
		console.log(rows);
		var data = rows;
		console.log("Outside--" + data.id);
		res.send(data);
		// res.render('userIndex', { title: 'User Information', dataGet: data });
	});
});
router.get('/admin', function (req, res, next) {
	var db = req.con;
	var data = "";
	db.query('SELECT * FROM admin', function (err, rows) {
		var data = rows;
		res.send(data);
	});
});

router.get('/index', function (req, res, next) {
	var db = req.con;
	var data = "";
	db.query('SELECT * FROM worker', function (err, rows) {
		console.log(rows);
		var data = rows;
		// 	data.map((datum) =>{
		// 		"power1" == datum.password && "powerpauljoseph008@gmail.com" == datum.email && res.render('userIndex', { title: 'Power', dataGet: data });
		// 		console.log(datum.password);
		//    });
		res.render('userIndex', { title: 'User Information', dataGet: data });
	});
});


router.post('/addUser', function (req, res, next) {
	// var db = req.con;
	// console.log("FormData "+ JSON.stringify(req.body));
	// db.query("SELECT * FROM worker WHERE email LIKE '" + req.body.email + "'", function (err, rows) {
	// 	if (rows.length == 0) {
	// 		console.log(rows);
	// 		db.query('INSERT INTO worker set ? ', req.body, function (err, rows) {
	// 			res.send("Email is registered successfully");
	// 		});
	// 	}
	// 	else
	// 		res.send("this Email is already registered");
	// });
	const result = arrayval.find(value => value.email === req.body.email);
	if (result) {
		res.send("this Email is already registered");
	}
	else {
		var value = req.body;
		value["collection"] = "worker";
		// console.log(value);
		mongoinsert(value);
		res.send("Email is registered successfully");
	}
});

router.post('/addAdmin', function (req, res, next) {
	// var db = req.con;
	// console.log("FormData "+ JSON.stringify(req.body));
	// db.query("SELECT * FROM admin WHERE email LIKE '" + req.body.email + "'", function(err,rows){
	// 	if(rows.length == 0){
	// 		console.log(rows);
	// 		db.query('INSERT INTO admin set ? ', req.body , function(err,rows){
	// 			//if(err) throw err;
	// 			// console.log(rows);
	// 			res.send("Email is registered successfully");
	// 		});
	// 	}
	// 	else
	// 		res.send("this Email is already registered");
	// });
	const result = adminarrayval.find(value => value.email === req.body.email);
	if (result) {
		res.send("this Email is already registered");
	}
	else {
		var value = req.body;
		value["collection"] = "admin";
		// console.log(value);
		mongoinsert(value);
		res.send("Email is registered successfully");
	}

});

router.post('/loginUser', function (req, res, next) {
	// var db = req.con;	
	// const login = db.query('SELECT * FROM worker',function(err,rows){
	// 	var datalength = rows.length;
	// 	rows.map((datum,index) =>{

	// 		if(req.body.password == datum.password && req.body.email == datum.email){
	// 			loginsuccess("success");
	// 		}
	// 		else if(datalength == index+1){
	// 			loginsuccess("fail");
	// 		}
	// 	});
	//    console.log(login);
	// });

	let loginstatus = true;
	function loginval(val) {
		console.log(loginstatus);
		if (loginstatus) {
			console.log("send");
			res.send(val);
			loginstatus = !loginstatus;
		}
	}
	var datalength = arrayval.length;
	arrayval.map((val, index) => {
		console.log("loop");
		if (req.body.password === val.password && req.body.email === val.email) {
			console.log("success");
			loginval("success");
		}
		else if (datalength === index + 1) {
			loginval("fail");
		}
	});
});

router.post('/loginAdmin', function (req, res, next) {
	// var db = req.con;	
	// db.query('SELECT * FROM admin',function(err,rows){
	// var datalength = rows.length;
	// rows.map((datum,index) =>{

	// if(req.body.password == datum.password && req.body.email == datum.email){
	// 	loginsuccess("success");
	// }
	// else if(datalength == index+1){
	// 	loginsuccess("fail");
	// }
	// });
	//    console.log(login);
	// });

	let adminloginstatus = true;
	function loginval(val) {
		console.log(adminloginstatus);
		if (adminloginstatus) {
			console.log("send");
			res.send(val);
			adminloginstatus = !adminloginstatus;
		}
	}
	var datalength = adminarrayval.length;
	adminarrayval.map((val, index) => {
		console.log("loop");
		if (req.body.password === val.password && req.body.email === val.email) {
			console.log("success");
			loginval("success");
		}
		else if (datalength === index + 1) {
			loginval("fail");
		}
	});
	// var picked = lodash.filter(arr, x => x.city === 'Amsterdam');
});

module.exports = router;