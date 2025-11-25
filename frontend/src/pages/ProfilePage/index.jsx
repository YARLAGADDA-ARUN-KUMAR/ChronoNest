import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/utils';
import { useEffect, useState } from 'react';
import AuthenticatedNavbar from '../../components/AuthenticatedNavbar';

export default function ProfilePage() {
    const { user, token } = useAuth();
    const [fields, setFields] = useState({
        name: '',
        email: '',
        password: '',
        heartbeatIntervalDays: 30,
        preferredHeartbeatChannel: 'email',
        heartbeatContact: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFields({
                name: user.name || '',
                email: user.email || '',
                password: '',
                heartbeatIntervalDays: user.heartbeatIntervalDays || 30,
                preferredHeartbeatChannel: user.preferredHeartbeatChannel || 'email',
                heartbeatContact: user.heartbeatContact || '',
            });
        }
    }, [user]);

    const handleChange = (key, val) => setFields((f) => ({ ...f, [key]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                name: fields.name,
                heartbeatIntervalDays: fields.heartbeatIntervalDays,
                preferredHeartbeatChannel: fields.preferredHeartbeatChannel,
                heartbeatContact: fields.heartbeatContact,
            };

            if (fields.password) {
                payload.password = fields.password;
            }

            const res = await fetch(`${API_URL}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Profile updated successfully!');
            } else {
                setError(data.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <AuthenticatedNavbar />
            <div className="min-h-screen flex flex-col items-center justify-start pt-24 pb-10 px-6 bg-chrononest">
                <div className="w-full max-w-2xl mx-auto">
                    <Card className="bg-slate-900/70 border-cyan-500 text-white">
                        <CardHeader>
                            <h1 className="text-3xl font-bold text-center">Your Profile</h1>
                            <p className="text-center text-slate-400">
                                Manage your account and heartbeat settings.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={fields.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={fields.email}
                                        className="mt-2"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={fields.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        placeholder="Leave blank to keep current password"
                                        className="mt-2"
                                    />
                                </div>
                                <div className="pt-4">
                                    <h2 className="text-xl font-semibold">Heartbeat Settings</h2>
                                    <p className="text-slate-400 text-sm">
                                        This is how we know you're still with us.
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="heartbeatIntervalDays">
                                        Check-in Interval (days)
                                    </Label>
                                    <Input
                                        id="heartbeatIntervalDays"
                                        type="number"
                                        value={fields.heartbeatIntervalDays}
                                        onChange={(e) =>
                                            handleChange('heartbeatIntervalDays', e.target.value)
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="preferredHeartbeatChannel" className="mb-2">
                                        Reminder Channel
                                    </Label>
                                    <Select
                                        value={fields.preferredHeartbeatChannel}
                                        onValueChange={(val) =>
                                            handleChange('preferredHeartbeatChannel', val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="heartbeatContact">Reminder Contact</Label>
                                    <Input
                                        id="heartbeatContact"
                                        value={fields.heartbeatContact}
                                        onChange={(e) =>
                                            handleChange('heartbeatContact', e.target.value)
                                        }
                                        placeholder="Your email or WhatsApp number"
                                        className="mt-2"
                                    />
                                </div>
                                <ErrorDisplay message={error} />
                                {success && <p className="text-green-500">{success}</p>}
                                <Button type="submit" disabled={loading} className="bg-green-500">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
