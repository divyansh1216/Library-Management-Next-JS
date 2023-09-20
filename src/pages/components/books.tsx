import React, { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import BookForm from './BookPost';

const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const [booksData, setBooksData] = useState<any[]>([]);
  const [showBooks, setShowBooks] = useState(true); // Show books by default
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [showCategory, setShowCategory] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [bookToUpdate, setBookToUpdate] = useState<any | null>(null);
  useEffect(() => {
    handleFetchBooks();
  }, []);

  const handleFetchCategory = async () => {
    const response = await fetch('http://127.0.0.1:5432/category');
    const categoryData = await response.json();
    setCategoryData(categoryData);
    setShowCategory(true);
    setShowBooks(false);
  };

  const handleFetchBooksByCategory = async (categoryId: number) => {
    const response = await fetch(`http://127.0.0.1:5432/category/${categoryId}/books`);
    const booksData = await response.json();
    setBooksData(booksData);
    setShowBooks(true);
    setShowCategory(false);
  };

  const handleFetchBooks = async () => {
    const response = await fetch('http://127.0.0.1:5432/books');
    const booksData = await response.json();
    setBooksData(booksData);
    setShowBooks(true);
    setShowCategory(false);
  };

 const handleSearch = async () => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`http://127.0.0.1:5432/books?query=${encodedQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const searchedBooksData = await response.json();
    setBooksData(searchedBooksData);
    setShowBooks(true);
    setShowCategory(false);
  } catch (error) {
    console.error('Error searching for books:');
  }
};

  
  const handleEditBook = (book: any) => {
    setEditingBookId(book.id);
    setBookToUpdate(book);
  };

  const handleUpdateBook = async (updatedBook: any) => {
  
      const response = await fetch(`http://127.0.0.1:5432/books/${updatedBook.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      });
      setEditingBookId(null);
      setBookToUpdate(null);
      handleFetchBooks();
     
  };

  const handleDeleteBook = async (bookId: number) => {  
      const confirmDelete = window.confirm('Are you sure you want to delete this book?');
      if (confirmDelete) {
        const response = await fetch(`http://127.0.0.1:5432/books/${bookId}`, {
          method: 'DELETE',
        });
        // For refreshing the page
        handleFetchBooks(); 
      }
  };
  const handleCheckout = (bookId: number) => {
    window.location.href = `/checkout/${bookId}`;
  };


  return (
    <div>
    <header className="bg-blue-500 py-4">
       <nav className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwDhy7svPjsbMk0RHBj4-yWtlueVW9hzVDxQ&usqp=CAU" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
          <h1 className="text-white text-2xl font-semibold">ReadCraft</h1>
        </div>
        <ul className="flex space-x-4">
          <li>
            <button onClick={handleFetchBooks}>Home</button>
          </li>
      {/* <li>
        <button onClick={handleFetchBooks}>Books</button>
      </li> */}
          <li>
            <button onClick={handleFetchCategory}>Category</button>
          </li>
          <li><a href="./BookPost">Post</a></li>
        </ul>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search books"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ color: 'black', padding: '7px' }}
          /><button onClick={handleSearch} >Search</button>
        </div>
      </nav>
    </header>
    {showBooks && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Author</th>
                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Category ID</th>
                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {booksData.map((book, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px',  textAlign: 'left' }}>{book.id}</td>
                  <td style={{ padding: '10px',  textAlign: 'left' }}>
                    {editingBookId === book.id ? (
                      <input
                      style={{ color: 'black'}}
                        type="text"
                        value={bookToUpdate?.title}
                        onChange={(e) => setBookToUpdate({ ...bookToUpdate, title: e.target.value })}
                      />
                    ) : (
                      book.title
                    )}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'left' }}>
                    {editingBookId === book.id ? (
                      <textarea
                      style={{ color: 'black'}}
                        value={bookToUpdate?.description}
                        onChange={(e) => setBookToUpdate({ ...bookToUpdate, description: e.target.value })}
                      />
                    ) : (
                      book.description
                    )}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'left' }}>
                 {book.image && (
                    <img
                      src={book.image}
                      alt={`Image for ${book.title}`}
                      style={{
                      maxWidth: '100px',
                      maxHeight: '100px',
                      cursor: 'pointer', 
                      transition: 'transform 0.2s', 
                  }}
                  onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                  }}
                  />
                  )}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'left' }}>
                    {editingBookId === book.id ? (
                      <input
                      style={{ color: 'black'}}
                        type="text"
                        value={bookToUpdate?.categoryId}
                        onChange={(e) => setBookToUpdate({ ...bookToUpdate, categoryId: e.target.value })}
                      />
                    ) : (
                      book.categoryId
                    )}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'left' }}>
                    {editingBookId === book.id ? (
                      <>
                        <button
                          onClick={() => handleUpdateBook(bookToUpdate)}
                          style={{
                            backgroundColor: 'green',
                            color: '#fff',
                            padding: '5px 10px',
                            border: 'none',
                            cursor: 'pointer',
                            marginRight: '5px',
                          }}>Save</button>
                        <button
                          onClick={() => {
                            setEditingBookId(null);
                            setBookToUpdate(null);
                          }}
                          style={{
                            backgroundColor: 'red',
                            color: '#fff',
                            padding: '5px 10px',
                            border: 'none',
                            cursor: 'pointer',
                          }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditBook(book)}
                          style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '5px 10px',
                            border: 'none',
                            cursor: 'pointer',
                            marginRight: '5px',
                          }}>Edit</button>

                        <button onClick={() => handleDeleteBook(book.id)}
                          style={{
                            backgroundColor: 'red',
                            color: '#fff',
                            padding: '5px 10px',
                            border: 'none',
                            cursor: 'pointer',
                          }}>Delete</button>
                        
                        <button style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        padding: '5px 10px',
                        border: 'none',
                        cursor: 'pointer',
                        marginLeft: '25px',}}
                      onClick={() => handleCheckout(book.id)}>Checkout</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}      
    {showCategory && (
        <div>
          <h1>List of Categories</h1>
          <table>
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((category, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{category.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{category.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                    <button onClick={() => handleFetchBooksByCategory(category.id)}>View Books</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Header;
