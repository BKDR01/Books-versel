import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateNews } from "../../api/auth";
import { Calendar } from "primereact/calendar";

export default function EditNews({ initialData, onUpdateSuccess }) {
  const { register, handleSubmit, setValue } = useForm();
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("context", initialData.context);
      setValue("source", initialData.source);
      setValue("language", initialData.language);
      setValue("active", initialData.active);
      setDate(new Date(initialData.publication_date));
      setPreviewThumbnail(initialData.thumbnail);
      setPreviewImages(initialData.images || []);
    }
  }, [initialData, setValue]);

  const onSubmit = async (formData) => {
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("context", formData.context);
      fd.append("publication_date", date?.toISOString().split("T")[0]);
      fd.append("source", formData.source);
      fd.append("language", formData.language);
      fd.append("active", formData.active);

      if (thumbnail) {
        fd.append("thumbnail", thumbnail);
      }
      if (images.length > 0) {
        images.forEach((img) => {
          fd.append("images", img);
        });
      }

      await updateNews(initialData.id, fd);
      alert("News updated successfully ✅");
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit News</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("title")}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />
        <textarea
          {...register("context")}
          placeholder="Context"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("source")}
          placeholder="Source"
          className="w-full border p-2 rounded"
        />
        <select {...register("language")} className="w-full border p-2 rounded">
          <option value="UZ">UZ</option>
          <option value="RU">RU</option>
          <option value="EN">EN</option>
        </select>
        <select {...register("active")} className="w-full border p-2 rounded">
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <Calendar
          value={date}
          onChange={(e) => setDate(e.value)}
          dateFormat="yy-mm-dd"
          showIcon
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
          {previewThumbnail && (
            <img
              src={typeof previewThumbnail === "string" ? previewThumbnail : URL.createObjectURL(previewThumbnail)}
              alt="Thumbnail preview"
              className="w-32 h-32 object-cover mt-2"
            />
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages([...e.target.files])}
          />
          <div className="flex gap-2 flex-wrap mt-2">
            {previewImages.map((img, i) => (
              <img
                key={i}
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                alt="Preview"
                className="w-24 h-24 object-cover"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}