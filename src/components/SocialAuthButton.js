import React from "react";
import styled from "styled-components";
import { Button } from "../components";
import { metrics, icons } from "../themes";

const AuthButton = styled(Button)`
  span {
    width: ${metrics.baseUnit * 13.5}px;
  }
`;

const AuthIcon = styled.div`
  width: ${metrics.baseUnit * 2.5}px;
  height: ${metrics.baseUnit * 3}px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  div {
    width: ${metrics.baseUnit * 2}px;
    height: ${metrics.baseUnit * 2}px;
    background-color: ${props => (props.background ? "white" : null)};
    border-radius: ${metrics.globalBorderRadius / 2}px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: ${props =>
        props.background ? metrics.baseUnit * 1.5 : metrics.baseUnit * 2}px;
      height: ${props =>
        props.background ? metrics.baseUnit * 1.5 : metrics.baseUnit * 2}px;
      src: ${props => props.src};
    }
  }
`;

const SocialConstructor = props => {
  return (
    <AuthButton {...props} onClick={props.onClick}>
      <AuthIcon {...props}>
        <div {...props}>
          <img src={props.logo} />
        </div>
      </AuthIcon>
      <span>SIGN IN WITH {props.company}</span>
    </AuthButton>
  );
};

export const FacebookAuth = props => {
  return (
    <SocialConstructor
      {...props}
      logo={icons.facebook}
      company="FACEBOOK"
      onClick={props.onClick}
    />
  );
};

export const GoogleAuth = props => {
  return (
    <SocialConstructor
      background
      {...props}
      logo={icons.google}
      company="GOOGLE"
      onClick={props.onClick}
    />
  );
};