import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { addNews, updateNews } from '../../api/auth';
import NewsForm from '../../Components/NewsForm/NewsForm.jsx';
import ImageUploader from '../../Components/ImageUploader/ImageUploader.jsx';
import download from '../../assets/IMG/download.png';

const LANGUAGES = [
  { code: 'UZ', label: 'O‘zbekcha' },
  { code: 'RU', label: 'Русский' },
  { code: 'EN', label: 'English' },
];

export default function News({ initialData = null, onSuccess, isEditing }) {
  const [activeLang, setActiveLang] = useState('UZ');
  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);
  const forms = LANGUAGES.reduce((acc, { code }) => ({ ...acc, [code]: useForm() }), {});

  useEffect(() => {
    if (initialData) {
      setThumbnail(initialData.thumbnail ? { url: initialData.thumbnail } : null);
      setGallery(initialData.images?.map(img => ({ url: img })) || []);

      const langData = initialData;
      if (langData) {
        setActiveLang(langData.language);
        forms[langData.language].reset({
          title: langData.title,
          context: langData.context,
          source: langData.source,
          publication_date: new Date(langData.publication_date),
        });
      }
    }
  }, [initialData]);

  const handleFiles = (files, type) => {
    const images = files.filter(f => f.type.startsWith('image/'))
      .map(f => ({ file: f, url: URL.createObjectURL(f) }));

    if (type === 'thumbnail') {
      setThumbnail(images[0] || null);
    } else {
      const updated = [...gallery, ...images];
      setGallery(updated);
    }
  };

  const removeGalleryImage = (index) => {
    const updated = gallery.filter((_, i) => i !== index);
    setGallery(updated);
  };

  const validateForms = () => {
    if (!thumbnail?.file && !thumbnail?.url) return "Thumbnail tanlanmagan";
    if (!gallery.length) return "Galereya rasmi yuklang";
  
    const { title, context, publication_date } = forms[activeLang].getValues();
    if (!title || !context || !publication_date)
      return `${LANGUAGES.find(l => l.code === activeLang).label} tilidagi ma'lumotlar to‘liq emas`;

    return null;
  };

  const onSubmit = async () => {
    const error = validateForms();
    if (error) return alert(error);

    try {
      const { title, context, source, publication_date } = forms[activeLang].getValues();
      const fd = new FormData();

      if (thumbnail?.file) fd.append("thumbnail", thumbnail.file);
      gallery.forEach(img => img.file && fd.append("images", img.file));

      fd.append("title", title);
      fd.append("context", context);
      fd.append("source", source || "");
      fd.append("language", activeLang);
      fd.append("publication_date", new Date(publication_date).toISOString().split("T")[0]);
      fd.append("active", true);

      if (isEditing) {
        await updateNews(initialData.id, fd);
        alert("Yangilik muvaffaqiyatli yangilandi");
      } else {
        await addNews(fd);
        alert("Barcha tillardagi yangiliklar qo‘shildi");
      }

      if (onSuccess) onSuccess();
    } catch (e) {
      alert("Xatolik: " + (e.response?.data?.message || "Server xatosi"));
    }
  };

  return (
    <>
      <div className="flex gap-3 mb-6">
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setActiveLang(code)}
            className={`px-4 py-2 border rounded ${activeLang === code ? 'bg-[#6E39CB] text-white' : 'border-[#6E39CB] text-[#6E39CB]'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={e => e.preventDefault()}>
        {LANGUAGES.map(({ code }) => activeLang === code && (
          <NewsForm
            key={code}
            register={forms[code].register}
            control={forms[code].control}
            errors={forms[code].formState.errors}
          />
        ))}
        <ImageUploader
          thumbnail={thumbnail}
          galleryImages={gallery}
          handleFiles={handleFiles}
          removeGalleryImage={removeGalleryImage}
          download={download}
        />
        <div className="flex items-center gap-4 mt-6 justify-end">
          <button
            type="button"
            className='px-6 py-2 border-2 rounded-md border-[#6E39CB] text-[#6E39CB] hover:bg-[#f3f0ff] transition'
            onClick={() => { if (onSuccess) onSuccess(); }} 
          >
            Bekor qilish
          </button>
          <button
            type="button"
            className='px-6 py-2 bg-[#6E39CB] text-white rounded-md hover:bg-[#5834b4] transition'
            onClick={onSubmit}
          >
            {isEditing ? "Yangilash" : "Yangilik qo‘shish"}
          </button>
        </div>
      </form>
    </>
  );
}