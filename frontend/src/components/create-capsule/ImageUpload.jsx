import { XCircle } from "lucide-react";

export default function ImageUpload({ images, setImages }) {
  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        Images (optional)
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white"
      />
      {images && images.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                alt={`preview ${idx}`}
                className="w-32 h-32 object-cover rounded-lg border-2 border-slate-700"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <XCircle size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
