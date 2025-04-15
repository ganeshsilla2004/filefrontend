
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_kLKTFcTYZ",
  client_id: "2lokd7f8a5tetaeamk775g32ha",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  // Changed to only include scopes typically enabled by default in Cognito
  scope: "openid email",
  
  loadUserInfo: true,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);