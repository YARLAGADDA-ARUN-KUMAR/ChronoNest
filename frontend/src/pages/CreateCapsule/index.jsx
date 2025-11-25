import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/config';
import { useNavigate } from 'react-router-dom';
import AuthenticatedNavbar from '../../components/AuthenticatedNavbar';
import CapsuleUpsertForm from '../../components/create-capsule/CapsuleUpsertForm';

export default function CreateCapsule() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSave = async (formData) => {
        const res = await fetch(`${API_BASE_URL}/api/capsules`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (res.ok) {
            navigate('/capsule-list');
        } else {
            const data = await res.json();
            throw new Error(data.message || 'Error creating capsule.');
        }
    };

    return (
        <div>
            <AuthenticatedNavbar />
            <CapsuleUpsertForm onSave={handleSave} mode="create" />
        </div>
    );
}
