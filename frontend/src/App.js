import { useEffect, useState } from "react";
import "./App.css";

import { Toaster } from "react-hot-toast";
import Auth from "./components/auth";

function App() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showAuth, setShowAuth] = useState(true);

  const init = async () => {
    const rawToken = localStorage.getItem("Token");
    if (!rawToken) {
      setShowAuth(true);
      setPageLoaded(true);
      return;
    }
    const tokens = JSON.parse(rawToken);
    const accessToken = tokens.accessToken;
    const aExpiry = new Date(accessToken.expireAt);

    if (new Date() < aExpiry) {
      const res = await fetch("http://localhost:5000/user/new-token", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken.token,
        }),
      }).catch((err) => void err);
      if (!res) {
        setShowAuth(true);
        setPageLoaded(true);
        localStorage.removeItem("Token");
        return;
      }
      const data = await res.json();
      if (!data || !data.status) {
        setShowAuth(true);
        setPageLoaded(true);
        localStorage.removeItem("Token");
        return;
      }
      const newTokens = data?.data.tokens;
      localStorage.setItem("Token", JSON.stringify(newTokens));
      setPageLoaded(true);
      setShowAuth(false);
    } else {
      setPageLoaded(true);
      setShowAuth(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">
      <Toaster />

      {pageLoaded ? (
        showAuth ? (
          <Auth />
        ) : (
          <div className="main_div">
            <div className="web_add">
              <input type="text" placeholder="https://google.com" className="web_input"/>
              <button>Add</button>
            </div>
            <div className="show_web">
              {/* {[1, 1, 1, 1, 1].map((item) => { */}
                <div className="web_card">
                  <p className="status">Active</p>
                  <div className="web_url">https://google.com</div>
                  <p className="delete">delete</p>
                </div>;
              {/* })} */}
            </div>
          </div>
        )
      ) : (
        <div className="loading">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default App;
