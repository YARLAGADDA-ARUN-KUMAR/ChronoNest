import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthenticatedNavbar from "../../src/components/AuthenticatedNavbar";
import CapsuleUpsertForm from "../../src/components/create-capsule/CapsuleUpsertForm";

export default function CapsuleEditForm() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCapsule() {
      try {
        const res = await fetch(`http://localhost:3000/api/capsules/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCapsule(data.capsule);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch capsule.");
      }
      setLoading(false);
    }

    if (token) fetchCapsule();
  }, [id, token]);

  const handleSave = async (formData) => {
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
      throw new Error(data.message || "Error updating capsule.");
    }
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
  if (error) return <div>{error}</div>;

  return (
    <div>
      <AuthenticatedNavbar />
      {capsule && (
        <CapsuleUpsertForm capsule={capsule} onSave={handleSave} mode="edit" />
      )}
    </div>
  );
}
