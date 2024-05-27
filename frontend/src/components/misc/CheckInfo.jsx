/* eslint-disable react/prop-types */
import {  Box, Button, Grid, GridCol, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

const CheckInfo = ({ info,withModal }) => {
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
        {dData.map((item, index) => {
          return (
            <GridCol span={item.name.match(/[0-9]/) ? 'content' : place} key={index}>
              {!item.name.match(/[0-9]/) && (
                <Text fw={place === 12 ? "500" : "600"} span>
                  {capitalize(item.name)}
                  {place === 6 && ":"}{" "}
                </Text>
              )}
              {typeof item.value !== "string" ? (
                <>{displayData(item.value, 12)}</>
              ) : (
                <Text span>{item.value}</Text>
              )}
            </GridCol>
          );
        })}
      </Grid>
    );
  };
  const capitalize = (string) => {
    const a = string.split(/(?=[A-Z])/);
    a[0] = a[0].charAt(0).toUpperCase() + a[0].slice(1).toLowerCase();
    return a.join(" ");
  };
  return (
    <Box>
      {data && (
        <>
          <Box
            style={{
              height: 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.map((items, index) => {
              return (
                <Grid key={items.name + index}>
                  <GridCol span={12} order={items.name == "backCamera" ? 1 : 2}>
                    <Title order={2} w={"100%"} align="center">
                      {capitalize(items.name)}
                    </Title>
                    {displayData(items.value, 6)}
                  </GridCol>
                </Grid>
              );
            })}
          </Box>
          {withModal && 
        <>
          <Modal opened={opened} onClose={close} withCloseButton={true}>
            {data.map((items, index) => {
              return (
                <Grid key={items.name + index}>
                  <GridCol span={12} order={items.name == "backCamera" ? 1 : 2}>
                    <Title order={2} w={"100%"} align="center">
                      {capitalize(items.name)}
                    </Title>
                    {displayData(items.value, 6)}
                  </GridCol>
                </Grid>
              );
            })}
          </Modal>
          <Button fullWidth variant="default" onClick={open}>
            Details
          </Button>
        </>  
        }
        </>
      )}
    </Box>
  );
};

export default CheckInfo;
