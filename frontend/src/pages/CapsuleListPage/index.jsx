import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticatedNavbar from '../../components/AuthenticatedNavbar';

function CapsuleListPage() {
    const [capsules, setCapsules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        async function fetchCapsules() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${API_URL}/api/capsules/mine`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) {
                    const data = await res.json();
                    setError(data.message || 'Failed to fetch capsules.');
                } else {
                    const data = await res.json();
                    setCapsules(data.capsules || []);
                }
            } catch (err) {
                setError('Network error. ' + err.message);
            }
            setLoading(false);
        }
        if (token) fetchCapsules();
    }, [token]);

    return (
        <div>
            <AuthenticatedNavbar />
            <div className="min-h-screen flex flex-col items-center pt-24 px-6 bg-chrononest">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">My Capsules</h1>
                        <button
                            className="bg-green-500 px-5 py-2 text-black rounded-lg font-semibold hover:bg-green-600"
                            onClick={() => navigate('/create-capsule')}
                        >
                            + Create New Capsule
                        </button>
                    </div>
                    {loading ? (
                        <div className="text-cyan-300 text-center py-6 text-lg">
                            Loading capsules…
                        </div>
                    ) : error ? (
                        <div className="text-red-400 text-center py-6 text-lg">{error}</div>
                    ) : capsules.length === 0 ? (
                        <div className="text-slate-300 text-center py-8">
                            No capsules found.
                            <br />
                            <button
                                className="mt-4 bg-green-500 px-4 py-2 rounded-lg text-black font-semibold hover:bg-green-600"
                                onClick={() => navigate('/create-capsule')}
                            >
                                Create your first capsule
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {capsules.map((capsule) => (
                                <div
                                    key={capsule._id}
                                    className="bg-slate-800 border border-cyan-300 rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="flex-1">
                                        <div className="text-xl font-bold text-white mb-1">
                                            {capsule.title}
                                        </div>
                                        <div className="text-slate-300 mb-2">
                                            {capsule.description?.slice(0, 60)}…
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            <span className="mr-3">
                                                Recipients: {capsule.recipients?.length}
                                            </span>
                                            <span>
                                                Release:{' '}
                                                {capsule.triggerType === 'date'
                                                    ? new Date(
                                                          capsule.triggerDate,
                                                      ).toLocaleDateString()
                                                    : 'Butterfly'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-4 md:pt-0 md:pl-6 flex gap-2">
                                        <button
                                            className="bg-cyan-500 px-4 py-2 rounded-lg text-black font-bold hover:bg-cyan-600"
                                            onClick={() => navigate(`/capsule/${capsule._id}`)}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CapsuleListPage;
