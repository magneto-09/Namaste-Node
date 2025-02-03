// password:- qj5eC6kY5Cl2v0tt

const connectionURL= "mongodb+srv://piyushkr7431:qj5eC6kY5Cl2v0tt@fypcluster1.n4btfhm.mongodb.net/"

const {MongoClient} = require('mongodb')

const client = new MongoClient(connectionURL);  

const dbName = "ecommerce";
const collectionName = "users"; 

const main = async () => {
    await client.connect(); 
    console.log('Connected successfully to server');
    const db = client.db(dbName); 
    const collection=db.collection(collectionName); 

    // find document
    const doc = await collection.find({}).toArray(); 
    console.log(doc); 

    return "done"; 
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());