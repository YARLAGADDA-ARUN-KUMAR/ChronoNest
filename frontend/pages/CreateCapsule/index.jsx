import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthenticatedNavbar from "../../src/components/AuthenticatedNavbar";
import CapsuleUpsertForm from "../../src/components/create-capsule/CapsuleUpsertForm";

export default function CreateCapsule() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSave = async (formData) => {
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
      throw new Error(data.message || "Error creating capsule.");
    }
  };

  return (
    <div>
      <AuthenticatedNavbar />
      <CapsuleUpsertForm onSave={handleSave} mode="create" />
    </div>
  );
}
