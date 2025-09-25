import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddBook from './../../Components/AddBook/AddBook.jsx';
import BookCard from './../../Components/BookCard/BookCard.jsx';
import EditBook from './../../Components/EditBooks/EditBook.jsx';

const API_BASE = 'https://lib.qaxramonov.uz/api/v1/admin/books';

const Book = () => {
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      console.warn('❌ Токен отсутствует. Перенаправление на страницу входа.');
      // window.location.href = '/login';
      return;
    }
    fetchBooks();
  }, [token]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getBooks/all`, {
        params: { page: 1, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data.data);
    } catch (err) {
      console.error('❌ Ошибка загрузки книг:', err.response?.data || err.message);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
      console.log(`✅ Книга с ID ${id} успешно удалена.`);
    } catch (err) {
      console.error('❌ Ошибка удаления книги:', err.response?.data || err.message);
      alert('Не удалось удалить книгу.');
    }
  };

  return (
    <div className="w-[100%] mx-auto p-5 rele">
      <div className='w-full flex justify-end items-center'>
        <button
          onClick={() => setIsAdding(true)}
          className='p-2 bg-green-500 rounded-md text-white'
        >
          Add Book +
        </button>
      </div>

      <div className='w-[800px] pt-[20px] rounded-md mx-auto bg-white'>

      {isAdding && (
        <div className=" bg-opacity-50 flex items-center justify-center">
          <AddBook
            onClose={() => setIsAdding(false)}
            onUpdate={fetchBooks}
          />
        </div>
      )}

        {editingBookId && (
          <div className="flex items-center justify-center fixed top-[0px] bg-black/10 bg-opacity-50">
            <EditBook
              bookId={editingBookId}
              onClose={() => setEditingBookId(null)}
              onUpdate={fetchBooks}
            />
          </div>
        )}

      <div className='w-[750px] mt-[50px] mx-auto flex-wrap gap-[10px] p-2'>
        {books.map((book) => (
          <BookCard 
            key={book.id} 
            book={book} 
            onEdit={() => setEditingBookId(book.id)}
            onDelete={deleteBook} 
          />
        ))}
      </div>

      </div>

    </div>
  );
};

export default Book;