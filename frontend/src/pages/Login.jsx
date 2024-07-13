/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { googleLogin, login } from "../services/auth";
import { LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS } from "../slices/UserSlice";
import {
  Alert,
  Button,
  Center,
  Container,
  Loader,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { IconBrandGoogle } from "@tabler/icons-react";
const Login = ({ socket, user1 }) => {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      password: (value) =>
        value.length < 6 ? "Password must have at least 6 characters" : null,
    },
  });
  const { user, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(5);
  const [userGoogle, setUserGoogle] = useState();
  const [profile, setProfile] = useState();
  const [google, setGoogle] = useState(false);
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
      if (!!user1) {
        alert("Already logged-in");
        navigate("/");
      }
    };
    checkUser();
  }, []);
  useEffect(() => {
    const LoginCheck = () => {
      if (google) {
        googleLogin({ email: profile.email })
          .then((res) => {
            dispatch(LOGIN_SUCCESS(res.data));
            socket.emit("loggedUser", res.data.username);
          })
          .catch((err) => {
            dispatch(LOGIN_FAILURE(err.response.data));
          });
      } else {
        login(form.getValues())
          .then((res) => {
            dispatch(LOGIN_SUCCESS(res.data));
            socket.emit("loggedUser", res.data.username);
          })
          .catch((err) => {
            dispatch(LOGIN_FAILURE(err.response.data));
          });
      }
    };
    loading && LoginCheck();
  }, [loading]);
  const loginGoogle = useGoogleLogin({
    onSuccess: (e) => setUserGoogle(e),
    onError: (e) => LOGIN_FAILURE(e),
  });
  useEffect(() => {
    google && dispatch(LOGIN_START());
  }, [google]);
  useEffect(() => {
    if (userGoogle) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userGoogle.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${userGoogle.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          setGoogle(true);
        })
        .catch((err) => dispatch(LOGIN_FAILURE(err.message)));
    }
  }, [userGoogle]);
  return (
    <Container className="auth">
      {user !== null ? (
        <Alert
          variant="light"
          color="blue"
          title="Logged-in successfully"
          style={{ justifyContent: "center" }}
        >
          <Text span ta={"center"}>
            redirecting to home page in {count} seconds <Loader type="dots" />
          </Text>
        </Alert>
      ) : (
        <>
          <form>
            <Stack m={"auto"} gap={"sm"} justify="center" align="center">
              <TextInput
                withAsterisk
                label="Username"
                key={form.key("username")}
                {...form.getInputProps("username")}
                w={200}
              />
              <PasswordInput
                label="Password"
                withAsterisk
                key={form.key("password")}
                {...form.getInputProps("password")}
                w={200}
                placeholder="password"
              />
              <Center>
                <Button
                  onClick={() => dispatch(LOGIN_START())}
                  loading={loading}
                  loaderProps={{ type: "dots" }}
                >
                  Login
                </Button>
              </Center>
              {error && (
                <Text c={"red"} ta={"center"}>
                  {error}
                </Text>
              )}
            </Stack>
          </form>
          <Stack mt={"sm"} gap={"sm"}>
            <Button
              leftSection={<IconBrandGoogle />}
              onClick={loginGoogle}
              variant="default"
            >
              Login with Google
            </Button>
            <Text>{`Don't have an account?`}</Text>
            <UnstyledButton
              component={NavLink}
              to={"/register"}
              style={{ color: "blue" }}
              ta={"center"}
            >
              Register now
            </UnstyledButton>
          </Stack>
        </>
      )}
    </Container>
  );
};

export default Login;
