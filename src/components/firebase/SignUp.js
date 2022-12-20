
import React from "react";
import {  useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import firebaseApp from "./../firebase/Firebase";
import firebase from "firebase/compat/app";
import { TextField, Button } from "@mui/material";
import validator from "validator";

const SignUp = (props) => {
  const auth = useSelector((state) => state.auth);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [signUpError, setSignUpError] = React.useState("");
  const [signUpSuccess, setSignUpSuccess] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

  const isUsernameAvailable = async (user) => {
    const usernameRef = firebase.firestore().collection("users").doc(user.toLowerCase());
    const usernameDoc = await usernameRef.get();

    if (usernameDoc.exists) {
      return false;
    }
    return true;
  };
  

  const validateForm = async () => {
    let isValid = true;
    let isUsername = false;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Invalid email address");
      return isValid = false;
    }

    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!validator.isAlpha(username))
    {
      setUsernameError("Username must contain only letters");
      return isValid = false;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return isValid = false;
    } else if (username.length > 15) {
      setUsernameError("Username must be less than 15 characters");
      return isValid = false;
    } else {
      setUsernameError("");
    }

    if (username) {
      isUsername = await isUsernameAvailable(username);
    }
    if (isUsername) {
      setUsernameError("");
    } else {
      setUsernameError("Username is not available");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        firebaseApp
          .firestore()
          .collection("users")
          .doc(username)
          .set({
            username: username,
            email: email,
            uid: userCredential.user.uid,
            photoURL: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
            // add more user data here if needed
          })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });

        userCredential.user.updateProfile({
          displayName: username,
          photoURL: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
        });
        // Signed in
        console.log(userCredential);
        console.log("Signed up");
        setSignUpSuccess(true);
      })
      .catch((error) => {
        setSignUpError("");
        if (error.code === "auth/email-already-in-use") {
          setEmailError("Email is already in use");
        } else {
          setSignUpError(error.message);
        }
        console.log("Sign up failed");
      });
    if (signUpSuccess) {
      return <Navigate to={`/`} />;
    }
  };
  if (auth.user) {
    return <Navigate to={`/`} />;
  }

  if (signUpSuccess) {
    return <Navigate to={`/signIn`} />;
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Username"
          onChange={(e) => { e.target.value && e.target.value.trim() ? setUsername(e.target.value.trim().toLowerCase()) : setUsername('') }}
          value={username}
          error={usernameError ? true : false}
          helpertext={usernameError}
        />
        <br />
        <br />
        <TextField
          name="email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          error={emailError ? true : false}
          helpertext={emailError}
        />
        <br />
        <br />
        <TextField
          name="password"
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          error={passwordError ? true : false}
          helpertext={passwordError}
        />
        <br />
        <br />
        <TextField
          name="confirmPassword"
          label="Repeat Password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          error={confirmPasswordError ? true : false}
          helpertext={confirmPasswordError}
        />
        <br />
        {signUpError ? <span style={{ color: "red" }}>{signUpError.replace("Firebase: ", "")}</span> : null}
        <br />
        <Button variant="contained" color="primary" type="submit">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
