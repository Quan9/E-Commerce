import { useEffect, useState } from "react";
import { getAllPublicProducts } from "../services/product";
import { Categories, FormatPrice } from "../components";
import {
  Center,
  Container,
  Loader,
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
        setData(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);
  return (
    <Container p={0} m={0}>
      <Flex justify="space-around" direction={"row"} mb={"sm"}>
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
      </Flex>
      <TextInput
        w={"50%"}
        ta={"center"}
        mx={"auto"}
        placeholder="enter your order full id"
        label="Check your order"
        onChange={(e) => setContent(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate();
        }}
      />
      <Flex>
        {data.length !== 0 ? (
          <Grid overflow="hidden" p={10}>
            {data.forEach((items) => {
              return (
                <GridCol
                  key={items._id}
                  order={
                    items._id === "Phone" ? 1 : items._id === "Laptop" ? 2 : 3
                  }
                  mt={"sm"}
                >
                  <Group align="flex-end" justify="flex-end">
                    <Title order={2} ta="center" flex={1}>
                      Latest {items._id}
                    </Title>
                    {items.data.length > 4 && (
                      <UnstyledButton component={NavLink} to={`/${items._id}`}>
                        more <IconPlayerTrackNext size={12} />
                      </UnstyledButton>
                    )}
                  </Group>
                  <Grid mt={"sm"}>
                    {items.data.map((product, index) => (
                      <GridCol
                        span={{ lg: 3, md: 4, sm: 6, xs: 12 }}
                        key={product._id + index}
                        maw={{ xs: "50%" }}
                      >
                        <Card display={index === 4 && "none"} align={"center"}>
                          <CardSection>
                            <Image
                              src={product.colors[0].image}
                              alt="Image"
                              h={300}
                            />
                          </CardSection>
                          <CardSection>
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
                            <Button
                              component={NavLink}
                              to={`/${product.categories}/${product._id}`}
                              variant="light"
                            >
                              Detail
                            </Button>
                          </CardSection>
                        </Card>
                      </GridCol>
                    ))}
                  </Grid>
                </GridCol>
              );
            })}
          </Grid>
        ) : (
          <Center h={"100%"}>
            <Loader type="dots" size={100} />
          </Center>
        )}
      </Flex>
    </Container>
  );
};

export default Home;
