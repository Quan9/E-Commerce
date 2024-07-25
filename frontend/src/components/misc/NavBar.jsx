/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import {
  ActionIcon,
  AspectRatio,
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Flex,
  Group,
  Image,
  Indicator,
  Menu,
  Stack,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconBell,
  IconBrandMantine,
  IconChevronRight,
  IconLogout,
  IconMoon,
  IconRegistered,
  IconShoppingCart,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGOUT } from "../../slices/UserSlice.jsx";
import { useEffect, useState } from "react";
import { getTotals } from "../../slices/CartSlice.jsx";
import { updateNoti } from "../../services/user.jsx";
const NavBar = ({ socket, anoUser, currentUser }) => {
  const cart = useSelector((state) => state.cart);
  const [opened, { toggle }] = useDisclosure();
  const [user, setUser] = useState(currentUser);
  const medium = useMediaQuery("(max-width:50em)");
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/")[1];
  const dispatch = useDispatch();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const redirectPage = (path) => {
    navigate(path);
  };
  useEffect(() => {
    const getTotal = () => {
      dispatch(getTotals());
    };
    cart && getTotal();
  }, [cart, dispatch]);

  useEffect(() => {
    const updateUser = () => {
      setUser(currentUser);
    };
    updateUser();
  }, [socket, currentUser]);
  useEffect(() => {
    const messageNoti = (data) => {
      if (location === "/user/chats") {
        handleClick("message");
      } else {
        let userEdit = JSON.parse(JSON.stringify(currentUser));
        userEdit.noti = data;
        localStorage.setItem("user", JSON.stringify(userEdit));
        setUser(userEdit);
      }
    };
    const orderNoti = (data) => {
      if (location === "/user/order") {
        handleClick("order");
      }
      let editUser = JSON.parse(JSON.stringify(currentUser));
      editUser.noti = data;
      localStorage.setItem("user", JSON.stringify(editUser));
      setUser(editUser);
    };
    socket.on("message notification", messageNoti);
    socket.on("new order", orderNoti);
    return () => {
      socket.off("message notification", messageNoti);
      socket.off("new order", orderNoti);
    };
  }, [socket, user]);
  useEffect(() => {
    const checkLocation = () => {
      if (location === "/user/chats") {
        handleClick("message");
      }
      if (location === "/user/order") {
        handleClick("order");
      }
    };
    checkLocation();
  }, [location]);
  const logout = () => {
    socket.emit(
      "logout",
      currentUser ? currentUser.username : anoUser.username
    );
    sessionStorage.removeItem("userSes");
    dispatch(LOGOUT());
    if (location !== "") navigate("/");
    window.location.reload();
  };
  console.log(location, "pathname");
  const checkNoti = () => {
    let noti = false;
    if (user) {
      user?.noti.map((item) => {
        if (item.number !== 0) noti = true;
      });
    }
    return noti;
  };

  const handleClick = (data, page) => {
    updateNoti(user._id, { noti: user.noti, data: data }).then((res) => {
      let editUser = JSON.parse(localStorage.getItem("user"));
      editUser.noti = res.data;
      localStorage.setItem("user", JSON.stringify(editUser));
      setUser(editUser);
      if (page) {
        redirectPage(`/user/${page}`);
      }
    });
  };

  return (
    <Container className="navbar">
      <Flex justify={"space-evenly"} align={"center"}>
        <Button
          component={NavLink}
          to="/"
          leftSection={<IconBrandMantine size={36} />}
          c="black"
        >
          MobileShop
        </Button>
        <Group flex={1} align="center" justify="center">
          <Button component={NavLink} to={"/cart"}>
            <Indicator
              label={cart.amount}
              offset={8}
              position="bottom-end"
              color="blue"
            >
              <IconShoppingCart size={36} color="black" />
            </Indicator>
          </Button>
        </Group>
        {currentUser ? (
          <Menu closeOnItemClick={false}>
            <Menu.Target>
              <Indicator
                disabled={!checkNoti()}
                position="bottom-start"
                processing={checkNoti()}
              >
                <ActionIcon p={0} size="compact-sm">
                  <Image
                    src={currentUser?.img}
                    alt="UserImage"
                    w={18}
                    h={18}
                    radius={50}
                  />
                  {currentUser.username}
                </ActionIcon>
              </Indicator>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={NavLink} to={"/user"}>
                <Text>Dashboard</Text>
              </Menu.Item>
              <Menu.Item>
                <Menu position="left-end">
                  <Menu.Target>
                    <ActionIcon
                      className={checkNoti() && "noti"}
                      bg={"blue"}
                      w={"100%"}
                    >
                      <IconBell />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {user?.noti.map((item, index) => {
                      return (
                        <Menu.Item
                          key={item + index}
                          onClick={() =>
                            handleClick(
                              item.name,
                              item.name === "message" ? `chats` : `order`
                            )
                          }
                        >
                          {item.number !== 0 ? item.number : "No "} new{" "}
                          {item.name}(s)
                        </Menu.Item>
                      );
                    })}
                  </Menu.Dropdown>
                </Menu>
              </Menu.Item>

              <Menu.Item
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light"
                  )
                }
              >
                <ActionIcon w={"100%"}>
                  <IconSun
                    className={"icon light"}
                    display={computedColorScheme === "light" && "none"}
                    stroke={1.5}
                  />
                  <IconMoon
                    className={"icon dark"}
                    display={computedColorScheme !== "light" && "none"}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Menu.Item>

              <Menu.Item onClick={logout}>
                <ActionIcon autoContrast p={0} size="compact-sm" c={"red"}>
                  <IconLogout size={18} />
                  Logout
                  <IconChevronRight
                    size="0.8rem"
                    stroke={1.5}
                    className="mantine-rotate-rtl"
                  />
                </ActionIcon>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <>
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                )
              }
              variant="default"
              size="xl"
              aria-label="Toggle color scheme"
            >
              <IconSun className={"icon light"} stroke={1.5} />
              <IconMoon className={"icon dark"} stroke={1.5} />
            </ActionIcon>
            <Button
              component={NavLink}
              to={"/login"}
              leftSection={<IconUser size={20} />}
              rightSection={
                <IconChevronRight
                  size="0.8rem"
                  stroke={1.5}
                  className="mantine-rotate-rtl"
                />
              }
              c="black"
              size="compact-sm"
            >
              Login
            </Button>
          </>
        )}
      </Flex>
    </Container>
  );
};
export default NavBar;
