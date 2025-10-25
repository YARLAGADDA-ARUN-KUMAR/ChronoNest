export default function VideoUrlList({ videoUrls, setVideoUrls }) {
  const handleAdd = () => setVideoUrls([...videoUrls, ""]);
  const handleChange = (idx, val) => {
    const copy = [...videoUrls];
    copy[idx] = val;
    setVideoUrls(copy);
  };
  const handleRemove = (idx) => {
    const copy = [...videoUrls];
    copy.splice(idx, 1);
    setVideoUrls(copy);
  };

  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        Video URLs (optional)
      </label>
      {videoUrls.map((url, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            value={url}
            onChange={(e) => handleChange(idx, e.target.value)}
            placeholder="https://youtube.com/watch?v=…"
            className="w-full px-3 py-2 rounded bg-slate-800 border border-cyan-300 text-white focus:ring-green-500 focus:border-green-500"
          />
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
            title="Remove video URL"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        + Add Video URL
      </button>
    </div>
  );
}
