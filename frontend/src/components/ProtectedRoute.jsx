import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    /*
    Checks if the user is authenticated before accessing the
    route component. If not, redirect to the login page.
    */
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        // Use auth() when this method is loaded
        // If there are errors in the authorization process, the user is not authorized
        auth().catch(() => setIsAuthorized(false))
    }, []); // Empty array means this method will only run once

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            /*
            Send a request to backend with refresh token to get a new
            access token.
            */
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            }
            else {
                setIsAuthorized(false);
            }
        }
        catch (err) {
            setIsAuthorized(false);
            console.log(err);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            // If there is no token, no authentication given
            setIsAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp
        // Get the current time in seconds
        const now = Date.now() / 1000;
        
        if (tokenExpiration < now) {
            // If the token is expired, refresh it
            await refreshToken();
        } 
        else {
            // If the token is not expired, the user is authorized
            setIsAuthorized(true);
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;