/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import {
  ActionIcon,
  AspectRatio,
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
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];
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
    socket.on("message notification", (userNoti) => {
      if (location.pathname === "/user/chats") {
        handleClick("message");
      } else {
        let userEdit = JSON.parse(JSON.stringify(currentUser));
        userEdit.noti = userNoti;
        localStorage.setItem("user", JSON.stringify(userEdit));
        setUser(userEdit);
      }
    });
    socket.on("new order", (userOrder) => {
      if (location.pathname === "/user/orders") {
        handleClick("orders");
      }
      let editUser = JSON.parse(JSON.stringify(currentUser));
      editUser.noti = userOrder;
      localStorage.setItem("user", JSON.stringify(editUser));
      setUser(editUser);
    });
  });

  const logout = () => {
    socket.emit(
      "logout",
      currentUser ? currentUser.username : anoUser.username
    );
    sessionStorage.removeItem("userSes");
    dispatch(LOGOUT());
    if (pathname !== "") navigate("/");
    window.location.reload();
  };

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
    const a = location.pathname.split("/")[2];
    if (page && a === page) {
      return;
    }
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
      <Flex
        justify={"space-evenly"}
        align={"center"}
        display={opened && medium && "none"}
      >
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

        <Group visibleFrom="md" gap={"sm"}>
          {currentUser ? (
            <>
              <Stack gap={0} align="flex-start" justify="flex-start">
                <ActionIcon
                  onClick={() =>
                    setColorScheme(
                      computedColorScheme === "light" ? "dark" : "light"
                    )
                  }
                  variant="transparent"
                >
                  <IconSun className={"icon light"} stroke={1.5} />
                  <IconMoon className={"icon dark"} stroke={1.5} />
                </ActionIcon>
                <Menu>
                  <Menu.Target>
                    <UnstyledButton className={checkNoti() && "noti"}>
                      <Indicator
                        disabled={!checkNoti()}
                        processing={checkNoti()}
                      >
                        <IconBell />
                      </Indicator>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {user?.noti.map((item, index) => {
                      return (
                        <Menu.Item
                          key={item + index}
                          c={item.number !== 0 ? "blue" : "black"}
                          onClick={() =>
                            handleClick(
                              item.name,
                              item.name === "message" ? `chats` : `orders`
                            )
                          }
                          className="noti"
                        >
                          {item.number !== 0 ? item.number : "No "} new{" "}
                          {item.name}(s)
                        </Menu.Item>
                      );
                    })}
                  </Menu.Dropdown>
                </Menu>
              </Stack>
              <Stack gap={0} align="flex-start" justify="flex-start">
                <Button
                  component={NavLink}
                  to={"/user"}
                  leftSection={
                    <Image
                      src={currentUser?.img}
                      alt="UserImage"
                      w={18}
                      h={18}
                      radius={50}
                    />
                  }
                  p={0}
                  size="compact-sm"
                  autoContrast
                  c={"black"}
                >
                  {currentUser.username}
                </Button>
                <Button
                  leftSection={<IconLogout size={18} />}
                  rightSection={
                    <IconChevronRight
                      size="0.8rem"
                      stroke={1.5}
                      className="mantine-rotate-rtl"
                    />
                  }
                  autoContrast
                  onClick={logout}
                  p={0}
                  size="compact-sm"
                  c={"red"}
                >
                  Logout
                </Button>
              </Stack>
            </>
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
              <Stack gap={0} align="flex-start">
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
              </Stack>
            </>
          )}
        </Group>
        <Group hiddenFrom="md">
          <ActionIcon
            onClick={() =>
              setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
            variant="default"
            size="xl"
            aria-label="Toggle color scheme"
          >
            <IconSun className={"icon light"} stroke={1.5} />
            <IconMoon className={"icon dark"} stroke={1.5} />
          </ActionIcon>
          {currentUser && (
            <Menu>
              <Menu.Target>
                <UnstyledButton className={checkNoti() && "noti"}>
                  <IconBell size={36} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {user?.noti.map((item, index) => {
                  return (
                    <Menu.Item
                      key={item + index}
                      c={item.number !== 0 ? "blue" : "black"}
                      onClick={() =>
                        handleClick(
                          item.name,
                          item.name === "message" ? `chats` : `orders`
                        )
                      }
                    >
                      {item.number !== 0 ? item.number : "No "} new
                      {item.name}(s)
                    </Menu.Item>
                  );
                })}
              </Menu.Dropdown>
            </Menu>
          )}
          <Burger opened={opened} onClick={toggle} size="sm" />
        </Group>
      </Flex>
      <Drawer onClose={toggle} opened={opened}>
        <Drawer.Header>
          <Button
            component={NavLink}
            to={"/"}
            leftSection={<IconBrandMantine size={30} />}
            autoContrast
            color="black"
            mx={"auto"}
          >
            MobileShop
          </Button>
        </Drawer.Header>
        <Drawer.Body>
          {currentUser ? (
            <Group justify="center">
              <Button
                component={NavLink}
                to={"/user"}
                leftSection={
                  <Image src={currentUser?.img} alt="UserImage" w={36} h={36} />
                }
              >
                {currentUser.username}
              </Button>
              <Button
                leftSection={<IconLogout size={20} />}
                rightSection={
                  <IconChevronRight
                    size="0.8rem"
                    stroke={1.5}
                    className="mantine-rotate-rtl"
                  />
                }
                onClick={logout}
              >
                Logout
              </Button>
            </Group>
          ) : (
            <Group justify="center">
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
              >
                Login
              </Button>
            </Group>
          )}
        </Drawer.Body>
      </Drawer>
    </Container>
  );
};
export default NavBar;
