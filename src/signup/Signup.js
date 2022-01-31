import React, { useState } from "react";
import {useHistory}  from "react-router-dom";
import LoaderButton from "./LoaderButton"
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
} from "react-bootstrap";
// import LoaderButton from "./LoaderButton";
import { useAppContext } from "./libs/contextLib";
import { useFormFields } from "./libs/hooksLib";
import { onError } from "./libs/errorLib";
import { Auth } from "aws-amplify";
import Checkbox from "@material-ui/core/Checkbox";

// TODO user did not confirm and sign up agains https://serverless-stack.com/chapters/signup-with-aws-cognito.html

export default  function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    //username: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
    referralCode: "",
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, toggleAgreeToTerms] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword &&
      agreeToTerms
    );
  }
  const handleCheckBoxChange = (event) => {
    toggleAgreeToTerms(event.target.checked);
  };

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      //console.log(newUser)
      setIsLoading(false);
      setNewUser(newUser);
      //await API.post("notes", "/user/new"); not needed, cognito user pool trigger this post confirmation.
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      userHasAuthenticated(true);
      history.push("/settings");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </form>
    );
  }

  const twoCalls = (e) => {
    handleFieldChange(e);
    passwordHelp(e);
  };

  const passwordHelp = (e) => {
    let password = e.target.value;
    console.log("password is " + password);
    let errorMessage = "";
    let capsCount, smallCount, numberCount, symbolCount;
    if (password.length < 8) {
      errorMessage = "password must be min 8 char";
    } else {
      capsCount = (password.match(/[A-Z]/g) || []).length;
      smallCount = (password.match(/[a-z]/g) || []).length;
      numberCount = (password.match(/[0-9]/g) || []).length;
      symbolCount = (password.match(/\W/g) || []).length;
      if (capsCount < 1) {
        errorMessage = "must contain uppercase letters.";
      } else if (smallCount < 1) {
        errorMessage = "must contain lowercase letters";
      } else if (numberCount < 1) {
        errorMessage = "must contain number";
      } else if (symbolCount < 1) {
        errorMessage = "must contain special character";
      }
    }
    console.log(errorMessage);
    setPasswordErrorMsg(errorMessage);
  };

  function renderForm() {
    return (
      <div>
      <form onSubmit={handleSubmit}>
        {/*<FormGroup controlId="email" bsSize="large">
          <ControlLabel>Username </ControlLabel>
          <FormControl
            autoFocus
            type="username"
            value={fields.username}
            onChange={handleUserNameChange}
          />
          </FormGroup> */}

        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={twoCalls}
          />
        </FormGroup>
        {passwordErrorMsg !== "" ? (
          <div className="passwordMissMatch">{passwordErrorMsg}</div>
        ) : (
          ""
        )}

        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        {fields.confirmPassword !== "" &&
        fields.confirmPassword !== fields.password ? (
          <div className="passwordMissMatch">
            Those passwords didn't match. Please try again.
          </div>
        ) : (
          ""
        )}
        <div className="terms">
          <Checkbox
            checked={agreeToTerms}
            onChange={handleCheckBoxChange}
            color="primary"
          />
          <span>
            I accept and agree to the{" "}
            <a href="/termsAndConditions" target="blank">
              Terms of Use
            </a>
          </span>
        </div>

        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
        <div className="socialLoginContainer">

        
</div>
      </form>
      <div class="socialLoginContainer">
      <button onClick={() => Auth.federatedSignIn({provider: 'Facebook'})}><img src="../facebook-login.png" alt="Facebook Sign In button"
     className="socialLogin"
     />
</button>

        <button onClick={() => Auth.federatedSignIn({provider: 'Google'})}><img src="../googlebtn.png" alt="Google Sign In button"
     className="socialLogin"/>
</button>
      </div>
      </div>
    );
  }

  return (
    <div>
      <div className="Signup">
        {newUser === null ? renderForm() : renderConfirmationForm()}
      </div>
      <div className="Signup redirectTologin">
        Already account?{" "}
        <span id="redirect-to-sign-in">
          <a href="/login">Sign in </a>
        </span>
      </div>
    </div>
  );
}
