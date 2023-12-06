import React, { useState, useEffect } from "react";
import { fireAuth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import UploadExcel from "./UploadExcel";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component được render lại
    const unsubscribe = fireAuth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true); // Nếu đã đăng nhập, thiết lập loggedIn thành true
      } else {
        setLoggedIn(false); // Nếu chưa đăng nhập hoặc đã đăng xuất, thiết lập loggedIn thành false
      }
    });

    return () => unsubscribe(); // Hủy theo dõi trạng thái đăng nhập khi component bị hủy
  }, []);

  const register = () => {
    createUserWithEmailAndPassword(fireAuth, email, password)
      .then((userCredential) => {
        // Đăng ký thành công
        console.log("Registered with:", userCredential.user.email);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const login = () => {
    signInWithEmailAndPassword(fireAuth, email, password)
      .then((userCredential) => {
        // Đăng nhập thành công
        console.log("Logged in with:", userCredential.user.email);
        setLoggedIn(true);
      })
      .catch((error) => {
        console.error(error);
        alert("Sai thông tin đăng nhập");
      });
  };

  const logout = () => {
    signOut(fireAuth)
      .then(() => {
        setLoggedIn(false); // Đặt loggedIn thành false khi đăng xuất
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      {loggedIn === true && (
        <>
          <button onClick={logout}>Logout</button>
          <h1>Tải lên tệp Excel</h1>
          <UploadExcel />
        </>
      )}
    </div>
  );
};

export default Login;
