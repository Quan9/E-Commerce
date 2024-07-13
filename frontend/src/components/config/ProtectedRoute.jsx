/* eslint-disable react/prop-types */
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  GridCol,
  Group,
  Paper,
  Space,
  Stack,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useSelector } from "react-redux";
import Error404 from "../../pages/Error404";
const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.user);
  const nav = useNavigate();
  return (
    <Container m={0} maw={"100%"}>
      {user ? (
        <Grid>
          <GridCol visibleFrom="md" span={1}>
            <UnstyledButton component={NavLink} to={"/user"} ta={"center"}>
              <Title order={5}>Dashboard</Title>
            </UnstyledButton>
            <Space h={"md"} />
            <Stack gap={"sm"}>
              {user.role !== "user" ? (
                <>
                  <Button
                    size="compact-sm"
                    component={NavLink}
                    to={"/user/totalUsers"}
                    variant="default"
                    c={"blue"}
                    fullWidth
                  >
                    Users
                  </Button>
                  <Button
                    size="compact-sm"
                    component={NavLink}
                    to={"/user/products"}
                    variant="default"
                    fullWidth
                    c={"blue"}
                  >
                    Products
                  </Button>
                  <Button
                    size="compact-sm"
                    component={NavLink}
                    to={"/user/chats"}
                    variant="default"
                    fullWidth
                    c={"blue"}
                  >
                    Chats
                  </Button>
                </>
              ) : (
                <Button
                  size="compact-sm"
                  component={NavLink}
                  to={`/user/totalUsers/${user._id}`}
                  variant="default"
                  fullWidth
                  c={"blue"}
                >
                  Edit Profile
                </Button>
              )}
              <Button
                size="compact-sm"
                component={NavLink}
                to={`/user/orders`}
                variant="default"
                c={"blue"}
              >
                Orders
              </Button>
            </Stack>
          </GridCol>
          <GridCol span={{ md: 11 }}>
            <Paper hiddenFrom="md" mb={"lg"}>
              <Title
                order={3}
                onClick={() => nav("/user")}
                onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
                align="center"
              >
                Dashboard
              </Title>
              <Group justify="center">
                {user.role !== "user" ? (
                  <>
                    <Button
                      size="compact-sm"
                      component={NavLink}
                      to={"/user/totalUsers"}
                      variant="default"
                      c={"blue"}
                    >
                      Users
                    </Button>
                    <Button
                      size="compact-sm"
                      component={NavLink}
                      to={"/user/products"}
                      variant="default"
                      onClick={() => nav("/user/products")}
                      c={"blue"}
                    >
                      Products
                    </Button>
                    <Button
                      size="compact-sm"
                      component={NavLink}
                      to={"/user/chats"}
                      variant="default"
                      c={"blue"}
                    >
                      Chats
                    </Button>
                  </>
                ) : (
                  <Button
                    size="compact-sm"
                    variant="default"
                    onClick={() => nav(`/user/${user._id}`)}
                    c={"blue"}
                  >
                    Edit Profile
                  </Button>
                )}
                <Button
                  size="compact-sm"
                  onClick={() => nav(`/user/orders`)}
                  variant="default"
                  c={"blue"}
                >
                  Order
                </Button>
              </Group>
            </Paper>
            <Outlet />
          </GridCol>
        </Grid>
      ) : (
        <Error404 />
      )}
    </Container>
  );
};

export default ProtectedRoute;
