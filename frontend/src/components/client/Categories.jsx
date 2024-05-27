import { Button, Grid } from "@mantine/core";
import {
  IconDeviceIpad,
  IconDeviceLaptop,
  IconDeviceMobile,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const nav = useNavigate();
  return (
    <Grid justify="space-evenly" align="center" bg={"gray"} mb={"md"}>
      <Grid.Col span={4} align="center">
        <Button
          leftSection={<IconDeviceMobile size={26} />}
          onClick={() => {
            nav(`/Phone`);
          }}
          variant="default"
        >
          Phone
        </Button>
      </Grid.Col>
      <Grid.Col span={4} align="center">
        <Button
          leftSection={<IconDeviceIpad size={26} />}
          onClick={() => {
            nav(`/Tablet`);
          }}
          variant="default"
        >
          Tablet
        </Button>
      </Grid.Col>
      <Grid.Col span={4} align="center">
        <Button
          leftSection={<IconDeviceLaptop size={26} />}
          onClick={() => {
            nav(`/Laptop`);
          }}
          variant="default"
        >
          Laptop
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default Categories;
