import { useEffect, useState } from "react";
import { getAllPublicProducts } from "../services/product";
import { FormatPrice } from "../components";
import {
  Container,
  Button,
  Card,
  CardSection,
  Grid,
  GridCol,
  Group,
  Image,
  Title,
  UnstyledButton,
  Flex,
  TextInput,
  Stack,
  Box,
} from "@mantine/core";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import {
  IconDeviceIpad,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconPlayerTrackNext,
} from "@tabler/icons-react";
const Home = () => {
  const [data, setData] = useState([]);
  const [content, setContent] = useState();
  const nav = useNavigate();
  const navigate = () => {
    return nav("/order", { state: { data: content } });
  };
  useEffect(() => {
    getAllPublicProducts()
      .then((res) => {
        const products = res.data.map((item) => {
          const { _id, data } = item;
          return data;
        });
        setData(products);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);
  return (
    <Container>
      <Group justify="center" mb={"sm"} mt={"sm"}>
        <Button
          component={NavLink}
          to={"/Phone"}
          leftSection={<IconDeviceMobile size={26} />}
          variant="default"
        >
          Phone
        </Button>
        <Button
          component={NavLink}
          to={"/Tablet"}
          leftSection={<IconDeviceIpad size={26} />}
          variant="default"
        >
          Tablet
        </Button>
        <Button
          component={NavLink}
          to={"/Laptop"}
          leftSection={<IconDeviceLaptop size={26} />}
          variant="default"
        >
          Laptop
        </Button>
      </Group>
      <Group justify="center">
        <TextInput
          ta={"center"}
          mx={"auto"}
          placeholder="enter your phone number"
          label="Check your order"
          onChange={(e) => setContent(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (content.length === 0) {
                return;
              }
              navigate();
            }
          }}
        />
      </Group>
      <Flex className="flexHome" direction={"column"}>
        {data &&
          data.map((items, index) => (
            <Box key={index} className={items[0].categories} mt={"sm"}>
              <Stack>
                <Group justify="center">
                  <Title order={2}>Latest {items[0].categories}</Title>
                  {items.length > 4 && (
                    <UnstyledButton
                      component={NavLink}
                      to={`/${items[0].categories}`}
                    >
                      more <IconPlayerTrackNext size={12} />
                    </UnstyledButton>
                  )}
                </Group>
                <Grid>
                  {items.map((product, index) => (
                    <GridCol
                      key={product._id}
                      span={{ lg: 3, md: 4, xs: 12, sm: 6 }}
                    >
                      <Card
                        display={index >= 4 && "none"}
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        className="home"
                        h={{ md: 300, lg: 400, sm: 350 }}
                      >
                        <CardSection
                          component={NavLink}
                          to={`/${product.categories}/${product._id}`}
                        >
                          <Image
                            src={product.colors[0].image}
                            alt="Image"
                            h={{ md: 150, lg: 250, sm: 200 }}
                            fit="contain"
                          />
                        </CardSection>
                        <CardSection ta={"center"}>
                          <Title order={4} fw={700}>
                            {product.name}
                          </Title>
                          {product?.discount ? (
                            <FormatPrice
                              price={product.price}
                              discount={product.discount}
                            />
                          ) : (
                            <FormatPrice price={product.price} />
                          )}
                        </CardSection>
                        <Group justify="center" mt={"auto"}>
                          <Button
                            component={NavLink}
                            to={`/${product.categories}/${product._id}`}
                            variant="light"
                          >
                            Detail
                          </Button>
                        </Group>
                      </Card>
                    </GridCol>
                  ))}
                </Grid>
              </Stack>
            </Box>
          ))}
      </Flex>
    </Container>
  );
};

export default Home;
