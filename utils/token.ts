export const getAccessToken = () => {
    if (typeof window === "undefined") return null
    const userSessionData = JSON.parse(sessionStorage.getItem("user") || `{}`)
    return userSessionData.accessToken || null
}
export const getRefreshToken = () => {
    if (typeof window === "undefined") return null;
    const userSessionData = JSON.parse(sessionStorage.getItem("user") || `{}`);
    return userSessionData?.refreshToken || null;
};