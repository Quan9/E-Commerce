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
  Box,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  TableTd,
} from "@mantine/core";
import { FormatPrice } from "../components";
import dayjs from "dayjs";

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
        console.log(res.data);
        const sortData = res.data.reverse();
        setData(sortData);
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
            <Table>
              <TableThead>
                <TableTr>
                  <TableTh>userId</TableTh>
                  <TableTh>phone</TableTh>
                  <TableTh>Products</TableTh>
                  <TableTh>Amount</TableTh>
                  <TableTh>status</TableTh>
                  <TableTh>payment</TableTh>
                  <TableTh>Date</TableTh>
                </TableTr>
              </TableThead>
              <TableTbody>
                {data.map((item, index) => {
                  return (
                    <TableTr>
                      <TableTd>{item.userId}</TableTd>
                      <TableTd>
                        {item?.phone ||
                          item?.address?.number ||
                          item?.address?.phonenumber}
                      </TableTd>
                      <TableTd>
                        <Group>
                          {item.products.map((product) => (
                            <Stack key={product.productName + product.color}>
                              <Text>
                                {product.productName}({product.color}) {" x "}
                                {product.quantity}
                              </Text>
                            </Stack>
                          ))}
                        </Group>
                      </TableTd>
                      <TableTd>{item.amount}</TableTd>
                      <TableTd>{item.status}</TableTd>
                      <TableTd>{item.payment_method}</TableTd>
                      <TableTd>
                        {dayjs(item.createdAt).format("MM-DD-YYYY")}
                      </TableTd>
                    </TableTr>
                  );
                })}
              </TableTbody>
            </Table>
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
