export default function TriggerTypeSelect({ triggerType, onChange }) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        Capsule Release Type
      </label>
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="date"
            checked={triggerType === "date"}
            onChange={(e) => onChange(e.target.value)}
            className="accent-cyan-400"
          />
          <span className="text-white">Specific Date</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="butterfly"
            checked={triggerType === "butterfly"}
            onChange={(e) => onChange(e.target.value)}
            className="accent-cyan-400"
          />
          <span className="text-white">Butterfly (after heartbeat)</span>
        </label>
      </div>
    </div>
  );
}
