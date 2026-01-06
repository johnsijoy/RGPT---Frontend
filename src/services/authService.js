import api from "./api";
import mockApi from "./mockApi";

const useMock = process.env.REACT_APP_USE_MOCK_API === "true";

export const authService = {
  login: async (username, password) => {
    if (useMock) {
      return mockApi.post("/login", { username, password }).then(() => ({
        id: 1,
        name: "Admin User",
        username,
        access: "mock-access-token",
        refresh: "mock-refresh-token",
        avatar: "",
      }));
    }

    const response = await api.post("/token/", { username, password });
    const { access, refresh } = response.data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    return { access, refresh };
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  },
};
