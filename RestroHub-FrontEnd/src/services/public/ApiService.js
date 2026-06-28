// ============================================
// API SERVICE
// Handles all API calls for the application
// ============================================

const API_BASE_URL = 'http://localhost:8181/restroly';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
        }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
   if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;

    try {
        const contentType = response.headers.get("content-type");
        const responseText = await response.text();

        if (
            contentType &&
            contentType.includes("application/json") &&
            responseText
        ) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
        }
    } catch (err) {
        console.error("Failed to parse error response:", err);
    }

    throw new Error(errorMessage);
}

try {
    const contentType = response.headers.get("content-type");
    const responseText = await response.text();

    if (!responseText) {
        return null;
    }

    if (
        contentType &&
        contentType.includes("application/json")
    ) {
        return JSON.parse(responseText);
    }

    return responseText;
} catch (err) {
    console.error("Failed to parse response:", err);
    throw new Error("Invalid server response");
}

const ApiService = {
    // ============================================
    // SITE DATA
    // ============================================
    
    /**
     * Fetch all site data (brand, navigation, content, etc.)
     * @returns {Promise<Object>} Site data object
     */
    fetchSiteData: async () => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // TODO: Replace with actual API call
        // return await apiRequest('/site-data');
        
        // Import default data for simulation
        const { defaultSiteData } = await import('@data/defaultData.js');
        return defaultSiteData;
    },

    /**
     * Fetch theme configuration
     * @returns {Promise<Object>} Theme configuration
     */
    fetchTheme: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // TODO: Replace with actual API call
        // return await apiRequest('/theme');
        
        return {
            primary: "#f59e0b",
            primaryHover: "#fbbf24",
            bgPrimary: "#000000",
            bgSecondary: "#0a0a0a"
        };
    },

    // ============================================
    // MENU
    // ============================================

    /**
     * Fetch menu items
     * @param {string} category - Optional category filter
     * @returns {Promise<Object>} Menu items
     */
    fetchMenu: async (category = null) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // TODO: Replace with actual API call
        // const endpoint = category ? `/menu?category=${category}` : '/menu';
        // return await apiRequest(endpoint);
        
        const { defaultSiteData } = await import('@data/defaultData.js');
        
        if (category) {
            return { [category]: defaultSiteData.menu.items[category] };
        }
        
        return defaultSiteData.menu;
    },

    // ============================================
    // RESERVATIONS
    // ============================================

    /**
     * Submit a reservation request
     * @param {Object} formData - Reservation form data
     * @returns {Promise<Object>} Confirmation response
     */
    submitReservation: async (formData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual API call
        // return await apiRequest('/reservations', {
        //     method: 'POST',
        //     body: JSON.stringify(formData)
        // });
        
        // Simulate successful response
        console.log('Reservation submitted:', formData);
        
        return { 
            success: true, 
            message: "Reservation confirmed!",
            confirmationNumber: `ADK-${Date.now().toString(36).toUpperCase()}`,
            details: formData
        };
    },

    /**
     * Check availability for a specific date/time
     * @param {string} date - Date string
     * @param {string} time - Time string
     * @param {number} guests - Number of guests
     * @returns {Promise<Object>} Availability response
     */
    checkAvailability: async (date, time, guests) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // TODO: Replace with actual API call
        // return await apiRequest(`/availability?date=${date}&time=${time}&guests=${guests}`);
        
        return {
            available: true,
            alternatives: ["6:30 PM", "7:30 PM", "8:30 PM"]
        };
    },

    // ============================================
    // GALLERY
    // ============================================

    /**
     * Fetch gallery images
     * @param {number} page - Page number for pagination
     * @param {number} limit - Number of items per page
     * @returns {Promise<Object>} Gallery images
     */
    fetchGallery: async (page = 1, limit = 10) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // TODO: Replace with actual API call
        // return await apiRequest(`/gallery?page=${page}&limit=${limit}`);
        
        const { defaultSiteData } = await import('@data/defaultData.js');
        return defaultSiteData.gallery;
    },

    // ============================================
    // CONTACT
    // ============================================

    /**
     * Submit contact form
     * @param {Object} formData - Contact form data
     * @returns {Promise<Object>} Submission response
     */
    submitContact: async (formData) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // TODO: Replace with actual API call
        // return await apiRequest('/contact', {
        //     method: 'POST',
        //     body: JSON.stringify(formData)
        // });
        
        console.log('Contact form submitted:', formData);
        
        return {
            success: true,
            message: "Thank you for your message. We'll get back to you soon!"
        };
    },

    // ============================================
    // NEWSLETTER
    // ============================================

    /**
     * Subscribe to newsletter
     * @param {string} email - Email address
     * @returns {Promise<Object>} Subscription response
     */
    subscribeNewsletter: async (email) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // TODO: Replace with actual API call
        // return await apiRequest('/newsletter', {
        //     method: 'POST',
        //     body: JSON.stringify({ email })
        // });
        
        return {
            success: true,
            message: "Successfully subscribed to our newsletter!"
        };
    }
};

export default ApiService;
