// import React, { useState } from 'react';

// const BookDelete = () => {
//   const [bookId, setBookId] = useState('');

//   const handleDelete = async () => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5432/books/${bookId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         // Book deleted successfully
//         console.log('Book deleted successfully');
//         // Clear the bookId field
//         setBookId('');
//       } else {
//         console.error('Failed to delete book');
//       }
//     } catch (error) {
//       console.error('Error deleting book:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Delete Book by ID</h2>
//       <div className="flex space-x-4">
//         <div>
//           <input
//             type="number"
//             placeholder="Book ID"
//             value={bookId}
//             onChange={(e) => setBookId(e.target.value)}
//             style={{ color: 'black' }}
//           />
//         </div>
//         <button onClick={handleDelete}>Delete Book</button>
//       </div>
//     </div>
//   );
// };

// export default BookDelete;
