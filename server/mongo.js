const mongoose =require('mongoose')
mongoose.connect( "mongodb+srv://arad42761:arad111@cluster0.plcainb.mongodb.net/test")
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
  });
/* mongoose.connect('mongodb://localhost/simonsGame')
.then(x=>{console.log('connect to db')})
.catch(x=>{console.log('sorry but you have a problem with Server')
}) */