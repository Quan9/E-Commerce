/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Grid,
  GridCol,
  List,
  ListItem,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

const CheckInfo = ({ info, withModal }) => {
  const [data, setData] = useState([]);
  const recursive = (value) => {
    const items = Object.entries(value).flatMap(([key, values]) => ({
      name: key,
      value: values,
    }));
    items.map((item) => {
      if (typeof item.value === "object") {
        item.value = recursive(item.value);
      }
    });
    return items;
  };
  useEffect(() => {
    const getData = (info) => {
      const temp = [];
      Object.keys(info).forEach((key) => {
        temp.push({ name: key, value: recursive(info[key]) });
      });
      setData(temp);
    };
    getData(info);
  }, []);
  const [opened, { open, close }] = useDisclosure(false);
  const displayData = (dData, place) => {
    return (
      <Grid>
        {dData.map((item, index) => (
          <GridCol
            span={
              item.name.match(/[0-9]/)
                ? "content"
                : index === dData.length - 1 && index % 2 === 0
                ? 12
                : 6
            }
            key={index}
          >
            <List>
              <ListItem>
                {!item.name.match(/[0-9]/) && (
                  <Text color={"#99a2aa"} span>
                    {capitalize(item.name)}
                    {place === 6 && ":"}{" "}
                  </Text>
                )}
                {typeof item.value !== "string" ? (
                  <>{displayData(item.value, 12)}</>
                ) : item.name === "releaseDate" ? (
                  <>
                    {new Date(item.value).getMonth()}/
                    {new Date(item.value).getFullYear()}
                  </>
                ) : (
                  <>{item.value}</>
                )}
              </ListItem>
            </List>
          </GridCol>
        ))}
      </Grid>
    );
  };
  const capitalize = (string) => {
    const a = string.split(/(?=[A-Z])/);
    a[0] = a[0].charAt(0).toUpperCase() + a[0].slice(1).toLowerCase();
    return a.join(" ");
  };
  return (
    <>
      {data && (
        <>
          <Box
            style={{
              height: 350,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            // pt={"sm"}
          >
            {data.map((items, index) => {
              return (
                <Stack key={items.name + index}>
                  <Title order={2} ta={"center"}>
                    System Info
                  </Title>
                  <Title
                    order={5}
                    w={"100%"}
                    align="center"
                    bg={"rgba(195, 195, 195, 0.3)"}
                    mt={index !== 0 && "sm"}
                  >
                    {capitalize(items.name)}
                  </Title>
                  {displayData(items.value, 6)}
                </Stack>
              );
            })}
          </Box>
          {withModal && (
            <>
              <Modal
                size={"xl"}
                opened={opened}
                onClose={close}
                withCloseButton={true}
                transitionProps={{ transition: "fade-up" }}
                overlayProps={{
                  bg: "black",
                }}
              >
                {data.map((items, index) => {
                  return (
                    <Stack
                      key={items.name + index}
                      bg={"rgba(195, 195, 195, 0.1)"}
                    >
                      <Title
                        order={4}
                        w={"100%"}
                        bg={"rgba(195, 195, 195, 0.3)"}
                        ta="center"
                        mt={"sm"}
                      >
                        {capitalize(items.name)}
                      </Title>

                      {displayData(items.value, 6)}
                    </Stack>
                  );
                })}
              </Modal>
              <Button fullWidth variant="default" onClick={open}>
                Details
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default CheckInfo;
