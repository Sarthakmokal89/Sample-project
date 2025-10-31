import React, { useState, useEffect } from 'react';
// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircleIcon } from '../components/Icons';
import { fetchUserSettings, updateUserSettings, UserSettings } from '../utils/userService';

const SettingsCard: React.FC<{ title: string, description: string, children: React.ReactNode, footer?: React.ReactNode }> = ({ title, description, children, footer }) => (
    <div className="bg-violet-900 border border-violet-800/80 rounded-xl shadow-lg">
        <div className="p-6 border-b border-violet-800/80">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <div className="p-6">
            {children}
        </div>
        {footer && (
            <div className="bg-violet-900/50 px-6 py-4 border-t border-violet-800/80 rounded-b-xl text-right">
                {footer}
            </div>
        )}
    </div>
);

const InputField: React.FC<{ label: string; name: string; type?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean; }> = 
({ label, name, type = 'text', value, onChange, placeholder, required = false }) => (
    <div className="grid grid-cols-3 gap-4 items-center">
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 col-span-1">{label}</label>
        <div className="col-span-2">
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="block w-full px-4 py-2 bg-violet-800/50 border border-violet-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
        </div>
    </div>
);


const Settings: React.FC = () => {
    const [settings, setSettings] = useState<Partial<UserSettings>>({});
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const userSettings = await fetchUserSettings();
                setSettings({
                    name: userSettings.name || '',
                    email: userSettings.email || '',
                    imap_host: userSettings.imap_host || '',
                    imap_port: userSettings.imap_port || 993,
                    imap_user: userSettings.imap_user || '',
                });
            } catch (err: any) {
                setError(err.message || 'Failed to load settings.');
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: name === 'imap_port' ? (parseInt(value) || '') : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const settingsToUpdate: Partial<UserSettings> = { ...settings };
            if (password) {
                settingsToUpdate.imap_pass = password;
            }
            await updateUserSettings(settingsToUpdate);
            setSuccess('Settings updated successfully!');
            setPassword(''); 
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update settings.');
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return (
             <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <h1 className="text-2xl font-bold text-white">Settings</h1>

            <SettingsCard
                title="Profile"
                description="This information will be displayed publicly so be careful what you share."
            >
                <div className="space-y-4">
                     <InputField label="Name" name="name" value={settings.name || ''} onChange={handleInputChange} placeholder="Your name" required/>
                     <InputField label="Email" name="email" type="email" value={settings.email || ''} onChange={handleInputChange} placeholder="your@email.com" required/>
                </div>
            </SettingsCard>
            
             <SettingsCard
                title="IMAP Connection"
                description="Enter your email account credentials to enable automatic feedback fetching."
            >
                <div className="space-y-4">
                     <InputField label="IMAP Host" name="imap_host" value={settings.imap_host || ''} onChange={handleInputChange} placeholder="imap.example.com"/>
                     <InputField label="IMAP Port" name="imap_port" type="number" value={settings.imap_port || ''} onChange={handleInputChange} placeholder="993"/>
                     <InputField label="IMAP User" name="imap_user" value={settings.imap_user || ''} onChange={handleInputChange} placeholder="your@email.com"/>
                     <InputField label="IMAP Password" name="imap_pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password to update"/>
                </div>
            </SettingsCard>

            <div className="flex justify-end items-center gap-4">
                 {error && <p className="text-sm text-danger-400">{error}</p>}
                 {success && <div className="flex items-center gap-2 text-sm text-success-400"><CheckCircleIcon className="w-5 h-5" /> {success}</div>}
                <button type="submit" disabled={isSaving} className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-950 focus:ring-violet-500 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
};

export default Settings;
