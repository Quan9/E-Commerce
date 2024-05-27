/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import "@mantine/charts/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/tiptap/styles.css";
import "mantine-datatable/styles.layer.css";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import NavBar from "./components/navbar/NavBar";
import Chat from "./components/client/Chat";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProtectedRoute from "./components/config/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import CheckOut from "./pages/CheckOut";
import ChatAgent from "./pages/agent/chat/ChatAgent";
import Cart from "./pages/Cart";
import "./app.css";
import Error404 from "./pages/Error404";
import ProductsByCategory from "./pages/ProductsByCategory";
import ProductDetail from "./pages/ProductDetail";
import TotalOrders from "./pages/agent/orders/TotalOrders";
import Example from "./pages/agent/orders/Example";
import TotalProducts from "./pages/agent/products/TotalProducts";
import EditProduct from "./pages/agent/products/EditProduct";
import NewProduct from "./pages/agent/products/NewProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditOrder from "./pages/agent/orders/EditOrder";
import TotalUsers from "./pages/agent/users/TotalUsers";
import EditUser from "./pages/agent/users/EditUser";
import NewUser from "./pages/agent/users/NewUser";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [anoUser, setAnoUser] = useState();
  const { user } = useSelector((state) => state.user);
  const clientSocket = io("http://localhost:8080");
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login socket={socket} />} />
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
            <Route path="/Laptop" element={<ProductsByCategory />} />
            <Route path="/Tablet" element={<ProductsByCategory />} />
            <Route path="/*" element={<Error404 />} />
            <Route path="/user" element={<ProtectedRoute />}>
              <Route index element={<ProfilePage />} />
              <Route path="chats" element={<ChatAgent socket={socket} />} />
              <Route path="orders">
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
              <Route path="example" element={<Example />} />
            </Route>
          </Routes>
          {user === null && (
            <Chat user={anoUser} socket={socket} loggedIn={false} />
          )}
          {user && user.role === "user" && (
            <Chat user={user} socket={socket} loggedIn={true} />
          )}
        </BrowserRouter>
      )}
      <ToastContainer />
    </MantineProvider>
  );
};

export default App;
