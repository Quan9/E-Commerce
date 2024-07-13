import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { editUser, getSingleUser } from "../../../services/user";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Center,
  FileInput,
  Grid,
  GridCol,
  Group,
  Image,
  Input,
  Loader,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { IconFileImport } from "@tabler/icons-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../../../slices/UserSlice";
const EditUser = () => {
  const [data, setData] = useState();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getSingleUser(id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);
  const values = [
    {
      value: "guess",
      label: "guess",
    },
    {
      value: "admin",
      label: "admin",
    },
    {
      value: "user",
      label: "user",
    },
  ];
  const handleChange = (data, name) => {
    setData((prev) => ({
      ...prev,
      [name]: data,
    }));
  };
  const uploadImage = (data, preset) => {
    const formData = new FormData();
    formData.append("file", data);
    formData.append("upload_preset", preset);
    return axios.post(
      "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
      formData
    );
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (data.img && typeof data.img !== "string") {
      const res = await uploadImage(data.img, "MobileShop");
      data.img = res.data.url;
    }
    try {
      await editUser(data._id, data)
        .then((res) => {
          dispatch(LOGIN_SUCCESS(data));
          toast.success(res.data);
        })
        .catch((err) => {
          toast.error(err);
        });
    } catch (error) {
      toast.error(error, {
        position: "top-center",
      });
    }
    setLoading(false);
  };
  return (
    <Center>
      <Card withBorder bg={"rgba(195, 195, 195, 0.1)"}>
        {data ? (
          <>
            <Card.Section ta={"center"}>
              <Text>Profile Picture</Text>

              {data.img && data.img !== "" ? (
                <Center>
                  <Image
                    src={
                      typeof data.img === "string"
                        ? data.img
                        : URL.createObjectURL(data.img)
                    }
                    w={250}
                  />
                </Center>
              ) : (
                <Text>No profile image</Text>
              )}
            </Card.Section>
            <Card.Section ta={"center"}>
              <Stack>
                <Group justify="space-evenly">
                  <Input.Wrapper label="User name">
                    <Text>{data.username}</Text>
                  </Input.Wrapper>
                  <Input.Wrapper label="Email">
                    <Text>{data.email}</Text>
                  </Input.Wrapper>
                </Group>
                <Group justify="space-evenly">
                  <Input.Wrapper label="Password">
                    <Input
                      // defaultValue={data.password}
                      value={data.password}
                      onChange={(e) => handleChange(e, "password")}
                    />
                  </Input.Wrapper>
                  <Input.Wrapper label="Role" hidden={data.role !== "admin"}>
                    <Select
                      value={data.role}
                      data={values}
                      onChange={(e) => handleChange(e, "role")}
                    />
                  </Input.Wrapper>
                  <FileInput
                    accept="image/png,image/jpeg"
                    label="Profile Picture"
                    placeholder="upload Image"
                    style={{ overflow: "hidden" }}
                    onChange={(e) => handleChange(e, "img")}
                    leftSection={
                      <IconFileImport
                        style={{ width: "18rem", height: "18rem" }}
                        stroke={1.5}
                      />
                    }
                    leftSectionPointerEvents="none"
                  />
                </Group>
              </Stack>
            </Card.Section>
            <Card.Section mt={"sm"} ta={"center"}>
              <Button onClick={() => handleSubmit()} disabled={loading}>
                {loading ? <Loader type="dots" /> : "Edit"}
              </Button>
            </Card.Section>
          </>
        ) : (
          <Center>
            <Loader />
          </Center>
        )}
      </Card>
    </Center>
  );
};

export default EditUser;
