const express = require('express')
const mongoose = require('mongoose')
const {Schema}= mongoose
const app = express()
var cors = require('cors')
app.use(express.json())
app.use(cors())
const score = new Schema({score:Number})
const HighScore = mongoose.model('HighScore', score);
app.post('/newScore',async (req,res)=>{
    const highscr = new HighScore({score:req.body.score})
    const currentHighScore = await HighScore.findOne().sort({score:-1}) 
  try {
    if(!currentHighScore || highscr.score > currentHighScore.score){
  await highscr.save();
  res.json({ message: 'High score saved successfully!' });}
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Error saving high score.' });
}
})

app.listen(3000, function () {
  console.log('CORS-enabled web server listening on port 3000')
})