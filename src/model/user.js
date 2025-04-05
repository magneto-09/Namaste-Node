const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true }
})


const User = mongoose.model("user", userSchema);  // model -> JS wrapper around Schema


/*    🚀🚀🚀🚀🚀🚀🚀🚀🚀
    this is not the way to create a new document. It's a very bad way. 
    generally we export the model via module.exports. 
    and wherever there is a need to insert data in collection of db, 
    we do it by creating APIs.
    
    */

// instance(s) of model --> document(s) -> creating manually
const newUser = new User({ name: "Piyush", age: 23, email: "spiyush1721@gmail.com" });
const newUser1 = new User({ name: "Piyush", age: 23, email: "noobm2992@gmail.com" });
const newUser2 = new User({ name: "Akshay Saini", age: 32, email: "akshayMarch09@gmail.com" });


// funcn that'll insert the user into db
const insertUser = async () => {
    // await newUser.save();
    // await newUser1.save(); 
    await newUser2.save();
}


/*
    🚀🚀🚀🚀🚀🚀🚀🚀🚀
    we're not going to call this funcn cuz everytime server will start this'll gets called
    and a new data will get inserted. 

🌟🌟 calling Manually 🌟🌟

    insertUser().then(
        () => console.log('User created successfully')
    )
    .catch(
        (e) => console.log(e)
    )

*/
