/* eslint-disable react/prop-types */
import { Outlet, useNavigate } from "react-router-dom";
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
} from "@mantine/core";
import { useSelector } from "react-redux";
import Error404 from "../../pages/Error404";
const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.user);
  const nav = useNavigate();
  return (
    <Container m={0} maw={"98vw"}>
      {user ? (
        <Grid gutter={{ md: "md" }}>
          <GridCol
            visibleFrom="md"
            span={"content"}
            style={{ border: "1px solid blue", borderRadius: 15 }}
            h={250}
          >
            <Title
              order={3}
              onClick={() => nav("/user")}
              onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
              align="center"
            >
              Dashboard
            </Title>
            <Space h={"md"} />
            <Stack gap={"sm"}>
              {user.role !== "user" ? (
                <>
                  <Button
                    variant="default"
                    onClick={() => nav("/user/totalUsers")}
                    c={"blue"}
                    fullWidth
                  >
                    Users
                  </Button>
                  <Button
                    to="/profile/products"
                    variant="default"
                    onClick={() => nav("/user/products")}
                    fullWidth
                    c={"blue"}
                  >
                    Products
                  </Button>
                  <Button
                    onClick={() => nav(`/user/chats`)}
                    variant="default"
                    fullWidth
                    c={"blue"}
                  >
                    Chats
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  onClick={() => nav(`/user/${user._id}`)}
                  fullWidth
                  c={"blue"}
                >
                  Edit Profile
                </Button>
              )}
              <Button
                onClick={() => nav(`/user/orders`)}
                variant="default"
                c={"blue"}
              >
                Orders
              </Button>
            </Stack>
          </GridCol>
          <GridCol span={"auto"}>
            <Paper hiddenFrom="md" mb={"lg"}>
              <Group gap={"sm"} justify="center">
                {user.role !== "user" ? (
                  <>
                    <Button
                      variant="default"
                      to="/profile/users"
                      onClick={() => nav("/user/totalUsers")}
                      c={"blue"}
                    >
                      Users
                    </Button>
                    <Button
                      to="/profile/products"
                      variant="default"
                      onClick={() => nav("/user/products")}
                      c={"blue"}
                    >
                      Products
                    </Button>
                    <Button
                      onClick={() => nav(`/user/chats`)}
                      variant="default"
                      c={"blue"}
                    >
                      Chats
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => nav(`/user/${user._id}`)}
                    c={"blue"}
                  >
                    Edit Profile
                  </Button>
                )}
                <Button
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
