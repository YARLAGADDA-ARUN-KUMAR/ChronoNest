import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthenticatedNavbar from "../../src/components/AuthenticatedNavbar";
import TitleInput from "../../src/components/create-capsule/TitleInput";
import DescriptionInput from "../../src/components/create-capsule/DescriptionInput";
import ImageUpload from "../../src/components/create-capsule/ImageUpload";
import VideoUrlList from "../../src/components/create-capsule/VideoUrlList";
import RecipientListInput from "../../src/components/create-capsule/RecipientListInput";
import TriggerTypeSelect from "../../src/components/create-capsule/TriggerTypeSelect";
import TriggerDatePicker from "../../src/components/create-capsule/TriggerDatePicker";

export default function CapsuleEditForm() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCapsule() {
      try {
        const res = await fetch(`http://localhost:3000/api/capsules/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const normalizedRecipients = (data.capsule.recipients || []).map(
          (r) => {
            if (r.email) return { type: "email", value: r.email };
            if (r.whatsapp) return { type: "whatsapp", value: r.whatsapp };
            return { type: "email", value: "" };
          }
        );

        setFields({
          ...data.capsule,
          recipients: normalizedRecipients,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch capsule.");
      }
      setLoading(false);
    }

    if (token) fetchCapsule();
  }, [id, token]);

  const handleChange = (key, val) => setFields((f) => ({ ...f, [key]: val }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", fields.title);
      formData.append("description", fields.description);

      fields.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        } else if (typeof img === "string") {
          formData.append("existingImages", img);
        }
      });

      const validVideos = fields.videos.filter((video) => video.trim() !== "");
      validVideos.forEach((video, index) => {
        formData.append(`videos[${index}]`, video);
      });

      const recipientsToSend = fields.recipients
        .filter((recipient) => recipient.value.trim())
        .map((recipient) => ({
          type: recipient.type,
          value: recipient.value.trim(),
        }));

      formData.append("recipients", JSON.stringify(recipientsToSend));
      formData.append("triggerType", fields.triggerType);
      formData.append("triggerDate", fields.triggerDate);

      const res = await fetch(`http://localhost:3000/api/capsules/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        navigate(`/capsule/${id}`);
      } else {
        const data = await res.json();
        setError(data.message || "Error updating capsule.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Network error: " + err.message);
    }

    setLoading(false);
  };

  if (loading)
    return (
      <div>
        <AuthenticatedNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg text-cyan-300">Loading…</div>
        </div>
      </div>
    );
  if (!fields) return <div>{error || "Capsule not found"}</div>;

  return (
    <div>
      <AuthenticatedNavbar />
      <div className="min-h-screen flex flex-col items-center justify-start pt-24 pb-10 px-6 bg-chrononest">
        <div className="w-full max-w-3xl mx-auto">
          <form
            className="space-y-8 bg-slate-900/70 rounded-xl shadow-lg p-8"
            onSubmit={onSubmit}
          >
            <TitleInput
              value={fields.title}
              onChange={(val) => handleChange("title", val)}
            />
            <DescriptionInput
              value={fields.description}
              onChange={(val) => handleChange("description", val)}
            />
            <ImageUpload
              images={fields.images}
              setImages={(imgs) => handleChange("images", imgs)}
            />
            <VideoUrlList
              videoUrls={fields.videos}
              setVideoUrls={(urls) => handleChange("videos", urls)}
            />
            <RecipientListInput
              recipients={fields.recipients}
              setRecipients={(r) => handleChange("recipients", r)}
            />
            <TriggerTypeSelect
              triggerType={fields.triggerType}
              onChange={(type) => handleChange("triggerType", type)}
            />
            {fields.triggerType === "date" && (
              <TriggerDatePicker
                triggerDate={fields.triggerDate}
                onChange={(date) => {
                  const isoDate =
                    date instanceof Date ? date.toISOString() : date;
                  handleChange("triggerDate", isoDate);
                }}
              />
            )}
            {error && (
              <div className="text-red-400 text-center mb-2">{error}</div>
            )}
            <div className="flex gap-4 justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 text-black font-bold px-7 py-2 rounded-lg hover:bg-yellow-300"
              >
                {loading ? "Updating…" : "Update Capsule"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/capsule/${id}`)}
                className="bg-cyan-500 text-black font-bold px-7 py-2 rounded-lg hover:bg-cyan-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
