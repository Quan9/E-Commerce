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
} from "@mantine/core";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { IconPlayerTrackNext } from "@tabler/icons-react";
const Home = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getAllPublicProducts()
      .then((res) => {
        console.log(res.data, "res.data");
        setData(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);
  return (
    <Container p={0} m={0}>
      <Categories />
      {data.length !== 0 ? (
        <Grid overflow="hidden" p={10}>
          {data.map((items, index) => (
            <GridCol
              key={index}
              order={items._id === "Phone" ? 1 : items._id === "Laptop" ? 2 : 3}
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
          ))}
        </Grid>
      ) : (
        <Center h={"100%"}>
          <Loader type="dots" size={100} />
        </Center>
      )}
    </Container>
  );
};

export default Home;
