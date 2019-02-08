import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { ToastConsumer } from "../contexts/toastContext";
import ReCAPTCHA from "react-google-recaptcha";
import firebase from "../firebase.js";
import "firebase/functions";
import "firebase/firestore";

const db = firebase.firestore();

const SignIn = props => {
  const [validCaptcha, setCaptcha] = useState(false);
  const [step, setStep] = useState("dataEntry");
  const [email, setEmail] = useState(email);

  const onClickSubmit = () => {
    window.localStorage.setItem("userEmail", email);
    const actionCodeSettings = {
      url: "http://" + process.env.REACT_APP_BASE_URL + "/#/confirmed",
      handleCodeInApp: true
    };
    firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        setStep("pleaseCheckEmail");
      })
      .catch(error => {
        props.toastContext.sendMessage(error.message);
      });
  };

  const authWithFacebook = () => {
    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(facebookProvider)
      .then((result, error) => {
        if (error) {
          console.log(error);
        } else {
          if (result.additionalUserInfo.isNewUser) {
            db.collection("users")
              .doc(result.user.uid)
              .set({
                email: result.additionalUserInfo.profile.email
              });
          }
        }
      })
      .catch(err => {
        if (err.code === "auth/account-exists-with-different-credential") {
          props.toastContext.sendMessage(
            "It looks like the email address associated with your Facebook account has already been used to sign in with another method. Please sign in using the original method you signed up with."
          );
        } else {
          props.toastContext.sendMessage(err.message);
        }
      });
  };

  const dataEntry = () => {
    return (
      <>
        SIGN UP/SIGN IN
        <Button onClick={authWithFacebook}>Facebook</Button>
        <form>
          <Input
            onChange={e => setEmail(e.target.value)}
            name="email"
            placeholder="Email address"
            autoComplete="email"
          />
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={captcha}
          />
        </form>
        <Button onClick={onClickSubmit}>Sign In/Sign Up</Button>
      </>
    );
  };

  const verification = () => {
    return <>Check your email!</>;
  };

  const captcha = value => {
    if (!value) {
      setCaptcha(false);
    } else {
      const checkRecaptcha = firebase
        .functions()
        .httpsCallable("checkRecaptcha");

      checkRecaptcha({ response: value })
        .then(res => {
          console.log(res);
        })
        .catch(err => console.log(err));
    }
  };

  const currentStep = step === "dataEntry" ? dataEntry() : verification();
  return currentStep;
};

export default ToastConsumer(SignIn);