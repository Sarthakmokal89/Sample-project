import apiRequest from './api';

export interface UserSettings {
    id: string;
    name: string;
    email: string;
    imap_host?: string;
    imap_port?: number;
    imap_user?: string;
    imap_pass?: string; // Only for sending updates, not for receiving
}

interface SettingsResponse {
    settings: UserSettings;
}

interface UpdateSettingsResponse {
    ok: boolean;
    settings: UserSettings;
}

export const fetchUserSettings = async (): Promise<UserSettings> => {
    const response = await apiRequest<SettingsResponse>('/users/settings');
    return response.settings;
};

export const updateUserSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await apiRequest<UpdateSettingsResponse>('/users/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
    });
    return response.settings;
};
