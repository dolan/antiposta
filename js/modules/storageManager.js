export class StorageManager {
    constructor() {
        this.storageKeys = {
            collections: 'curlgui_collections',
            environments: 'curlgui_environments',
            history: 'curlgui_history',
            theme: 'curlgui_theme'
        };
    }

    async get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error reading from storage: ${error}`);
            return null;
        }
    }

    async set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to storage: ${error}`);
            return false;
        }
    }

    async remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from storage: ${error}`);
            return false;
        }
    }

    async clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error(`Error clearing storage: ${error}`);
            return false;
        }
    }

    // Collection specific methods
    async getCollections() {
        return this.get(this.storageKeys.collections) || [];
    }

    async saveCollections(collections) {
        return this.set(this.storageKeys.collections, collections);
    }

    // Environment specific methods
    async getEnvironments() {
        return this.get(this.storageKeys.environments) || [];
    }

    async saveEnvironments(environments) {
        return this.set(this.storageKeys.environments, environments);
    }

    // History specific methods
    async getHistory() {
        return this.get(this.storageKeys.history) || [];
    }

    async saveHistory(history) {
        return this.set(this.storageKeys.history, history);
    }

    // Theme specific methods
    async getTheme() {
        return this.get(this.storageKeys.theme) || 'light';
    }

    async saveTheme(theme) {
        return this.set(this.storageKeys.theme, theme);
    }
} 