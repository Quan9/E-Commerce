import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  PasswordInput,
  FileInput,
  Text,
  Center,
  Image,
  Group,
  Flex,
  Container,
  Alert,
  Card,
  CardSection,
  UnstyledButton,
  GridCol,
  Stack,
  Loader,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { register, registerGoogle } from "../services/auth";
import {
  IconArrowLeft,
  IconBrandGoogle,
  IconFileImport,
  IconUser,
} from "@tabler/icons-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
const Register = () => {
  const [img, setImg] = useState();
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [load, setLoad] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [userGoogle, setUserGoogle] = useState();
  const [profile, setProfile] = useState();
  const [google, setGoogle] = useState(false);
  const navigate = useNavigate();
  const redirectPage = (path) => {
    navigate(path);
  };
  const form = useForm({
    initialValues: { username: "", email: "", password: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      username: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must have at least 6 characters" : null,
    },
  });

  const loginGoogle = useGoogleLogin({
    onSuccess: (e) => setUserGoogle(e),
    onError: (e) => LOGIN_FAILURE(e),
  });

  const handleSubmit = async (data) => {
    setLoad(true);
    let image = "";
    if (img) {
      const form = new FormData();
      form.append("file", img);
      form.append("upload_preset", "mobileShop");
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
        form
      );
      image = uploadRes.data.url;
    }
    const newUser = { ...data, image };
    register(newUser)
      .then((res) => {
        setMessage(res.data);
        setSuccess(true);
      })
      .catch((err) => {
        setMessage(err.response.data);
        setLoad(false);
      });
  };

  useEffect(() => {
    const submit = async () => {
      setLoad(true);
      const username = profile.email.split("@")[0];
      const newUser = {
        img: profile.picture,
        username: username,
        email: profile.email,
        password: "123456",
      };
      registerGoogle(newUser)
        .then((res) => {
          setMessage(res.data);
          setSuccess(true);
        })
        .catch((e) => {
          setMessage(e.response.data);
          setLoad(false);
        });
      console.log(profile);
    };
    google && submit();
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
        .catch((e) => {
          setSuccess(false);
          setMessage(e.message);
        });
    }
  }, [userGoogle]);
  return (
    <Container className="auth">
      {user ? (
        <Stack align="center">
          <Text c={"green"}>Already logged-in</Text>
          <Group>
            <Button component={NavLink} to={"/"} variant="subtle">
              Back to Home Page
            </Button>
          </Group>
        </Stack>
      ) : (
        <>
          {success ? (
            <Flex direction={"column"} align={"center"}>
              <Text c={"green"}>{message}</Text>
              <Group justify="space-between">
                <Button
                  leftSection={<IconArrowLeft />}
                  variant="subtle"
                  onClick={() => redirectPage("/")}
                >
                  HomePage
                </Button>
                <Button
                  leftSection={<IconUser />}
                  variant="subtle"
                  onClick={() => redirectPage("/login")}
                >
                  Login
                </Button>
              </Group>
            </Flex>
          ) : (
            <>
              <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Stack m={"auto"} gap={"sm"} justify="center" align="center">
                  <Group>
                    <TextInput
                      label="Username"
                      placeholder="Name"
                      {...form.getInputProps("username")}
                      withAsterisk
                      w={200}
                    />
                    <TextInput
                      label="Email"
                      placeholder="Email"
                      {...form.getInputProps("email")}
                      withAsterisk
                      w={200}
                    />
                  </Group>
                  <Group>
                    <PasswordInput
                      label="Password"
                      placeholder="password"
                      {...form.getInputProps("password")}
                      withAsterisk
                      w={200}
                    />
                    <FileInput
                      label="Profile Picture"
                      accept="image/png,image/jpeg"
                      placeholder="Import file"
                      onChange={(e) => setImg(e)}
                      leftSection={
                        img && <Image src={URL.createObjectURL(img)} />
                      }
                      rightSection={
                        <IconFileImport
                          style={{ width: "18rem", height: "18rem" }}
                          stroke={1.5}
                        />
                      }
                      rightSectionPointerEvents="none"
                      w={200}
                    />
                  </Group>
                  <Center>
                    <Button type="submit" mt="md" disabled={load}>
                      {load ? <Loader type="dots" /> : "Register"}
                    </Button>
                  </Center>
                  {!success && message !== null && (
                    <Text c={"red"} ta={"center"}>
                      {message}
                    </Text>
                  )}
                </Stack>
              </form>
              <Stack gap={"sm"} mt={"sm"}>
                <Button
                  leftSection={<IconBrandGoogle />}
                  onClick={loginGoogle}
                  variant="default"
                >
                  Register with Google
                </Button>

                <Text>{`Already have an account?`}</Text>
                <UnstyledButton
                  component={NavLink}
                  to={"/login"}
                  onClick={() => navigate("/login")}
                  style={{ color: "blue" }}
                  ta={"center"}
                >
                  Login now
                </UnstyledButton>
              </Stack>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Register;
