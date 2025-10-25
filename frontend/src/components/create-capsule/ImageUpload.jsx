export default function ImageUpload({ images, setImages }) {
  const handleChoose = (e) => {
    setImages(Array.from(e.target.files));
  };
  return (
    <div>
      {" "}
      <label className="block text-white font-semibold mb-2">
        {" "}
        Images (optional){" "}
      </label>{" "}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChoose}
        className="w-full"
      />{" "}
      <div className="flex gap-2 flex-wrap mt-2">
        {" "}
        {images.map((img, idx) => (
          <span
            key={idx}
            className="p-1 border rounded bg-slate-700 text-xs text-slate-300"
          >
            {" "}
            {img.name}{" "}
          </span>
        ))}{" "}
      </div>{" "}
    </div>
  );
}
