import React, { useEffect, useState } from "react";
import { getAllAdminNews, deleteNews, getNewsById } from "../../api/auth";
import News from "./../News/News.jsx";

const LANGUAGES = [
  { label: "Barcha tillar", value: "ALL" },
  { label: "O‘zbekcha", value: "UZ" },
  { label: "Русский", value: "RU" },
  { label: "English", value: "EN" },
];

export default function DeleteNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNews, setShowNews] = useState(false);
  const [selectedLang, setSelectedLang] = useState("ALL");
  const [editingNews, setEditingNews] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const langParam = selectedLang === "ALL" ? undefined : selectedLang;
      const res = await getAllAdminNews({
        page: 1,
        limit: 1000,
        language: langParam,
        t: Date.now(),
      });
      const allNews = res?.data?.data || [];
      setNewsList(allNews);
      setError(allNews.length ? null : "Yangiliklar topilmadi.");
    } catch {
      setError("Yangiliklarni yuklashda xatolik yuz berdi.");
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const targetNews = newsList.find((n) => n.id === id);
    if (!targetNews) return alert("Yangilik topilmadi");

    if (!window.confirm("Rostdan ham ushbu yangilik va unga bog‘liq barcha tillarni o‘chirmoqchimisiz?")) return;

    const groupId = targetNews.groupId || targetNews.id;
    try {
      setNewsList((prev) => prev.filter((n) => (n.groupId || n.id) !== groupId));
      const relatedNews = newsList.filter((n) => (n.groupId || n.id) === groupId);
      for (const n of relatedNews) {
        await deleteNews(n.id);
      }
      alert("Yangilik va unga bog‘liq barcha tillar o‘chirildi.");
    } catch {
      alert("Xatolik yuz berdi. Iltimos, server ishlayotganligini tekshiring.");
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const res = await getNewsById(id);
      setEditingNews(res.data);
    } catch (err) {
      console.error("Error fetching news for edit:", err);
      alert("Yangilikni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditComplete = () => {
    setEditingNews(null);
    setShowNews(false);
    fetchNews(); 
  };

  useEffect(() => {
    fetchNews(selectedLang);
  }, [selectedLang]);

  return (
    <div className="bg-white rounded-xl py-6 px-6 max-w-4xl w-full mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setShowNews((p) => !p);
            setEditingNews(null);
          }}
          className="text-gray-500 hover:text-black text-2xl font-bold"
          aria-label={showNews ? "Yashirish" : "Ko‘rsatish"}
        >
          {showNews ? "−" : "+"}
        </button>
        <h2 className="text-xl font-bold">Yangiliklar</h2>
      </div>

      {(showNews || editingNews) && (
        <div className="my-6">
          <News
            initialData={editingNews}
            onSuccess={handleEditComplete}
            isEditing={!!editingNews} 
          />
          <button
            onClick={() => {
              setShowNews(false);
              setEditingNews(null);
            }}
            className="mt-4 px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Bekor qilish
          </button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-md py-6 px-6 max-w-4xl w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Yangiliklarni boshqarish</h2>
          <div className="flex items-center gap-4">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="border rounded px-3 py-1"
            >
              {LANGUAGES.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        {loading && <p className="text-center text-gray-500">Yuklanmoqda...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && newsList.length > 0 && (
          <ul className="space-y-4">
            {newsList.map(({ id, title, language, thumbnail, images }) => (
              <li
                key={id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={thumbnail || images?.[0] || "/placeholder.jpg"}
                    alt={title}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <span className="text-sm text-gray-500">{language}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(id)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    O‘chirish
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}