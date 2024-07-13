import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { verifyEmail } from "../services/auth";
import { Box, Container, Text } from "@mantine/core";

const VerifyEmail = () => {
  const { username, token } = useParams();
  const [validToken, setValidToken] = useState(false);
  const verifyEmailToken = (username, emailToken) => {
    const usernameAndToken = {
      username: username,
      emailToken: emailToken,
    };
    verifyEmail(usernameAndToken)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === "okay") {
          setValidToken(true);
        }
      })
      .catch((e) => {});
  };
  useEffect(() => {
    verifyEmailToken(username, token);
  }, []);
  return (
    <Container>
      {validToken ? (
        <Box>
          <Text c={"blue"}>
            Email has been verified!, you can now{" "}
            <Text component={NavLink} to="/login">
              Log in
            </Text>
          </Text>
        </Box>
      ) : (
        <Box>
          <Text c={"red"}>
            Could not verify email or token is no longer valid
          </Text>
        </Box>
      )}
    </Container>
  );
};

export default VerifyEmail;
