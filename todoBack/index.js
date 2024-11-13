// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT
const URI = process.env.mongodb_uri

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(URI).then(()=>{
    console.log("database is connected");
    
})
.catch((err)=>{
   console.log(err);
   
})

// Define item schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// Add item
app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  const newItem = new Item({ name, description });
  try {
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.get("/items/home",(req,res)=>{
  res.send('Welcome to the home page')
})

// Find items by name or description
app.get('/items/search', async (req, res) => {
  const { query } = req.query; // Use query parameter for search term
  try {
    const items = await Item.find({
      $or: [{ name: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }],
    });
    res.json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete item by ID
app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});