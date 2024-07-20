import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
  addItem,
  removeItem,
  deleteItem,
  getTotals,
  clearCart,
} from "../slices/CartSlice";
import { createPaymentIntent } from "../services/payment";
import {
  Button,
  Group,
  Card,
  CardSection,
  Center,
  Grid,
  GridCol,
  Image,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
  Table,
  Container,
  Flex,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconMinus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { FormatPrice } from "../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { motion } from "framer-motion";
const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const nav = useNavigate();
  const EmptyCart = () => {
    return (
      <Center w={"100%"} h={"85vh"}>
        <Stack>
          <Title order={1}>Your Cart is Empty</Title>
          <Button
            component={NavLink}
            to={"/"}
            variant="light"
            leftSection={<IconArrowLeft />}
          >
            Continue Shopping
          </Button>
        </Stack>
      </Center>
    );
  };

  const ShowCart = () => {
    const [payment, setPayment] = useState("");
    const form = useForm({
      initialValues: { name: "", email: "", phonenumber: "", address: "" },
      validate: {
        name: (value) =>
          value.length < 2 ? "Name must have at least 2 letters" : null,
        // email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
        phonenumber: (value) =>
          value.length < 8 ? "Invalid phone number" : null,
        address: isNotEmpty("Address must not be empty"),
      },
    });
    useEffect(() => {
      dispatch(getTotals());
    }, [cart, dispatch, user]);

    useEffect(() => {
      const stripeCheckout = () => {
        createPaymentIntent({ cart, user }).then((res) => {
          window.location.href = res.data.url;
        });
      };
      payment === "stripe" && stripeCheckout();
    }, [payment]);
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
    const handleSubmit = (values) => {
      nav("/checkoutsuccess", { state: { values } });
    };
    return (
      <Grid p={"md"}>
        <GridCol span={{ base: 12, lg: 8 }}>
          <Stack justify="center" align="center" bg={"rgba(198,198,198,0.5)"}>
            <Title order={2}>Item List</Title>
            <Button
              onClick={() => clear()}
              leftSection={<IconTrash size={20} />}
              c={"black"}
              ms={"auto"}
              variant="subtle"
            >
              Clear Cart
            </Button>
            <Group>
              <Stack>
                {cart.cartItems.map((item) => (
                  <Grid align="center" justify="space-around" key={item}>
                    <GridCol span={4}>
                      <Image src={item.thumbnail} alt={item.title} fit="fill" />
                    </GridCol>
                    <GridCol span={8} ms={"auto"}>
                      <Title ta="center" order={3}>
                        {item.name}
                      </Title>
                      <Text fw={600} ta="center">
                        Color: {item?.color}
                      </Text>
                      <Group justify="start" align="start">
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
                        {item.cartQuantity === item.inStock && (
                          <Text size="lg">No more items in stock</Text>
                        )}
                        <Button
                          className="btn px-3"
                          onClick={() => {
                            deletes(item);
                          }}
                          bg={"red"}
                          ms={"auto"}
                        >
                          <IconTrash color="black" />
                        </Button>
                      </Group>
                    </GridCol>
                  </Grid>
                ))}
              </Stack>
            </Group>
          </Stack>
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <Card pos={"sticky"} top={"10%"} bg={"rgba(198,198,198,0.5)"}>
            <Title order={3} ta={"center"}>
              Order Summary
            </Title>
            <CardSection>
              <Table ta={"center"}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th ta={"center"}>Product</Table.Th>
                    <Table.Th ta={"center"}>Quantity</Table.Th>
                    <Table.Th ta={"center"}>Price</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cart.cartItems.map((cartItem, index) => (
                    <Table.Tr key={cartItem + index}>
                      <Table.Td key={cartItem + index}>
                        <Text>
                          {cartItem.name} ({cartItem.color})
                        </Text>
                      </Table.Td>
                      <FormatPrice
                        price={cartItem.price}
                        discount={cartItem.discount}
                        quantity={cartItem.cartQuantity}
                      />
                    </Table.Tr>
                  ))}
                  <Table.Tr>
                    <Table.Td>
                      <Title order={3}>Total amount</Title>
                    </Table.Td>
                    <Table.Td></Table.Td>
                    <FormatPrice price={cart.total} />
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Space h="md" />

              {payment === "" && (
                <Group justify="space-around">
                  <Button
                    onClick={() => setPayment("stripe")}
                    variant="default"
                    size="compact-md"
                  >
                    Card Payment
                  </Button>
                  <Button
                    onClick={() => setPayment("manual")}
                    variant="default"
                    size="compact-md"
                  >
                    Cash Payment
                  </Button>
                </Group>
              )}
            </CardSection>
            {payment === "manual" && (
              <>
                <CardSection>
                  <Button
                    onClick={() => setPayment("")}
                    variant="default"
                    size="compact-md"
                  >
                    <IconArrowLeft />
                  </Button>
                </CardSection>
                <CardSection ta={"center"} style={{ justifyContent: "center" }}>
                  <form
                    onSubmit={form.onSubmit((values) => handleSubmit(values))}
                  >
                    <TextInput
                      label="Name"
                      withAsterisk
                      placeholder="Name"
                      {...form.getInputProps("name")}
                    />
                    <TextInput
                      label="Address"
                      withAsterisk
                      placeholder="Address"
                      {...form.getInputProps("address")}
                    />
                    <TextInput
                      label="Phone Number"
                      withAsterisk
                      placeholder="Phone Number"
                      {...form.getInputProps("phonenumber")}
                    />
                    <TextInput
                      label="Email"
                      placeholder="Email"
                      {...form.getInputProps("email")}
                    />
                    <Button type="submit">Order</Button>
                  </form>
                </CardSection>
              </>
            )}
          </Card>
        </GridCol>
      </Grid>
    );
  };

  return (
    <Container bg={"rgba(198,198,198,0.3)"} w={"100%"} h={"100%"}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ease: "easeInOut", duration: 1 }}
      >
        {cart.cartItems.length > 0 ? <ShowCart /> : <EmptyCart />}
      </motion.div>
    </Container>
  );
};

export default Cart;
