/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { newOrder } from "../services/order";
import { clearCart } from "../slices/CartSlice";
import { retrieveSession } from "../services/payment";
import { Button, Center, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { toast } from "react-toastify";
const CheckOut = ({ socket }) => {
  const location = useLocation();
  const cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [session, setSession] = useState(null);
  const [orderId, setOrderId] = useState();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const form = {
    products: cart?.cartItems.map((item) => ({
      productId: item._id,
      productName: item.name,
      color: item.color,
      colorId: item.colorId,
      quantity: item.cartQuantity,
      productPrice: item.discount ? item.discount : item.price,
    })),
    amount: cart.total,
  };
  useEffect(() => {
    const createOrder = () => {
      if (user) {
        form.userId = user.username;
      } else {
        const sessionUser = JSON.parse(sessionStorage.getItem("userSes"));
        form.userId = sessionUser.username;
      }
      form.address = session.customer_details.address;
      form.phone = session.customer_details.phone;
      form.payment_method = session.payment_method_types[0];
      newOrder(form)
        .then((res) => {
          setOrderId(res.data._id);
          socket.emit("orderSuccess");
          dispatch(clearCart());
        })
        .catch((err) => {
          toast.error(err, { position: "top-right" });
        });
    };

    session && createOrder();
  }, [session]);
  useEffect(() => {
    const saveOrder = () => {
      // order by Card
      if (location.search) {
        retrieveSession(location.search.split("session_id=")[1]).then((res) => {
          setSession(res.data);
        });
      }

      // order by Cash
      if (location.state) {
        const username = user?.username || location.state.values.name;
        form.payment_method = "cash";
        form.address = location.state.values;
        form.phone = location.state.values.phonenumber;
        form.userId = username;
        newOrder(form)
          .then((res) => {
            setOrderId(res.data._id);
            socket.emit("orderSuccess");
            dispatch(clearCart());
          })
          .catch((err) => {
            toast.error(err, { position: "top-right" });
          });
      }
    };
    cart.cartItems.length !== 0 && saveOrder();
  }, []);

  return (
    <Center mah={"90%"} maw={"100%"}>
      {orderId ? (
        <Stack>
          <Title order={3} c={"blue"}>
            Order has been created successfully. Your order number is{" "}
          </Title>
          <Text fw={750} ta="center">
            {orderId}
          </Text>
          <Button
            onClick={() => nav("/")}
            leftSection={<IconArrowLeft size={26} />}
          >
            Back to Homepage
          </Button>
        </Stack>
      ) : cart.cartItems.length === 0 ? (
        <Title order={3}>No payment detected. Please Checkout first!</Title>
      ) : (
        <Title order={3}>
          Payment Successful. Your order is being prepared...
        </Title>
      )}
    </Center>
  );
};
export default CheckOut;
