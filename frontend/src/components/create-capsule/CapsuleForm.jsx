import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import TitleInput from "../../src/components/create-capsule/TitleInput";
import DescriptionInput from "../../src/components/create-capsule/DescriptionInput";
import ImageUpload from "../../src/components/create-capsule/ImageUpload";
import VideoUrlList from "../../src/components/create-capsule/VideoUrlList";
import RecipientListInput from "../../src/components/create-capsule/RecipientListInput";
import TriggerTypeSelect from "../../src/components/create-capsule/TriggerTypeSelect";
import TriggerDatePicker from "../../src/components/create-capsule/TriggerDatePicker";
import { useNavigate } from "react-router-dom";
import AuthenticatedNavbar from "../../src/components/AuthenticatedNavbar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function CapsuleForm() {
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
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (key, val) => setFields((f) => ({ ...f, [key]: val }));

  const validate = () => {
    if (!fields.title || !fields.description || fields.recipients.length === 0)
      return "Title, Description, and at least one recipient are required.";
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

      fields.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
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

      const res = await fetch("http://localhost:3000/api/capsules", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        navigate("/capsule-list");
      } else {
        const data = await res.json();
        setError(data.message || "Error creating capsule.");
      }
    } catch (err) {
      setError("Network error, try again." + err);
    }
    setLoading(false);
  };

  return (
    <div>
      <AuthenticatedNavbar />
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
                Create a Memory Capsule
              </h1>
              <p className="text-center text-slate-400 mt-2">
                Preserve your memories with messages, images, and videos to be
                delivered in the future.
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
                    {loading ? "Creating…" : "Create Capsule"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
