export default function TitleInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        Capsule Title
      </label>
      <input
        type="text"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded bg-slate-800 border border-cyan-300 text-white placeholder:text-slate-400"
        placeholder="A special memory…"
      />
    </div>
  );
}
