import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSingleOrder } from "../services/order";
import {
  Container,
  Flex,
  Loader,
  Title,
  Text,
  Grid,
  GridCol,
  Stack,
  Group,
  TextInput,
} from "@mantine/core";
import { FormatPrice } from "../components";

const Order = () => {
  const location = useLocation();
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState();
  useEffect(() => {
    const getOrder = async () => {
      const orderId = location.state.data;
      getOrderManual(orderId);
    };
    location.state && getOrder();
  }, []);
  const getOrderManual = async (data) => {
    setLoading(true);
    await getSingleOrder(data)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.response.data);
        setLoading(false);
      });
  };
  return (
    <Container>
      <Title order={4} ta={"center"}>
        Order
      </Title>
      {loading ? (
        <Loader type="dots" />
      ) : (
        <Flex>
          {data ? (
            <Grid>
              <GridCol span={"auto"} ta={"center"}>
                <Text fw={500}>
                  {data.userId.match(/^[0-9]/) ? "UserId" : "User Name"}
                </Text>
                {data.userId}
              </GridCol>
              <GridCol span={"auto"} ta={"center"}>
                <Text fw={500}>Products</Text>
                {data.products.map((product, index) => {
                  return (
                    <Stack key={index} style={{ borderBottom: "solid" }}>
                      <Group justify="center">
                        <Text>
                          Name: {product.productName}({product.color})
                        </Text>
                        <Text>Quantity: {product.quantity}</Text>
                      </Group>
                    </Stack>
                  );
                })}
              </GridCol>
              <GridCol span={"auto"} ta={"center"}>
                <Text fw={500}>Address</Text>
                <Stack>
                  {data.address?.city === undefined ? (
                    <>
                      <Text>Email: {data.address?.email}</Text>
                      <Text>Name: {data.address?.name}</Text>
                      <Text>Phone Number: {data.address?.number}</Text>
                      <Text>Address: {data.address?.address}</Text>
                    </>
                  ) : (
                    <>
                      <Text>City: {data.address.city}</Text>
                      <Text>Country: {data.address.country}</Text>
                      <Text>Address: {data.address.line1}</Text>
                    </>
                  )}
                </Stack>
              </GridCol>
              <GridCol span={"content"} ta={"center"}>
                <Text fw={500}>Total Price</Text>
                <FormatPrice price={data.amount} />
              </GridCol>

              <GridCol span={"content"} ta={"center"}>
                <Text fw={500}>Shipment Status</Text>
                <Text fw={500}>{data.status}</Text>
              </GridCol>
            </Grid>
          ) : (
            <>
              {error ? (
                <Text c={"red"}>{error}</Text>
              ) : (
                <TextInput
                  ta={"center"}
                  mx={"auto"}
                  placeholder="enter your order full id"
                  label="Check your order"
                  onChange={(e) => setOrderId(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") getOrderManual(orderId);
                  }}
                />
              )}
            </>
          )}
        </Flex>
      )}
    </Container>
  );
};

export default Order;
