import api from "../common/api";

const profileServices = {
    getCurrentUserProfile: async () => {
        const response = await api.get(
            "/secure/api/v1/users/me"
        );
        return response.data?.data || response.data;
    },
    updateUserProfile: async (profileData) => {
        const response = await api.put(
            "/secure/api/v1/users/me",
            profileData
        );
        return response.data?.data || response.data;
    },
    changePassword: async (passwordData) => {
        const response = await api.put(
            "/secure/api/v1/users/change-password",
            passwordData
        );
        return response.data?.data || response.data;
    },
};

export default profileServices;