const MongoClient = require('mongodb').MongoClient;
const auth = {
	username: process.env.mongo_db_user,
	password: process.env.mongo_db_password
};
console.log('AUTH', auth)
let db = null;
const loadDB = async () => {
  if (db) {
    return db;
  }
  const client = await MongoClient.connect(
    `mongodb://127.0.0.1:${process.env.mongo_db_port}`,
    {
      // auth: auth
    }
  );
	db = client.db('tacos');
	return db;
}
module.exports = async function(context) {
	try {
		const database = await loadDB();
		let recipies = await database
			.collection('Recipies')
			.find()
			.toArray();
		context.res = {
			body: { items: recipies }
		};
	} catch(error) {
		console.log('ERROR', error)
		context.log(`Error code: ${error.code} message: ${error.message}`);
		context.res = {
			status: 500,
			body: { message: 'An error has occured, please try again later' }
		};
	}
};


// module.exports = async function (context, req) {
//     context.log('JavaScript HTTP trigger function processed a request.');

//     const name = (req.query.name || (req.body && req.body.name));
//     const responseMessage = name
//         ? "Hello, " + name + ". This HTTP triggered function executed successfully."
//         : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

//     context.res = {
//         // status: 200, /* Defaults to 200 */
//         body: responseMessage
//     };
// }