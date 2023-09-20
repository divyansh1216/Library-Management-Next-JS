import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/router'; 

const BookForm = () => {
  const router = useRouter(); 
  const handleBook = () => {
    router.push('/components/books');
  };

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Create a new book object with the form data
    const newBook = {
      id: parseInt(id),
      title,
      categoryId: parseInt(categoryId),
      description,
      image,
    };

    // Send the new book data to your API endpoint
    try {
      const response = await fetch('http://127.0.0.1:5432/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        // Book created successfully
        console.log('Book created successfully');
        // Clear the form fields
        setId('');
        setTitle('');
        setCategoryId('');
        setDescription('');
        setImage('');
      } else {
        console.error('Failed to create book');
      }
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="bg-blue-500 py-4">
          <h2>Create a New Book</h2>
          <div className="flex space-x-4">
            <div>
              <input
                type="number"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={{ color: 'black' }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ color: 'black' }}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Category ID"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ color: 'black' }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ color: 'black' }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={{ color: 'black' }}
              />
            </div>
            <button type="submit">Post Book</button>
          </div>
        </div>
      </form>
    </>
  );
}

export default BookForm;


