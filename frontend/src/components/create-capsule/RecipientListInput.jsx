import { useEffect } from "react";

export default function RecipientListInput({ recipients = [], setRecipients }) {
  useEffect(() => {
    if (!Array.isArray(recipients) || recipients.length === 0) return;

    const needsFix = recipients.some((r) => !r || !r.type);
    if (!needsFix) return;

    const fixed = recipients.map((r) => {
      if (!r) return { type: "email", value: "" };

      if (!r.type) {
        const value = (r.value || "").toString();
        const guessedType = /\S+@\S+\.\S+/.test(value) ? "email" : "whatsapp";
        return { ...r, type: guessedType };
      }
      return r;
    });

    setRecipients(fixed);
  }, [recipients, setRecipients]);

  const handleAdd = () =>
    setRecipients([...recipients, { type: "email", value: "" }]);

  const handleChange = (idx, field, val) => {
    const updated = recipients.map((r, i) =>
      i === idx ? { ...r, [field]: val } : r
    );
    setRecipients(updated);
  };

  const handleRemove = (idx) => {
    setRecipients(recipients.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-white font-semibold mb-2">Recipients</label>

      {Array.isArray(recipients) &&
        recipients.map((r, idx) => {
          const effectiveType =
            r && r.type
              ? r.type
              : /\S+@\S+\.\S+/.test((r?.value || "").toString())
              ? "email"
              : "whatsapp";

          return (
            <div key={idx} className="flex gap-2 mb-2">
              <select
                value={effectiveType}
                onChange={(e) => handleChange(idx, "type", e.target.value)}
                className="rounded px-3 py-2 bg-slate-800 text-white border border-cyan-300 focus:ring-green-500 focus:border-green-500"
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </select>

              <input
                value={r?.value || ""}
                onChange={(e) => handleChange(idx, "value", e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-800 border border-cyan-300 text-white focus:ring-green-500 focus:border-green-500"
                placeholder={
                  effectiveType === "email"
                    ? "user@example.com"
                    : "+91 55555 55555"
                }
                type={effectiveType === "email" ? "email" : "text"}
              />

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                title="Remove recipient"
              >
                ✕
              </button>
            </div>
          );
        })}

      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        + Add Recipient
      </button>
    </div>
  );
}
