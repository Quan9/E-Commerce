import { Button, Flex } from "@mantine/core";
import {
  IconDeviceIpad,
  IconDeviceLaptop,
  IconDeviceMobile,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const nav = useNavigate();
  return (
    <Flex
      justify="space-around"
      direction={"row"}
    >
      <Button
        leftSection={<IconDeviceMobile size={26} />}
        onClick={() => {
          nav(`/Phone`);
        }}
        variant="default"
      >
        Phone
      </Button>
      <Button
        leftSection={<IconDeviceIpad size={26} />}
        onClick={() => {
          nav(`/Tablet`);
        }}
        variant="default"
      >
        Tablet
      </Button>
      <Button
        leftSection={<IconDeviceLaptop size={26} />}
        onClick={() => {
          nav(`/Laptop`);
        }}
        variant="default"
      >
        Laptop
      </Button>
    </Flex>
  );
};

export default Categories;
