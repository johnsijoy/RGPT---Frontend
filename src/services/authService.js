import api from "./api";
import mockApi from "./mockApi";

const useMock = process.env.REACT_APP_USE_MOCK_API === "true";

export const authService = {
  login: async (username, password) => {
    if (useMock) {
      return mockApi.post("/login", { username, password }).then(() => {
        return {
          id: 1,
          name: "Admin User",
          username,
          access: "mock-access-token",
          refresh: "mock-refresh-token",
          avatar: "",
        };
      });
    }

    // 🔹 Call Django JWT login
    const response = await api.post("/token/", {
      username, // Django expects "username", not "email"
      password,
    });

    const { access, refresh } = response.data;

    // 🔹 Save tokens in localStorage
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    return { access, refresh };
  },

  logout: () => {
    // 🔹 Clear stored tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  },
};
