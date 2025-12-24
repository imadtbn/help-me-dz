class LocalStorageManager {
    static saveBusiness(business) {
        const businesses = this.getBusinesses();
        businesses.push({
            ...business,
            id: `local-${Date.now()}`,
            source: 'user',
            verified: false,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('user_submitted_businesses', JSON.stringify(businesses));
    }
    
    static getBusinesses() {
        return JSON.parse(localStorage.getItem('user_submitted_businesses') || '[]');
    }
}