import { useEffect, useState } from "react";
import "./App.css";

import { Toaster } from "react-hot-toast";
import Auth from "./components/auth";

function App() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showAuth, setShowAuth] = useState(true);
  const [loadingWebsites, setLoadingWebsites] = useState(false);
  const [errMsg, setErrMsg] = useState('');




const addWebsite = async()=>{}








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
          <div className="inner-app">
            <div className="app-header">
              <p className="heading">Add Website for monitoring</p>
              <div className="elem">
                <label>Enter website URL</label>
                <input
                  type="text"
                  placeholder="https://google.com"
                  className="web_input"
                />
              </div>
              <button>Add</button>
            </div>

            <div className="body">
              <p className="heading">Your Websites</p>

              {loadingWebsites ? (
                <p>LOADING...</p>
              ) : (
                <div className={"cards"}>
                  {[1, 1, 1, 1, 1, 1].map((item) => (
                    <div className={"card"}>
                      <div className="left">
                        <p
                          className={`link ${item.isActive ? "green" : "red"}`}
                        >
                          {item.isActive ? "ACTIVE" : "DOWN"}
                        </p>
                        <p className="url">{item.url}</p>
                      </div>

                      <div className="right">
                        <p className="link red">delete</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
