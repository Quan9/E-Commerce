/* eslint-disable no-extra-boolean-cast */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { redirect, useNavigate } from "react-router-dom";
import {
  addItem,
  removeItem,
  deleteItem,
  getTotals,
  clearCart,
} from "../slices/CartSlice";
import FormatPrice from "../components/misc/FormatPrice";
import { Stripe, StripeElements, loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent, getConfig } from "../services/payment";
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
} from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { toast } from "react-toastify";

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
    const [stripePublish, setStripePublish] = useState();
    const [type, setType] = useState("");
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
    }, [cart, dispatch, user]);
    const getStripe = () => {
      const el = document.querySelector("#payment");
      const btn = document.querySelector("#submit");
      let stripe12;
      let elements;
      async function load() {
        if (!el) {
          return;
        }
        stripe12 = await loadStripe(stripePublish);
        console.log(el, btn, "----", stripe12);

        const clientSecret = await createPaymentIntent({
          amount: cart.total,
        }).then((res) => {
          return res.data.clientSecret;
        });
        elements = stripe12?.elements({
          clientSecret: clientSecret,
          loader: "auto",
        });

        const payEl = elements?.create("payment", {
          layout: "tabs",
          fields: {
            billingDetails: {
              name: "auto",
              email: "auto",
              phone: "auto",
              address: { city: "auto", country: "auto", line1: "auto" },
            },
          },
        });
        payEl?.mount(el);
      }
      btn?.addEventListener("click", async () => {
        const sResult = await stripe12?.confirmPayment({
          elements,
          // confirmParams:{
          //   redirect:'if_required',
          //   return_url: 
          // },
        });
        if (sResult) {
          nav(`/checkoutsuccess?session_id=${sResult.paymentIntent.id}`);
        }
        if (!!sResult?.error) {
          toast.error(sResult.error.message, { position: "top-center" });
          return;
        }
      });

      load();
    };
    useEffect(() => {
      stripePublish && getStripe();
    }, [stripePublish]);
    const stripe = () => {
      getConfig().then((res) => {
        setStripePublish(res.data.publishableKey);
        setType("stripe");
      });
      // createPaymentIntent({ cart, user })
      //   .then((res) => {
      //     window.location.href = res.data.url;
      //   })
      //   .then((res) => {
      //     alert(res.data.url);
      //     window.location.href = res.data.url;
      //   });
    };
    const manual = () => {
      setType("manual");
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

                  {type === "" && (
                    <Group justify={"space-evenly"}>
                      <Button onClick={() => stripe()} variant="default">
                        Pay with Card
                      </Button>
                      <Button onClick={() => manual()} variant="default">
                        Cash Payment
                      </Button>
                    </Group>
                  )}
                </CardSection>
                {type === "manual" && (
                  <CardSection>
                    <Button onClick={() => setType("")} variant="default">
                      <IconArrowLeft />
                    </Button>
                    <form
                      onSubmit={form.onSubmit((values) => handleSubmit(values))}
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
                )}
                {type === "stripe" && (
                  <CardSection>
                    <Button
                      onClick={() => {
                        setType("");
                        setStripePublish();
                      }}
                      variant="default"
                    >
                      <IconArrowLeft />
                    </Button>
                    <div id="payment"></div>
                    <div>
                      <button id="submit">Pay Now</button>
                    </div>
                  </CardSection>
                )}
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
