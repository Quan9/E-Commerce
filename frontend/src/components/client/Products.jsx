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
  Title,
  UnstyledButton,
} from "@mantine/core";
import FormatPrice from "../misc/FormatPrice";
import { IconPlayerTrackNext } from "@tabler/icons-react";
const Products = ({ content }) => {
  const nav = useNavigate();
  return (
    <Grid>
      {content.map((items, index) => {
        return (
          <GridCol
            key={index}
            span={12}
            order={items._id === "Phone" ? 1 : items._id === "Laptop" ? 2 : 3}
          >
            <Flex align="flex-end" justify="flex-end">
              <Title order={2} ta="center" flex={1}>
                Latest {items._id}
              </Title>
              {items.data.length > 4 && (
                <UnstyledButton onClick={() => nav(`/${items._id}`)}>
                  more <IconPlayerTrackNext size={12} />
                </UnstyledButton>
              )}
            </Flex>
            <Grid mt={"md"}>
              {items.data.map((product, index) => (
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
                    display={index === 4 && "none"}
                  >
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
              ))}
            </Grid>
          </GridCol>
        );
      })}
    </Grid>
  );
};

export default Products;
