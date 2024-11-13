import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
const App = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  // Add item to the database
  const addItem = async () => {
    setLoading(true);
    setErrorMessage("")
    try {
      const response = await axios.post('http://localhost:5000/items', {
        name: itemName,
        description: itemDescription,
      });
      alert('Item added: ' + response.data._id);
      setItemName('');
      setItemDescription('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
    finally {
      setLoading(false);
    }
  };

  // Find items by query
  const findItems = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const response = await axios.get(`http://localhost:5000/items/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      
      console.error('Error finding items:', error);
    }
    finally {
      setLoading(false);
    }
  };

  // Delete item by ID
  const deleteItem = async (id) => {
    setLoading(true)
    setErrorMessage('')
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      alert('Item deleted');
      setSearchResults(searchResults.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    finally {
      setLoading(false);
    }
  };



  return (
    <>
    <div>
      <h1>Item Manager</h1>
      
      <div>
        <h3>Add Item</h3>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Item Description"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
        />
        <button onClick={addItem}>Add Item</button>
      </div>

      <div>
        <h3>Find Items by Name or Description</h3>
        <input
          type="text"
          placeholder="Search Query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={findItems}>Find Items</button>

        <ul>
          {searchResults.map(item => (
            <li key={item._id}>
              {item.name} - {item.description}
              <button onClick={() => deleteItem(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>

    </>
  )
}

export default App