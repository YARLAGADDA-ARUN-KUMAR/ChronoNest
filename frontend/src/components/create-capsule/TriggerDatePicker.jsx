export default function TriggerDatePicker({ triggerDate, onChange }) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        Release Date
      </label>
      <input
        type="date"
        value={triggerDate}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 rounded bg-slate-800 border border-cyan-300 text-white"
      />
    </div>
  );
}
