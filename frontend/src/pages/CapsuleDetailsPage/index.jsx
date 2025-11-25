import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/config';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CapsuleDetailsPage() {
    const { id } = useParams();
    const { token } = useAuth();
    const [capsule, setCapsule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCapsule() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${API_BASE_URL}/api/capsules/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    const data = await res.json();
                    setError(data.message || 'Failed to fetch capsule.');
                } else {
                    const data = await res.json();
                    setCapsule(data.capsule);
                }
            } catch (err) {
                setError('Network error.' + err);
            }
            setLoading(false);
        }
        if (token) fetchCapsule();
    }, [id, token]);

    if (loading)
        return (
            <div>
                <AuthenticatedNavbar />
                <div className="pt-32 text-lg text-center text-cyan-300">Loading…</div>
            </div>
        );
    if (error)
        return (
            <div>
                <AuthenticatedNavbar />
                <div className="pt-32 text-lg text-center text-red-400">
                    {error}
                    <br />
                    <button onClick={() => navigate(-1)} className="mt-4 underline text-cyan-300">
                        Back
                    </button>
                </div>
            </div>
        );
    if (!capsule) return null;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this capsule?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/capsules/${capsule._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) navigate('/capsule-list');
            else {
                const data = await res.json();
                setError(data.message || 'Error deleting capsule.');
            }
        } catch {
            setError('Network error');
        }
    };

    const cardClass = `
    relative bg-transparent backdrop-blur-none border border-[rgb(113,245,255)]
    rounded-2xl text-white shadow-[0_0_28px_rgba(113,245,255,0.55)]
    transition-all duration-700
    before:absolute before:inset-0 before:rounded-2xl
    before:border before:border-[rgb(113,245,255)]
    before:opacity-50 before:blur-xl before:pointer-events-none
    px-8 pt-10 pb-14
  `;

    return (
        <div>
            <AuthenticatedNavbar />
            <div className="min-h-screen flex flex-col items-center pt-16 px-6 bg-chrononest justify-center">
                <div className="w-full max-w-2xl mx-auto">
                    <div className={cardClass}>
                        <div className="mb-6">
                            <div className="text-3xl md:text-4xl font-bold text-cyan-200 mb-3">
                                {capsule.title}
                            </div>
                            <div className="text-lg text-slate-200 mb-5">{capsule.description}</div>
                        </div>
                        {capsule.images?.length > 0 && capsule.images.some((img) => img) && (
                            <div className="mb-6">
                                <div className="font-semibold text-cyan-300 mb-2">Images</div>
                                <div className="flex gap-3 flex-wrap">
                                    {capsule.images.filter(Boolean).map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`capsule-image-${idx}`}
                                            className="max-h-28 rounded-lg border border-cyan-400 shadow-[0_0_10px_rgba(113,245,255,0.48)]"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {capsule.videos?.length > 0 && capsule.videos.some(Boolean) && (
                            <div className="mb-6">
                                <div className="font-semibold text-cyan-300 mb-2">Videos</div>
                                <div className="flex flex-col gap-2">
                                    {capsule.videos.filter(Boolean).map((url, idx) => (
                                        <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cyan-200 underline hover:text-white break-all"
                                        >
                                            {url}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="mb-6">
                            <div className="font-semibold text-cyan-300 mb-2">Recipients</div>
                            <ul className="space-y-4">
                                {capsule.recipients?.filter((rec) => rec.email || rec.whatsapp)
                                    .length > 0 ? (
                                    capsule.recipients
                                        .filter((rec) => rec.email || rec.whatsapp)
                                        .map((rec, idx) => (
                                            <li key={idx} className="text-white">
                                                {rec.email && (
                                                    <span className="bg-cyan-800 px-2 py-1 rounded-lg mr-2">
                                                        Email: {rec.email}
                                                    </span>
                                                )}
                                                {rec.whatsapp && (
                                                    <span className="bg-green-800 px-2 py-1 rounded-lg">
                                                        WhatsApp: {rec.whatsapp}
                                                    </span>
                                                )}
                                            </li>
                                        ))
                                ) : (
                                    <li className="text-slate-500 italic">
                                        No recipients provided.
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="mb-10">
                            <div className="font-semibold text-cyan-300 mb-2">Release</div>
                            <div className="text-white">
                                <span>
                                    <b>Type:</b>{' '}
                                    {capsule.triggerType === 'date' ? 'Specific Date' : 'Butterfly'}
                                </span>
                                {capsule.triggerType === 'date' && (
                                    <span className="ml-4">
                                        <b>Date:</b>{' '}
                                        {capsule.triggerDate
                                            ? new Date(capsule.triggerDate).toLocaleString()
                                            : 'N/A'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/capsule-list')}
                                className="bg-cyan-500 px-7 py-2 rounded-lg text-black font-semibold shadow-md hover:bg-cyan-600 transition"
                            >
                                ← Back to List
                            </button>
                            <button
                                className="bg-yellow-400 px-6 py-2 rounded-lg font-bold text-black shadow-md hover:bg-yellow-300 transition"
                                onClick={() => navigate(`/capsule/${capsule._id}/edit`)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-600 px-6 py-2 rounded-lg font-bold text-white shadow-md hover:bg-red-700 transition"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CapsuleDetailsPage;
