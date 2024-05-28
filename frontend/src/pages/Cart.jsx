import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addItem,
  removeItem,
  deleteItem,
  getTotals,
  clearCart,
} from "../slices/CartSlice";
import FormatPrice from "../components/misc/FormatPrice";
import { createPaymentIntent } from "../services/payment";
import {
  Box,
  Button,
  Group,
  Card,
  CardSection,
  Center,
  Container,
  Grid,
  GridCol,
  Image,
  List,
  NavLink,
  Notification,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconMinus,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const nav = useNavigate();
  const EmptyCart = () => {
    return (
      <Center w={"100%"} h={"100%"}>
        <Stack>
          <Title order={1}>Your Cart is Empty</Title>
          <NavLink
            href="/"
            variant="light"
            leftSection={<IconArrowLeft />}
            label="Continue Shopping"
          ></NavLink>
        </Stack>
      </Center>
    );
  };

  const ShowCart = () => {
    const [checkOut, setCheckOut] = useState(false);
    const [payment, setPayment] = useState(false);
    const form = useForm({
      initialValues: { name: "", email: "", phonenumber: "", address: "" },

      // functions will be used to validate values at corresponding key
      validate: {
        name: (value) =>
          value.length < 2 ? "Name must have at least 2 letters" : null,
        email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
        phonenumber: (value) =>
          value.length < 8 ? "Invalid phone number" : null,
        address: isNotEmpty("Address must not be empty"),
      },
    });
    const increase = (product) => {
      dispatch(addItem(product));
    };
    const decrease = (product) => {
      dispatch(removeItem(product));
    };
    const deletes = (product) => {
      dispatch(deleteItem(product));
    };
    const clear = () => {
      dispatch(clearCart());
    };
    useEffect(() => {
      dispatch(getTotals());
      if (user) setCheckOut(true);
    }, [cart, dispatch, user]);

    const stripe = () => {
      if (checkOut) {
        createPaymentIntent({ cart, user }).then((res) => {
          nav(res.data.url);
        });
      } else {
        <Notification
          icon={<IconX style={{ width: "20rem", height: "20rem" }} />}
          color="red"
          title="Error!"
        >
          Must logged in first
        </Notification>;
      }
    };
    const manual = () => {
      setPayment(true);
    };
    const handleSubmit = (values) => {
      nav("/checkoutsuccess", { state: { values } });
    };
    return (
      <Container>
        <Center h={"100%"}>
          <Grid>
            <GridCol span={{ base: 12, lg: 8 }} me={"sm"}>
              <Stack w={"100%"} justify="center" align="center">
                <Title order={1}>Item List</Title>
                <Button
                  onClick={() => clear()}
                  leftSection={<IconTrash size={24} />}
                  variant="light"
                  ms={"auto"}
                >
                  Clear Cart
                </Button>
                <Group w={"100%"}>
                  <Stack w={"100%"}>
                    {cart.cartItems.map((item) => {
                      return (
                        <Grid
                          align="center"
                          justify="space-around"
                          key={item}
                          w={"100%"}
                        >
                          <GridCol span={5}>
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fit="contain"
                            />
                          </GridCol>
                          <GridCol span={7} ms={"auto"}>
                            <Title ta="center" order={3}>
                              {item.name}
                            </Title>
                            <Text fw={600} ta="center">
                              Color: {item?.color}
                            </Text>
                            <Group justify="end" align="end">
                              <Button
                                disabled={item.cartQuantity === 1}
                                onClick={() => {
                                  decrease(item);
                                }}
                                variant="light"
                              >
                                <IconMinus />
                              </Button>

                              <Text>{item.cartQuantity}</Text>

                              <Button
                                onClick={() => {
                                  increase(item);
                                }}
                                variant="light"
                                disabled={item.cartQuantity === item.inStock}
                              >
                                <IconPlus />
                              </Button>
                            </Group>
                            <Group justify="end" align="end">
                              {item.cartQuantity === item.inStock && (
                                <Text size="lg">No more items in stock</Text>
                              )}
                              <Button
                                className="btn px-3"
                                onClick={() => {
                                  deletes(item);
                                }}
                                size="xs"
                              >
                                <IconTrash />
                              </Button>
                            </Group>
                          </GridCol>
                        </Grid>
                      );
                    })}
                  </Stack>
                </Group>
              </Stack>
            </GridCol>
            <GridCol span={{ base: 12, lg: 3 }}>
              <Card pos={"sticky"} top={40}>
                <Title order={3} ta={"center"}>
                  Order Summary
                </Title>
                <CardSection>
                  <List>
                    {cart.cartItems.map((cartItem) => (
                      <List.Item key={cartItem.name} in>
                        <Text>
                          {cartItem.name} ({cartItem.color}){" "}
                        </Text>
                        <FormatPrice
                          price={cartItem.price}
                          discount={cartItem.discount}
                          quantity={cartItem.cartQuantity}
                        />
                      </List.Item>
                    ))}
                  </List>
                  <Space h="md" />
                  <Title order={3} fw={750} ta={"center"}>
                    Total amount
                  </Title>
                  <FormatPrice price={cart.total} />

                  {!payment ? (
                    <Group justify={"space-evenly"}>
                      <Button onClick={() => stripe()} variant="default">
                        Pay with Card
                      </Button>
                      <Button onClick={() => manual()} variant="default">
                        Cash Payment
                      </Button>
                    </Group>
                  ) : (
                    <Card>
                      <CardSection>
                        <Button
                          onClick={() => setPayment(false)}
                          variant="default"
                        >
                          <IconArrowLeft />
                        </Button>
                      </CardSection>
                      <CardSection>
                        <form
                          onSubmit={form.onSubmit((values) =>
                            handleSubmit(values)
                          )}
                        >
                          <TextInput
                            label="Name (*)"
                            placeholder="Name"
                            {...form.getInputProps("name")}
                          />
                          <TextInput
                            label="Address (*)"
                            placeholder="Address"
                            {...form.getInputProps("address")}
                          />
                          <TextInput
                            label="Phone Number (*)"
                            placeholder="Phone Number"
                            {...form.getInputProps("phonenumber")}
                          />
                          <TextInput
                            label="Email (*)"
                            placeholder="Email"
                            {...form.getInputProps("email")}
                          />
                          <Button type="submit">Order</Button>
                        </form>
                      </CardSection>
                    </Card>
                  )}
                </CardSection>
              </Card>
            </GridCol>
          </Grid>
        </Center>
      </Container>
    );
  };

  return (
    <Box h={"90vh"} w={"100%"}>
      {cart.cartItems.length > 0 ? <ShowCart /> : <EmptyCart />}
    </Box>
  );
};

export default Cart;
