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
  Image,
  Input,
  Loader,
  Select,
  Text,
} from "@mantine/core";
import { IconFileImport } from "@tabler/icons-react";
import axios from "axios";
const EditUser = () => {
  const [data, setData] = useState();
  const { id } = useParams();
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
    if (data.img && typeof data.img !== "string") {
      const res = await uploadImage(data.img, "MobileShop");
      data.img = res.data.url;
    }
    try {
      await editUser(data._id, data)
        .then((res) => {
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
                    w={"70%"}
                  />
                </Center>
              ) : (
                <Text>No profile image</Text>
              )}
            </Card.Section>
            <Card.Section ta={"center"}>
              <Grid justify="space-evenly" style={{ wordBreak: "break-all" }}>
                <GridCol span={3}>
                  <Input.Wrapper label="User name">
                    <Text>{data.username}</Text>
                  </Input.Wrapper>
                </GridCol>
                <GridCol span={3}>
                  <Input.Wrapper label="Email">
                    <Text>{data.email}</Text>
                  </Input.Wrapper>
                </GridCol>
                <GridCol span={3}>
                  <Input.Wrapper label="Password">
                    <Input
                      // defaultValue={data.password}
                      value={data.password}
                      onChange={(e) => handleChange(e, "password")}
                    />
                  </Input.Wrapper>
                </GridCol>
                <GridCol span={3}>
                  <Input.Wrapper label="Role">
                    <Select
                      value={data.role}
                      data={values}
                      onChange={(e) => handleChange(e, "role")}
                    />
                  </Input.Wrapper>
                </GridCol>
                <GridCol>
                  <FileInput
                    accept="image/png,image/jpeg"
                    label="Profile Picture"
                    placeholder="upload Image"
                    style={{ overflow: "hidden" }}
                    onChange={(e) => handleChange(e, "img")}
                    leftSection={<IconFileImport size={"24"} />}
                    leftSectionPointerEvents="none"
                  />
                </GridCol>
              </Grid>
            </Card.Section>
            <Card.Section>
              <Button onClick={() => handleSubmit()}>Edit</Button>
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
