/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import "@mantine/charts/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container, MantineProvider } from "@mantine/core";
import "./app.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chat, NavBar, ProtectedRoute } from "./components";
import {
  Cart,
  ChatAgent,
  CheckOut,
  EditOrder,
  EditProduct,
  EditUser,
  Error404,
  Home,
  Login,
  NewProduct,
  NewUser,
  Order,
  ProductDetail,
  ProductsByCategory,
  ProfilePage,
  Register,
  TotalOrders,
  TotalProducts,
  TotalUsers,
  VerifyEmail,
} from "./pages";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [anoUser, setAnoUser] = useState();
  const { user } = useSelector((state) => state.user);
  const clientSocket = io(import.meta.env.VITE_URL, {
    transports: ["websocket"],
  });
  useEffect(() => {
    if (!socket && user === null) {
      setSocket(clientSocket);
      const checkUser =
        JSON.parse(sessionStorage.getItem("userSes"))?.username || null;
      clientSocket.emit("loggedUser", checkUser);
    } else {
      setSocket(clientSocket);
      clientSocket.emit("loggedUser", user.username);
    }
  }, []);
  useEffect(() => {
    clientSocket.on("user", (res) => {
      sessionStorage.setItem("userSes", JSON.stringify(res));
      setAnoUser(res);
    });
  }, [socket]);
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {socket && anoUser && (
        <BrowserRouter>
          <NavBar socket={socket} anoUser={anoUser} currentUser={user} />
          <Routes>
            <Route
              path="/verifyEmail/:username/:token"
              element={<VerifyEmail />}
            />
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                user ? <Navigate to={"/"} /> : <Login socket={clientSocket} />
              }
            />
            <Route path="/order" element={<Order />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/checkoutsuccess"
              element={<CheckOut socket={socket} />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/Phone">
              <Route index element={<ProductsByCategory />} />
              <Route
                path=":id"
                element={<ProductDetail user={user ? user : anoUser} />}
              />
            </Route>
            <Route path="/Laptop">
              <Route index element={<ProductsByCategory />} />
              <Route
                path=":id"
                element={<ProductDetail user={user ? user : anoUser} />}
              />
            </Route>

            <Route path="/Tablet">
              <Route index element={<ProductsByCategory />} />
              <Route
                path=":id"
                element={<ProductDetail user={user ? user : anoUser} />}
              />
            </Route>
            <Route path="/*" element={<Error404 />} />
            <Route
              path="/user"
              element={user ? <ProtectedRoute /> : <Navigate to={"/"} />}
            >
              <Route index element={<ProfilePage />} />
              <Route path="chats" element={<ChatAgent socket={socket} />} />
              <Route path="order">
                <Route index element={<TotalOrders />} />
                <Route path=":_id" element={<EditOrder />} />
              </Route>
              <Route path="products">
                <Route index element={<TotalProducts />} />
                <Route path=":id" element={<EditProduct />} />
                <Route path="new" element={<NewProduct />} />
              </Route>
              <Route path="totalUsers">
                <Route index element={<TotalUsers />} />
                <Route path=":id" element={<EditUser />} />
                <Route path="new" element={<NewUser />} />
              </Route>
            </Route>
          </Routes>
          {user === null ? (
            <Chat user={anoUser} socket={socket} loggedIn={false} />
          ) : (
            user &&
            user.role === "user" && (
              <Chat user={user} socket={socket} loggedIn={true} />
            )
          )}
        </BrowserRouter>
      )}
      <ToastContainer />
    </MantineProvider>
  );
};

export default App;
