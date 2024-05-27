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
} from "@mantine/core";
import { useState } from "react";
import axios from "axios";
import { register } from "../services/auth";
import { IconArrowLeft, IconFileImport, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Register = () => {
  const [img, setImg] = useState();
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [load, setLoad] = useState(false);
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
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
  const redirectPage = (path) => {
    navigate(path);
  };

  return (
    <Container px={0}>
      <Center h={"90vh"}>
        {user ? (
          <Alert variant="light" color="blue" title="Already logged-in">
            <Button onClick={() => navigate("/")}>Back to Home Page</Button>
          </Alert>
        ) : (
          <>
            {success ? (
              <Flex direction={"column"} align={"center"}>
                <Text c={"green"}>{message}</Text>
                <Group justify="space-between">
                  <Button
                    leftSection={<IconArrowLeft />}
                    variant="transparent"
                    onClick={() => redirectPage("/")}
                  >
                    HomePage
                  </Button>
                  <Button
                    leftSection={<IconUser />}
                    variant="transparent"
                    onClick={() => redirectPage("/login")}
                  >
                    Login
                  </Button>
                </Group>
              </Flex>
            ) : (
              <Card withBorder bg={"rgba(195, 195, 195, 0.3)"}>
                <CardSection>
                  <form
                    onSubmit={form.onSubmit((values) => handleSubmit(values))}
                  >
                    <TextInput
                      label="Name"
                      placeholder="Name (*)"
                      {...form.getInputProps("username")}
                    />
                    <TextInput
                      mt="sm"
                      label="Email (*)"
                      placeholder="Email"
                      {...form.getInputProps("email")}
                    />
                    <PasswordInput
                      mt="sm"
                      label="Password (*)"
                      placeholder="password"
                      {...form.getInputProps("password")}
                    />
                    <FileInput
                      mt="sm"
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
                    />
                    <Center>
                      <Button
                        type="submit"
                        mt="md"
                        disabled={load}
                      >
                        {load ? "Loading" : "Register"}
                      </Button>
                    </Center>

                    {!success && message !== null && (
                      <Text c={"red"}>{message}</Text>
                    )}
                  </form>
                </CardSection>
                <Text>{`Already have an account?`}</Text>
                <UnstyledButton
                  onClick={() => navigate("/login")}
                  style={{ color: "blue" }}
                  ta={"center"}
                >
                  Login now
                </UnstyledButton>
              </Card>
            )}
          </>
        )}
      </Center>
    </Container>
  );
};

export default Register;
