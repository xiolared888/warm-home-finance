const SESSION_KEY = "fox_admin_auth";

const VALID_CREDENTIALS = [
  { identifier: "admin@foxfinance.com", password: "FoxFinance@123" },
  { identifier: "foxadmin", password: "FoxFinance@123" },
];

export const adminAuth = {
  login(identifier: string, password: string): boolean {
    const match = VALID_CREDENTIALS.some(
      (c) => c.identifier === identifier && c.password === password
    );
    if (match) {
      sessionStorage.setItem(SESSION_KEY, "true");
    }
    return match;
  },

  logout() {
    sessionStorage.removeItem(SESSION_KEY);
  },

  isAuthenticated(): boolean {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  },
};
