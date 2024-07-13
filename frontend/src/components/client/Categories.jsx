import { Button, Flex, TextInput } from "@mantine/core";
import {
  IconDeviceIpad,
  IconDeviceLaptop,
  IconDeviceMobile,
} from "@tabler/icons-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Categories = () => {
  const [content, setContent] = useState();
  const nav = useNavigate();
  const navigate = () => {
    return nav("/order", { state: { data: content } });
  };
  return (
    <>
      <Flex justify="space-around" direction={"row"} mb={"sm"}>
        <Button
          component={NavLink}
          to={"/Phone"}
          leftSection={<IconDeviceMobile size={26} />}
          variant="default"
        >
          Phone
        </Button>
        <Button
          component={NavLink}
          to={"/Tablet"}
          leftSection={<IconDeviceIpad size={26} />}
          variant="default"
        >
          Tablet
        </Button>
        <Button
          component={NavLink}
          to={"/Laptop"}
          leftSection={<IconDeviceLaptop size={26} />}
          variant="default"
        >
          Laptop
        </Button>
      </Flex>
      <TextInput
        w={"50%"}
        ta={"center"}
        mx={"auto"}
        placeholder="enter your order full id"
        label="Check your order"
        onChange={(e) => setContent(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate();
        }}
      />
    </>
  );
};

export default Categories;
