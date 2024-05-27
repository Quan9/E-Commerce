/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS } from "../slices/UserSlice";
import {
  Alert,
  Button,
  Card,
  Center,
  Container,
  PasswordInput,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
const Login = ({ socket }) => {
  const [data, setData] = useState({});
  const { user, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(5);
  const [visible, { toggle }] = useDisclosure(false);
  useEffect(() => {
    const checkTimer = () => {
      if (count < 0) navigate("/");
      const timer = setInterval(() => {
        setCount(count - 1);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    };
    user !== null && checkTimer();
  }, [count, user]);
  useEffect(() => {
    const checkUser = () => {
      if (user !== null) {
        alert("Already logged-in");
        navigate("/");
      }
    };
    checkUser();
  }, []);
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    const LoginCheck = () => {
      login({ username: data.username, password: data.password })
        .then((res) => {
          dispatch(LOGIN_SUCCESS(res.data));
          socket.emit("loggedUser", res.data.username);
        })
        .catch((err) => {
          dispatch(LOGIN_FAILURE(err.response.data));
        });
    };
    loading && LoginCheck();
  }, [loading]);
  const handleLogin = () => {
    if (data) {
      dispatch(LOGIN_START());
    } else {
      dispatch(LOGIN_FAILURE());
    }
  };

  return (
    <Container px={0}>
      <Center h={"90vh"}>
        {user !== null ? (
          <Alert variant="light" color="blue" title="Logged-in successfully">
            <Text>redirecting to home page in {count} seconds</Text>
          </Alert>
        ) : (
          <Card withBorder bg={"rgba(195, 195, 195, 0.3)"}>
            <Card.Section>
              <TextInput
                label="Username"
                onChange={handleChange}
                name="username"
              />
              <PasswordInput
                label="Password"
                visible={visible}
                onVisibilityChange={toggle}
                onChange={handleChange}
                name="password"
              />
            </Card.Section>

            <Button
              mt="md"
              onClick={handleLogin}
              size="compact-md"
              loading={loading}
            >
              Login
            </Button>
            <Text>{`Don't have an account?`}</Text>
            <UnstyledButton
              onClick={() => navigate("/register")}
              style={{ color: "blue" }}
              ta={'center'}
            >
              Register now
            </UnstyledButton>
            {loading && <Card.Section>Signing in...</Card.Section>}
            {error && (
              <Card.Section className="text-danger">{error}</Card.Section>
            )}
          </Card>
        )}
      </Center>
    </Container>
  );
};

export default Login;
