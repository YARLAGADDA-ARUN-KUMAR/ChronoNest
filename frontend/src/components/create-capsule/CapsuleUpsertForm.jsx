import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import ImageUpload from "./ImageUpload";
import VideoUrlList from "./VideoUrlList";
import RecipientListInput from "./RecipientListInput";
import TriggerTypeSelect from "./TriggerTypeSelect";
import TriggerDatePicker from "./TriggerDatePicker";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function CapsuleUpsertForm({ capsule, onSave, mode }) {
  const [fields, setFields] = useState({
    title: "",
    description: "",
    images: [],
    videos: [""],
    recipients: [{ type: "email", value: "" }],
    triggerType: "date",
    triggerDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (capsule) {
      const normalizedRecipients = (capsule.recipients || []).map((r) => {
        if (r.email) return { type: "email", value: r.email };
        if (r.whatsapp) return { type: "whatsapp", value: r.whatsapp };
        return { type: "email", value: "" };
      });
      setFields({
        ...capsule,
        recipients: normalizedRecipients,
        videos:
          capsule.videos && capsule.videos.length > 0 ? capsule.videos : [""],
      });
    }
  }, [capsule]);

  const handleChange = (key, val) => setFields((f) => ({ ...f, [key]: val }));

  const validate = () => {
    if (!fields.title || !fields.description)
      return "Title and Description are required.";

    const validRecipients = fields.recipients.filter(
      (recipient) => recipient.value && recipient.value.trim()
    );
    if (validRecipients.length === 0)
      return "At least one recipient is required.";

    if (fields.triggerType === "date" && !fields.triggerDate)
      return "Pick a date.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const valError = validate();
    if (valError) return setError(valError);
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", fields.title);
      formData.append("description", fields.description);
      formData.append("triggerType", fields.triggerType);
      formData.append("triggerDate", fields.triggerDate);

      fields.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      const validVideos = fields.videos.filter(
        (video) => video && video.trim() !== ""
      );
      validVideos.forEach((video, index) => {
        formData.append(`videos[${index}]`, video);
      });

      const recipientsToSend = fields.recipients
        .filter((recipient) => recipient.value && recipient.value.trim())
        .map((recipient) => ({
          type: recipient.type,
          value: recipient.value.trim(),
        }));

      formData.append("recipients", JSON.stringify(recipientsToSend));

      await onSave(formData);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 pb-10 px-6 bg-chrononest">
      <div className="w-full max-w-3xl mx-auto">
        <Card
          className={`
            relative bg-transparent backdrop-blur-none border border-[rgb(113,245,255)]
            rounded-2xl text-white shadow-[0_0_20px_rgba(113,245,255,0.5)]
            transition-all duration-500
            before:absolute before:inset-0 before:rounded-2xl
            before:border before:border-[rgb(113,245,255)]
            before:opacity-50 before:blur-md before:pointer-events-none
          `}
        >
          <CardHeader className="pt-10 pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">
              {mode === "create"
                ? "Create a Memory Capsule"
                : "Edit Memory Capsule"}
            </h1>
            <p className="text-center text-slate-400 mt-2">
              {mode === "create"
                ? "Preserve your memories with messages, images, and videos to be delivered in the future."
                : "Update your existing capsule's content and settings."}
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form className="space-y-8" onSubmit={onSubmit}>
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
              <div className="flex gap-3 justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {loading
                    ? mode === "create"
                      ? "Creating…"
                      : "Updating…"
                    : mode === "create"
                    ? "Create Capsule"
                    : "Update Capsule"}
                </button>
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  onClick={() =>
                    navigate(
                      mode === "create"
                        ? "/dashboard"
                        : `/capsule/${capsule._id}`
                    )
                  }
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
