import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  PasswordInput,
  FileInput,
  Text,
  Center,
  Image,
  Container,
  Card,
  CardSection,
  Select,
} from "@mantine/core";
import { useState } from "react";
import axios from "axios";
import { register } from "../../../services/auth";
import { IconFileImport } from "@tabler/icons-react";
import { toast } from "react-toastify";
const NewUser = () => {
  const [img, setImg] = useState();
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [load, setLoad] = useState(false);
  const values = ["user", "admin"];
  const form = useForm({
    initialValues: { username: "", email: "", password: "", role: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      username: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must have at least 6 characters" : null,
      role: (value) => (value === "" ? "Must select a role for user" : null),
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
        toast.success(res.data);
      })
      .catch((err) => {
        setMessage(err.response.data);
        setLoad(false);
      });
  };
  return (
    <Container>
      <Card withBorder bg={"rgba(195, 195, 195, 0.3)"}>
        <CardSection>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
            <Select
              {...form.getInputProps("role")}
              data={values}
              label="Role(*)"
            />
            <FileInput
              mt="sm"
              label="Profile Picture"
              accept="image/png,image/jpeg"
              placeholder="Import file"
              onChange={(e) => setImg(e)}
              style={{ overflow: "hidden" }}
              leftSection={img && <Image src={URL.createObjectURL(img)} />}
              rightSection={
                <IconFileImport
                  style={{ width: "18rem", height: "18rem" }}
                  stroke={1.5}
                />
              }
            />
            <Center>
              <Button type="submit" mt="md" disabled={load}>
                {load ? "Loading" : "Register"}
              </Button>
            </Center>

            {!success && message !== null ? (
              <Text c={"red"} ta={"center"}>
                {message}
              </Text>
            ) : (
              <Text c={"blue"} ta={"center"}>
                {message}
              </Text>
            )}
          </form>
        </CardSection>
      </Card>
    </Container>
  );
};

export default NewUser;
