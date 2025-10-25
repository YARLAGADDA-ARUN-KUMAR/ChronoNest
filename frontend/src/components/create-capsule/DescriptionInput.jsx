export default function DescriptionInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        Description / Message
      </label>
      <textarea
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 min-h-[120px] rounded bg-slate-800 border border-cyan-300 text-white placeholder:text-slate-400"
        placeholder="Write your message, story, wish…"
      />
    </div>
  );
}
