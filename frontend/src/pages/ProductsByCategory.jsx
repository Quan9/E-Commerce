import { useEffect, useState } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { getProductByCategory } from "../services/product";
import {
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Loader,
  MultiSelect,
  Select,
  Stack,
  Title,
  getBreakpointValue,
  useMantineCssVariablesResolver,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  FormatPrice,
  dataFilterBrandPhone,
  dataFilterPrice,
} from "../components";
import { useMediaQuery } from "@mantine/hooks";
import _ from "lodash";

const ProductsByCategory = () => {
  const category = useLocation().pathname.split("/")[1];
  const [data, setData] = useState();
  const [filter, setFilter] = useState();
  const [open, setOpen] = useState(8);
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkFilter, setCheckFilter] = useState({
    price: "",
    brand: [],
    function: "",
  });
  const windowSize = useMediaQuery(`(max-width: 75em`);

  useEffect(() => {
    getProductByCategory(category).then((res) => {
      setData(res.data);
      setFilter(res.data);
      if (searchParams.size !== 0) {
        const brand = searchParams.get("brand").split(",");
        const price = searchParams.get("price");
        const function1 = searchParams.get("function");
        setCheckFilter(() => ({
          ["brand"]: brand,
          ["price"]: price,
          ["function"]: function1,
        }));
      }
    });
  }, []);

  useEffect(() => {
    const handleFilter = () => {
      let temp = [...data];
      const { price, brand } = checkFilter;
      if (price === "lowToHigh") {
        temp.sort((a, b) => {
          if (a.discount && b.discount) return a.discount - b.discount;
          else if (a.discount && !b.discount) return a.discount - b.price;
          else if (!a.discount && b.discount) return a.price - b.discount;
          else {
            return a.price - b.price;
          }
        });
      } else if (price === "highToLow")
        temp.sort((a, b) => {
          if (a.discount && b.discount) return b.discount - a.discount;
          else if (a.discount && !b.discount) return b.price - a.discount;
          else if (!a.discount && b.discount) return b.discount - a.price;
          else {
            return b.price - a.price;
          }
        });
      if (brand.length !== 0 && brand[0] !== "") {
        const array = temp.filter((items) => {
          return brand.includes(items?.systeminfo?.productInfo?.brand);
        });
        temp = [...array];
      }
      setFilter([...temp]);
      setOpen(8);
    };

    data && handleFilter();
  }, [checkFilter]);

  useEffect(() => {
    const a = () => {
      const brand = searchParams.get("brand");
      if (windowSize && brand === null) {
        return setCheckFilter((prev) => ({
          ...prev,
          ["brand"]: [""],
        }));
      } else if (!windowSize && brand === null) {
        return setCheckFilter((prev) => ({
          ...prev,
          ["brand"]: [],
        }));
      }
    };
    a();
  }, [windowSize]);

  const handlePriceSelect = (e) => {
    if (_.isEmpty(e)) {
      setSearchParams((params) => {
        params.delete("price");
        return params;
      });
      return setCheckFilter((prev) => ({ ...prev, ["price"]: "" }));
    } else {
      setSearchParams((params) => {
        params.set("price", e);
        return params;
      });
      setCheckFilter((prev) => ({ ...prev, ["price"]: e }));
    }
  };

  const handleBrandSelect = (e) => {
    if (e.length === 0) {
      setSearchParams((params) => {
        params.delete("brand");
        return params;
      });
      return setCheckFilter((prev) => ({ ...prev, ["brand"]: [] }));
    } else {
      setSearchParams((params) => {
        params.set("brand", e);
        return params;
      });
      setCheckFilter((prev) => ({ ...prev, ["brand"]: e }));
    }
  };
  return (
    <Container pt={"lg"}>
      {filter ? (
        <Stack>
          <Group justify="center">
            <Select
              data={dataFilterPrice}
              value={checkFilter?.price}
              onChange={handlePriceSelect}
              label="Price"
              ta={"center"}
              placeholder={!checkFilter?.price && "Default"}
              size={"md"}
              clearable
            />
            <MultiSelect
              data={dataFilterBrandPhone}
              value={checkFilter?.brand}
              onChange={handleBrandSelect}
              clearable
              label="Brand"
              ta={"center"}
              maxDropdownHeight={200}
              placeholder={checkFilter?.brand.length === 0 && "All"}
              w={200}
              maw={200}
              size={"md"}
            />
          </Group>
          {filter.length === 0 ? (
            <Center h={"90vh"}>
              <Title order={4}>No items match requirements</Title>
            </Center>
          ) : (
            <Grid>
              {filter.map((product, index) => {
                return (
                  <GridCol
                    span={
                      filter.length >= 4
                        ? { base: 12, sm: 6, md: 4, lg: 3 }
                        : { base: 12, sm: 4 }
                    }
                    key={product._id}
                    hidden={index > open - 1}
                  >
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      h={{ md: 300, lg: 400, sm: 350 }}
                      bg={"rgba(195, 195, 195, 0.4)"}
                      className="home"
                    >
                      <Card.Section
                        component={NavLink}
                        to={`/${product.categories}/${product._id}`}
                      >
                        <Image
                          src={product.colors[0].image}
                          alt="Image"
                          h={{ md: 150, lg: 250, sm: 200 }}
                          fit="contain"
                        />
                      </Card.Section>
                      <Card.Section mt={"auto"} ta={'center'}>
                        <Title order={5} >
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
                      </Card.Section>
                        <Group justify="center" mt={'auto'}>
                          <Button component={NavLink} to={`${product._id}`}>
                            Detail
                          </Button>
                        </Group>
                    </Card>
                  </GridCol>
                );
              })}
              <Center w={"100%"}>
                {filter.length > open && (
                  <Button color="black" onClick={() => setOpen(open + 8)}>
                    Show more
                  </Button>
                )}
              </Center>
            </Grid>
          )}
        </Stack>
      ) : (
        <Center w={"100%"}>
          <Loader size={"100"} />
        </Center>
      )}
    </Container>
  );
};

export default ProductsByCategory;
