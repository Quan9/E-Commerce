/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import {
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
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconBell,
  IconBrandMantine,
  IconChevronRight,
  IconLogout,
  IconRegistered,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const pathname = location.pathname.split("/")[1];
  const dispatch = useDispatch();
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
  const logout = () => {
    socket.emit("logout", anoUser.username);
    sessionStorage.removeItem("userSes");
    dispatch(LOGOUT());
    if (pathname === "") window.location.reload();
    else navigate("/");
  };
  const checkNoti = () => {
    let noti = true;
    if (user) {
      user?.noti.map((item) => {
        if (item.number !== 0) return (noti = false);
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
      let editUser = JSON.parse(JSON.stringify(currentUser));
      editUser.noti = userOrder;
      localStorage.setItem("user", JSON.stringify(editUser));
      setUser(editUser);
    });
  });
  return (
    <Container
      h={"10%"}
      size={"xs"}
      w={"100%"}
      maw={"100%"}
      mb={"md"}
      style={{ position: "sticky", top: "0", zIndex: "2" }}
      bg={"rgba(195, 195, 195, 10)"}
    >
      <Flex
        justify={"space-between"}
        align={"center"}
        display={opened && medium && "none"}
      >
        <Button
          leftSection={<IconBrandMantine size={30} />}
          autoContrast={true}
          variant="transparent"
          color="black"
          onClick={() => redirectPage("/")}
        >
          MobileShop
        </Button>
        <UnstyledButton
          onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
          onClick={() => redirectPage("/cart")}
        >
          <Indicator
            label={cart.amount}
            offset={7}
            position="bottom-end"
            color="blue"
            size={16}
          >
            <IconShoppingCart size={36} />
          </Indicator>
        </UnstyledButton>

        <Group visibleFrom="md" gap={2}>
          {currentUser ? (
            <>
              <Menu>
                <Menu.Target>
                  <UnstyledButton>
                    <Indicator
                      disabled={checkNoti()}
                      inline
                      size={16}
                      offset={7}
                      color="blue"
                      withBorder
                      processing
                    >
                      <IconBell size={36} />
                    </Indicator>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label fw={750}>Order</Menu.Label>
                  {user?.noti.map((item) => {
                    if (item.name === "order") {
                      if (item.number === 1)
                        return (
                          <Menu.Item
                            c={"blue"}
                            fw={500}
                            key={item.name}
                            onClick={() => handleClick(item.name, "orders")}
                          >
                            {item.number} new order
                          </Menu.Item>
                        );
                      else if (item.number > 1)
                        return (
                          <Menu.Item
                            c={"blue"}
                            fw={500}
                            key={item.name}
                            onClick={() => handleClick(item.name, "orders")}
                          >
                            {item.number} new orders
                          </Menu.Item>
                        );
                      else
                        return (
                          <Menu.Item fw={500} key={item.name}>
                            No new order
                          </Menu.Item>
                        );
                    }
                  })}
                  <Menu.Divider />
                  <Menu.Label>Message</Menu.Label>
                  {user?.noti.map((item) => {
                    if (item.name === "message") {
                      if (item.number === 1)
                        return (
                          <Menu.Item
                            c={"blue"}
                            fw={500}
                            onClick={() => handleClick(item.name, "chats")}
                            key={item.name}
                          >
                            {item.number} new message
                          </Menu.Item>
                        );
                      else if (item.number > 1)
                        return (
                          <Menu.Item
                            c={"blue"}
                            fw={500}
                            onClick={() => handleClick(item.name, "chats")}
                            key={item.name}
                          >
                            {item.number} new messages
                          </Menu.Item>
                        );
                      else
                        return (
                          <Menu.Item fw={500} key={item.name}>
                            No new message
                          </Menu.Item>
                        );
                    }
                  })}
                </Menu.Dropdown>
              </Menu>
              <Button
                leftSection={
                  <AspectRatio ratio={1080 / 720} maw={30}>
                    <Image src={currentUser?.img} alt="UserImage" />
                  </AspectRatio>
                }
                autoContrast={true}
                variant="light"
                onClick={() => redirectPage("/user")}
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
                autoContrast={true}
                variant="light"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                leftSection={<IconUser size={20} />}
                rightSection={
                  <IconChevronRight
                    size="0.8rem"
                    stroke={1.5}
                    className="mantine-rotate-rtl"
                  />
                }
                size="compact-md"
                autoContrast={true}
                variant="light"
                onClick={() => redirectPage("login")}
              >
                Login
              </Button>
              <Button
                leftSection={<IconRegistered size={20} />}
                rightSection={
                  <IconChevronRight
                    size="0.8rem"
                    stroke={1.5}
                    className="mantine-rotate-rtl"
                  />
                }
                size="compact-md"
                autoContrast={true}
                variant="light"
                onClick={() => redirectPage("register")}
              >
                Register
              </Button>
            </>
          )}
        </Group>
        <Group hiddenFrom="md">
          {currentUser && (
            <Menu>
              <Menu.Target>
                <UnstyledButton>
                  <Indicator
                    disabled={checkNoti()}
                    inline
                    size={16}
                    offset={7}
                    color="blue"
                    withBorder
                    processing
                  >
                    <IconBell size={36} />
                  </Indicator>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label fw={750}>Order</Menu.Label>
                {user?.noti.map((item) => {
                  if (item.name === "order") {
                    if (item.number === 1)
                      return (
                        <Menu.Item
                          c={"blue"}
                          fw={500}
                          key={item.name}
                          onClick={() => handleClick(item.name, "orders")}
                        >
                          {item.number} new order
                        </Menu.Item>
                      );
                    else if (item.number > 1)
                      return (
                        <Menu.Item
                          c={"blue"}
                          fw={500}
                          key={item.name}
                          onClick={() => handleClick(item.name, "orders")}
                        >
                          {item.number} new orders
                        </Menu.Item>
                      );
                    else
                      return (
                        <Menu.Item fw={500} key={item.name}>
                          No new order
                        </Menu.Item>
                      );
                  }
                })}
                <Menu.Divider />
                <Menu.Label>Message</Menu.Label>
                {user?.noti.map((item) => {
                  if (item.name === "message") {
                    if (item.number === 1)
                      return (
                        <Menu.Item
                          c={"blue"}
                          fw={500}
                          onClick={() => handleClick(item.name, "chats")}
                          key={item.name}
                        >
                          {item.number} new message
                        </Menu.Item>
                      );
                    else if (item.number > 1)
                      return (
                        <Menu.Item
                          c={"blue"}
                          fw={500}
                          onClick={() => handleClick(item.name, "chats")}
                          key={item.name}
                        >
                          {item.number} new messages
                        </Menu.Item>
                      );
                    else
                      return (
                        <Menu.Item fw={500} key={item.name}>
                          No new message
                        </Menu.Item>
                      );
                  }
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
            leftSection={<IconBrandMantine size={30} />}
            autoContrast={true}
            variant="transparent"
            color="black"
            onClick={() => redirectPage("/")}
            mx={"auto"}
          >
            MobileShop
          </Button>
        </Drawer.Header>
        <Drawer.Body>
          {currentUser ? (
            <Group justify="center">
              <Button
                leftSection={
                  <AspectRatio ratio={1080 / 720} maw={30}>
                    <Image src={currentUser?.img} alt="UserImage" />
                  </AspectRatio>
                }
                autoContrast={true}
                onClick={() => redirectPage("/user")}
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
                autoContrast={true}
                variant="light"
                onClick={logout}
              >
                Logout
              </Button>
            </Group>
          ) : (
            <Group justify="center">
              <Button
                leftSection={<IconUser size={20} />}
                rightSection={
                  <IconChevronRight
                    size="0.8rem"
                    stroke={1.5}
                    className="mantine-rotate-rtl"
                  />
                }
                autoContrast={true}
                variant="light"
                onClick={() => redirectPage("/login")}
              >
                Login
              </Button>
              <Button
                leftSection={<IconRegistered size={20} />}
                rightSection={
                  <IconChevronRight
                    size="0.8rem"
                    stroke={1.5}
                    className="mantine-rotate-rtl"
                  />
                }
                autoContrast={true}
                variant="light"
                onClick={() => redirectPage("/register")}
              >
                Register
              </Button>
            </Group>
          )}
        </Drawer.Body>
      </Drawer>
    </Container>
  );
};
export default NavBar;
