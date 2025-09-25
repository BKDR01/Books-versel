import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormBlock from './../FormBlock/FormBlock.jsx';

const API_BASE = 'https://lib.qaxramonov.uz/api/v1/admin/books';

function EditBook({ bookId, onClose, onUpdate }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const yourToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchBookData = async () => {
      if (!yourToken) {
        onClose();
        return;
      }
      if (!bookId) {
        setError('Не удалось найти ID книги.');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/${bookId}`, {
          headers: { Authorization: `Bearer ${yourToken}` },
        });
        if (res.data) {
          setFormData(res.data);
        } else {
          setError('Данные книги не были получены.');
        }
        setLoading(false);
      } catch (err) {
        console.error('❌ Ошибка загрузки данных книги:', err.response?.data || err.message);
        setError('Не удалось загрузить данные книги. Проверьте ID или токен.');
        setLoading(false);
      }
    };
    fetchBookData();
  }, [bookId, yourToken, onClose]);

  const handleFormDataChange = (key, value) => {
    setFormData(prevData => ({ ...prevData, [key]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const updateBook = async () => {
    if (!formData || !formData.title || !formData.pages) {
      alert('❌ Название и количество страниц обязательны!');
      return;
    }

    try {
      const formDataToSend = new FormData();

   Object.entries({
  title: formData.title,
  pages: Number(formData.pages),
  language: formData.language,
  format: formData.format,
  category: formData.category, 
  publishedYear: formData.publishedYear,
  author: formData.author,
  description: formData.description
}).forEach(([key, value]) => {
  if (value !== undefined && value !== null && value !== '') {
    formDataToSend.append(key, value);
  }
});


      if (file) {
        formDataToSend.append('image', file);
      }

      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const res = await axios.patch(
        `${API_BASE}/${bookId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${yourToken}`,
          },
        }
      );

      console.log('✅ Книга обновлена!', res.data);
      alert('Книга успешно обновлена!');
      onUpdate();
      onClose();
    } catch (err) {
      console.error('❌ Ошибка обновления:', err.response?.data || err.message);
      alert(`Ошибка при обновлении: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!formData) return <div>Книга не найдена.</div>;

  const items = [
    { label: 'Uzbekcha', value: 'UZ' },
    { label: 'Ruscha', value: 'RU' },
    { label: 'Inglizcha', value: 'EN' },
  ];
  const format = [
    { label: 'PDF', value: 'pdf' },
    { label: 'SVG', value: 'svg' },
    { label: 'PNG', value: 'png' },
    { label: 'JPG', value: 'jpg' },
  ];
  const booksCategories = [
    { label: 'Baddiy_adabiyotlar', value: 'Baddiy_adabiyotlar' },
    { label: 'Rus_adabiyotlar', value: 'Rus_adabiyotlar' },
    { label: 'O’zbek_adabiyotlari', value: 'O’zbek_adabiyotlari' },
    { label: 'Prezident_asarlari', value: 'Prezident_asarlari' },
    { label: 'Hikoyalar', value: 'Hikoyalar' },
  ];

  return (
    <div className="w-[750px] h-[950px] p-[30px] rounded-[8px] bg-white shadow-[0_0_4px_0_#00000026] mx-auto font-[Lato]">
      <div>
        <h2 className="text-[20px] font-medium">Edit Book</h2>
        <p className="text-[12.64px] text-[#89868D] mt-[10px]">Edit book data</p>
      </div>

      <FormBlock
        initialData={formData}
        onChange={handleFormDataChange}
        items={items}
        format={format}
        books={booksCategories}
        index={0}
        onFileChange={handleFileChange}
      />

      <div className="flex justify-end">
        <div className="w-[215px] flex gap-[15px] mt-[20px]">
          <button
            onClick={onClose}
            className="w-[100px] h-[32px] text-[12px] rounded-[4px] border border-[#6E39CB]"
          >
            Отмена
          </button>
          <button
            onClick={updateBook}
            className="w-[100px] h-[32px] text-[12px] rounded-[4px] bg-[#6E39CB] text-white"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditBook;
