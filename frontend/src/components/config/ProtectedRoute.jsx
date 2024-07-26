/* eslint-disable react/prop-types */
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Container, Flex, Group, Title } from "@mantine/core";
import { useSelector } from "react-redux";
const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.user);
  const nav = useNavigate();
  return (
    <Container m={0} maw={"100%"} mah={"93dvh"}>
      <Box mb={"lg"}>
        <Group justify="center">
          <Title
            order={3}
            align="center"
            component={NavLink}
            to="/user"
            td={"none"}
          >
            Dashboard
          </Title>
        </Group>
        {user.role !== "user" && (
          <Group justify="center">
            {user.role !== "user" ? (
              <>
                <Button
                  component={NavLink}
                  to={"/user/totalUsers"}
                  variant="default"
                  autoContrast
                >
                  Users
                </Button>
                <Button
                  component={NavLink}
                  to={"/user/products"}
                  variant="default"
                  autoContrast
                  onClick={() => nav("/user/products")}
                >
                  Products
                </Button>
                <Button
                  component={NavLink}
                  to={"/user/chats"}
                  variant="default"
                  autoContrast
                >
                  Chats
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                autoContrast
                onClick={() => nav(`/user/${user._id}`)}
              >
                Edit Profile
              </Button>
            )}
            <Button
              onClick={() => nav(`/user/order`)}
              variant="default"
              autoContrast
            >
              Order
            </Button>
          </Group>
        )}
        <Outlet />
      </Box>
    </Container>
  );
};

export default ProtectedRoute;
