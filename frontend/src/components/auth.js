import React, { useEffect, useState } from "react";
import "./auth.css";
import toast from "react-hot-toast";

const Auth = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [inputVal, setInputVal] = useState({
    name: "",
    email: "",
    pass: "",
  });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSignUp = async () => {
    if (!inputVal?.name.trim() || !inputVal?.email.trim() || !inputVal.pass) {
      setErrorMsg("All fields are required");
      return;
    }
    if (!validateEmail(inputVal.email)) {
      setErrorMsg("Enter valid email");
      return;
    }
    if (inputVal.pass.length < 6) {
      setErrorMsg("Password must be at least of 6 characters");
      return;
    }
    setErrorMsg("");

    const res = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: inputVal?.name.trim(),
        email: inputVal.email,
        password: inputVal.pass,
      }),
    }).catch((err) => setErrorMsg("Error in creating user" - err.message));
    if (!res) {
      setErrorMsg("Error in creating user");
    }
    const result = await res.json();
    if (!result) {
      setErrorMsg(result.message);
    }
    toast.success(result.data.name + result.message);

    const tokens = result.data?.tokens;
    localStorage.setItem("Token", JSON.stringify(tokens));
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };  

  const handleLogIn = async () => {
    if (!inputVal?.email.trim() || !inputVal.pass) {
      setErrorMsg("All fields are required");
      return;
    }
    if (!validateEmail(inputVal.email)) {
      setErrorMsg("Enter valid email");
      return;
    }
    if (inputVal.pass.length < 6) {
      setErrorMsg("Password must be at least of 6 characters");
      return;
    }
    setErrorMsg("");

    const res = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: inputVal.email,
        password: inputVal.pass,
      }),
    }).catch((err) => setErrorMsg("Error in logging of user" - err.message));
    if (!res) {
      setErrorMsg("Error in Logging of user");
    }
    const result = await res.json();
    if (!result) {
      setErrorMsg(result.message);
    }

    toast.success(result.data.name +" " + result.message);
    const tokens = result.data?.tokens;
    localStorage.setItem("Token", JSON.stringify(tokens));
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  useEffect(() => {
    setInputVal({});
  }, [isSignUpActive]);

  const signUpDiv = (
    <div className="box sign-up">
      <div className="heading">Sign up</div>
      <div className="elem">
        <label>Name</label>
        <input
          type="text"
          className="input"
          placeholder="Enter name"
          onChange={(e) =>
            setInputVal((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>
      <div className="elem">
        <label>E-mail</label>
        <input
          type="text"
          className="input"
          placeholder="Enter e-mail"
          onChange={(e) =>
            setInputVal((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>
      <div className="elem">
        <label>Password</label>
        <input
          type="password"
          className="input"
          placeholder="Enter Password"
          onChange={(e) =>
            setInputVal((prev) => ({ ...prev, pass: e.target.value }))
          }
        />
      </div>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <button onClick={handleSignUp}>Sign Up</button>
      <div className="bottomText">
        Already a User ?{" "}
        <span onClick={() => setIsSignUpActive(false)}>Login</span> here
      </div>
    </div>
  );

  const logInDiv = (
    <div className="box log-in">
      <div className="heading">Login</div>
      <div className="elem">
        <label>E-mail</label>
        <input
          type="text"
          className="input"
          placeholder="Enter e-mail"
          onChange={(e) =>
            setInputVal((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>
      <div className="elem">
        <label>Password</label>
        <input
          type="password"
          className="input"
          placeholder="Enter Password"
          onChange={(e) =>
            setInputVal((prev) => ({ ...prev, pass: e.target.value }))
          }
        />
      </div>
      <button onClick={handleLogIn}>Login</button>
      <div className="bottomText">
        New here ? <span onClick={() => setIsSignUpActive(true)}>Sign Up</span>{" "}
        here
      </div>
    </div>
  );
  return (
    <div className="container">{isSignUpActive ? signUpDiv : logInDiv}</div>
  );
};

export default Auth;
