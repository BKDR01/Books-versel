import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { IoMdCloudDownload } from "react-icons/io";
import { Calendar } from "primereact/calendar";
import useBookStore from "../../store/useBookStore";

const FormBlock = ({
  index,
  items,
  format,
  books,
  handleFileAdd,
  handleFileRemove,
  files = {},
  onChange,
  initialData,
  onFileChange,
}) => {
  const [localData, setLocalData] = useState(initialData || {});

  useEffect(() => {
    setLocalData(initialData || {});
  }, [initialData]);

  const handleInput = (key, value) => {
    const updatedData = { ...localData, [key]: value };
    setLocalData(updatedData);
    onChange(key, value);
  };

  const getCalendarDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  return (
    <div className="mt-[24px] pt-[24px] border-t border-[#e5e7eb]">
      <div className="flex items-center justify-between flex-wrap">
        <label className="flex flex-wrap w-[330px] gap-[12px] text-[#3A3541] text-[14px]">
          Book Name
          <input
            type="text"
            className="w-[330px] py-[13px] pl-[10px] text-[14px] rounded-[8px] bg-[#F4F5F9] border border-[#DBDCDE] focus:outline-0"
            value={localData.title || ""}
            onChange={(e) => handleInput("title", e.target.value)}
          />
        </label>

        <label className="flex flex-wrap w-[150px] gap-[12px] text-[#3A3541] text-[14px]">
          Number of pages
          <input
            type="number"
            className="w-[150px] py-[13px] pl-[10px] text-[14px] rounded-[8px] bg-[#F4F5F9] border border-[#DBDCDE] focus:outline-0"
            placeholder="123"
            value={localData.pages || ""}
            onChange={(e) => handleInput("pages", e.target.value)}
          />
        </label>

        <label className="flex flex-wrap w-[150px] gap-[12px] text-[#3A3541] text-[14px]">
          Language
          <Dropdown
            value={localData.language || null}
            onChange={(e) => handleInput("language", e.value)}
            options={items}
            optionLabel="label"
            optionValue="value"
            placeholder="Select Language"
            className="w-[150px] bg-[#F4F5F9] border py-[13px] px-[5px] border-[#DBDCDE] rounded-[8px]"
          />
        </label>

        <div className="w-[100%] flex flex-wrap gap-[30px] mt-[30px]">
          <label className="flex flex-wrap w-[330px] gap-[12px] text-[#3A3541] text-[14px]">
            Book format
            <Dropdown
              value={localData.format || null}
              onChange={(e) => handleInput("format", e.value)}
              options={format}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Format"
              className="w-[330px] h-[46px] flex items-center bg-[#F4F5F9] border border-[#DBDCDE] rounded-[8px]"
            />
          </label>

          <label className="flex flex-wrap w-[330px] gap-[12px] text-[#3A3541] text-[14px]">
            Book
            <Dropdown
              value={localData.book || null}
              onChange={(e) => handleInput("book", e.value)}
              options={books}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Book"
              className="w-[330px] h-[46px] flex items-center bg-[#F4F5F9] border border-[#DBDCDE] rounded-[8px]"
            />
          </label>

          <label className="flex flex-wrap w-[45%] gap-[12px] text-[#3A3541] text-[14px]">
            Published Year
            <Calendar
              dateFormat="mm/dd/yy"
              placeholder="MM/DD/YYYY"
              mask="99/99/9999"
              value={getCalendarDate(localData.publishedYear)}
              onChange={(e) => {
                if (e.value) {
                  handleInput("publishedYear", e.value.toISOString());
                } else {
                  handleInput("publishedYear", null);
                }
              }}
              className="w-full mt-[10px]"
              inputClassName="bg-[#F4F5F9] text-[#3A3541] border border-[#DBDCDE] rounded-[8px] px-3 py-2 h-[46px] w-full focus:outline-none"
            />
          </label>

          <label className="flex flex-wrap w-[45%] gap-[12px] text-[#3A3541] text-[14px]">
            Author
            <input
              type="text"
              className="w-[330px] py-[13px] pl-[10px] text-[14px] rounded-[8px] bg-[#F4F5F9] border border-[#DBDCDE] focus:outline-0"
              value={localData.author || ""}
              onChange={(e) => handleInput("author", e.target.value)}
            />
          </label>

          <label className="flex flex-wrap w-[100%] gap-[12px] text-[#3A3541] text-[14px]">
            Description
            <textarea
              rows={3}
              className="w-full py-[10px] px-[10px] text-[14px] rounded-[8px] resize-none bg-[#F4F5F9] border border-[#DBDCDE] focus:outline-0"
              value={localData.description || ""}
              onChange={(e) => handleInput("description", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="mt-[24px] bg-[#F4F5F9] rounded-[8px] w-[100%] px-[30px] py-[18px]">
        <p className="text-[14px] mb-[10px]">Starting File</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <label className="border-2 border-dashed border-[#6E39CB] rounded-lg p-6 text-center cursor-pointer hover:bg-[#6E39CB]/5">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onFileChange(e);
                }
              }}
            />
            <p className="text-[#6E39CB] text-xl mb-1 flex justify-center">
              <IoMdCloudDownload />
            </p>
            <p className="text-sm text-[#6E39CB]">
              <span className="underline font-medium">Click to upload</span> or
              drag and drop
              <br />
              <span className="text-xs text-gray-500">
                SVG, PNG, JPG (max 800x400px)
              </span>
            </p>
          </label>
          <label className="border-2 border-dashed border-[#6E39CB] rounded-lg p-6 text-center cursor-pointer hover:bg-[#6E39CB]/5">
            <input
              type="file"
              accept=".pdf,.epub,.azw3,.doc"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileAdd(index, e.target.files[0]);
                }
              }}
            />
            <p className="text-[#6E39CB] text-xl mb-1 flex justify-center">
              <IoMdCloudDownload />
            </p>
            <p className="text-sm text-[#6E39CB]">
              <span className="underline font-medium">Click to upload</span> or
              drag and drop
              <br />
              <span className="text-xs text-gray-500">
                PDF, EPUB, AZW3 or DOC (max 10 mb)
              </span>
            </p>
          </label>
        </div>
       {files[index] && (
  <div className="mt-4 grid grid-cols-2 gap-4">
    {['image', 'file'].map((type) => (
      files[index][type] && (
        <div
          key={type}
          className="flex items-center gap-4 p-3 border rounded-lg bg-white shadow-sm relative group"
        >
          {/* Превью или иконка */}
          {type === 'image' ? (
            <img
              src={URL.createObjectURL(files[index][type])}
              alt="preview"
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded">
              <span className="text-red-600 font-bold text-lg">PDF</span>
            </div>
          )}

          {/* Информация о файле */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {files[index][type].name}
            </p>
            <p className="text-xs text-gray-500">
              {(files[index][type].size / 1024).toFixed(0)} Kb
            </p>

            {/* Прогресс (пока статично 80%) */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">80%</span>
            </div>
          </div>

          {/* Крестик удалить */}
          <button
            onClick={() => handleFileRemove(index, type)}
            className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
          >
            ✖
          </button>
        </div>
      )
    ))}
  </div>
)}

      </div>
    </div>
  );
};

export default FormBlock;
