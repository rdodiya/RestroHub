import api from "../common/api";

const profileServices = {
    getCurrentUserProfile: async () => {
        const response = await api.get(
            "/api/v1/users/me"
        );
        return response.data;
    },
    updateUserProfile: async (profileData) => {
        const response = await api.put(
            "/api/v1/users/me",
            profileData
        );
        return response.data;
    },
};

export default profileServices;