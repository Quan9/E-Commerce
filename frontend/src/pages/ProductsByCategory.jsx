import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getProductByCategory } from "../services/product";
import {
  Button,
  Card,
  Center,
  Checkbox,
  Grid,
  GridCol,
  Group,
  Image,
  Loader,
  Stack,
  Title,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  FormatPrice,
  dataFilterBrandPhone,
  dataFilterPrice,
} from "../components";

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
      if (brand.length !== 0) {
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
  const handlePrice = (e) => {
    if (e.target.checked) {
      if (e.target.value === "") {
        setSearchParams((params) => {
          params.delete("price");
          return params;
        });
        return setCheckFilter((prev) => ({ ...prev, [e.target.name]: "" }));
      }
      setSearchParams((params) => {
        params.set("price", e.target.value);
        return params;
      });
      setCheckFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      if (e.target.value !== "") {
        setSearchParams((params) => {
          params.delete("price");
          return params;
        });
        return setCheckFilter((prev) => ({ ...prev, [e.target.name]: "" }));
      }
    }
  };
  const handleBrand = (e) => {
    let temp = checkFilter.brand;
    if (e.target.checked) {
      if (e.target.value === "") {
        setSearchParams((params) => {
          params.delete("brand");
          return params;
        });
        return setCheckFilter((prev) => ({ ...prev, [e.target.name]: [] }));
      }
      temp = [...temp, e.target.value];
      setSearchParams((params) => {
        params.set("brand", temp);
        return params;
      });
      setCheckFilter((prev) => ({ ...prev, [e.target.name]: temp }));
    } else {
      temp = temp.filter((item) => item !== e.target.value);
      if (temp.length === 0) {
        setSearchParams((params) => {
          params.delete("brand");
          return params;
        });
      } else {
        setSearchParams((params) => {
          params.set("brand", temp);
          return params;
        });
      }
      setCheckFilter((prev) => ({ ...prev, [e.target.name]: temp }));
    }
  };
  return (
    <Grid m={"lg"} p={"lg"}>
      <GridCol span={"2"}>
        <Stack>
          <Title order={4} ta={"center"}>
            Price
          </Title>
          <Group justify="space-between">
            {dataFilterPrice.map((item, index) => (
              <Checkbox
                key={item + index}
                name="price"
                onChange={(e) => {
                  handlePrice(e);
                }}
                value={item.value}
                checked={checkFilter.price === item.value}
                label={item.label}
              />
            ))}
          </Group>
          <Title order={4} ta={"center"}>
            Brand
          </Title>
          <Group justify="space-between">
            {dataFilterBrandPhone.map((item, index) => {
              if (item.value === "") {
                return (
                  <Checkbox
                    key={index}
                    name="brand"
                    value={item.value}
                    onChange={(e) => handleBrand(e)}
                    label={item.label}
                    checked={checkFilter.brand.length === 0}
                  />
                );
              }
              return (
                <Checkbox
                  key={index}
                  name="brand"
                  value={item.value}
                  onChange={(e) => handleBrand(e)}
                  label={item.label}
                  checked={checkFilter.brand.includes(item.value)}
                />
              );
            })}
          </Group>
        </Stack>
      </GridCol>
      <GridCol span={"10"}>
        {filter ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              ease: "circInOut",
              duration: 1,
            }}
          >
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
                      <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                          <Image
                            src={product.colors[0].image}
                            alt="Image"
                            h={300}
                          />
                        </Card.Section>
                        <Card.Section
                          style={{ wordBreak: "break-all" }}
                          bg={"rgba(195, 195, 195, 0.4)"}
                        >
                          <Title order={5} ta={"center"}>
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
                          <Center>
                            <Button
                              onClick={() =>
                                nav(`/${product.categories}/${product._id}`)
                              }
                            >
                              Detail
                            </Button>
                          </Center>
                        </Card.Section>
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
          </motion.div>
        ) : (
          <Center h={"90vh"} w={"100%"}>
            <Loader size={"100"} />
          </Center>
        )}
      </GridCol>
    </Grid>
  );
};

export default ProductsByCategory;
