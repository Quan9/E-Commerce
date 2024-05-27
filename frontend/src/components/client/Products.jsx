/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardSection,
  Flex,
  Grid,
  GridCol,
  Image,
  Text,
  Title,
} from "@mantine/core";
import FormatPrice from "../misc/FormatPrice";
const Products = ({ content }) => {
  const nav = useNavigate();
  return (
    <Grid>
      {content.map((items, index) => {
        return (
          <GridCol key={index} span={12} order={items._id === "Phone" ? 1 : 2}>
            <Flex align="center" direction="row" justify="center">
              <Text
                span
                ta={"center"}
                fw={750}
                size="xl"
                style={{ flexGrow: 1 }}
              >
                Latest {items._id}
              </Text>
              {items.data.length > 4 && (
                <Text
                  onClick={() => nav(`/${items._id}`)}
                  onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
                  fw={500}
                >
                  more
                </Text>
              )}
            </Flex>
            <Grid mt={"md"}>
              {items.data.map((product, index) => {
                return (
                  <GridCol
                    key={product._id + index}
                    span={{ lg: 3, md: 4, sm: 6, xs: 12 }}
                    align={"center"}
                  >
                    <Card
                      h={"100%"}
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                    >
                      <CardSection>
                        <Image
                          src={product.colors[0].image}
                          alt="Image"
                          h={{ base: 250, lg: 250 }}
                          style={{}}
                          w={{
                            base: "fit-content",
                            md: "fit-content",
                            lg: "100%",
                          }}
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
                          onClick={() =>
                            nav(`/${product.categories}/${product._id}`)
                          }
                          variant="light"
                        >
                          Detail
                        </Button>
                      </CardSection>
                    </Card>
                  </GridCol>
                );
              })}
            </Grid>
          </GridCol>
        );
      })}
    </Grid>
  );
};

export default Products;
