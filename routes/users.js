var express = require('express');
var router = express.Router();

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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
