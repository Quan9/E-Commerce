import { useEffect, useRef, useState } from "react";
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

const ProductsByCategory = () => {
  const category = useLocation().pathname.split("/")[1];
  const [data, setData] = useState();
  const [filter, setFilter] = useState();
  const [open, setOpen] = useState(8);
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const refWidth = useRef();
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

  const handlePriceSelect = (e) => {
    if (e === null) {
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
      return setCheckFilter((prev) => ({ ...prev, ["brand"]: [""] }));
    } else if (e.includes("")) {
      const data = e.filter((item) => item !== "");
      setSearchParams((params) => {
        params.set("brand", data);
        return params;
      });
      return setCheckFilter((prev) => ({ ...prev, ["brand"]: data }));
    } else {
      setSearchParams((params) => {
        params.set("brand", e);
        return params;
      });
      setCheckFilter((prev) => ({ ...prev, ["brand"]: e }));
    }
  };
  return (
    <Grid m={"lg"} p={"lg"} ref={refWidth}>
      <GridCol
        span={"2"}
        style={{ borderStyle: "hidden outset hidden hidden " }}
        visibleFrom="lg"
      >
        <Stack>
          <Title order={4} ta={"center"}>
            Price
          </Title>
          <Grid>
            {dataFilterPrice.map((item, index) => (
              <GridCol span={{ base: 12, lg: 6 }} key={item.value + index}>
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
              </GridCol>
            ))}
          </Grid>
          <Title order={4} ta={"center"}>
            Brand
          </Title>
          <Grid>
            {dataFilterBrandPhone.map((item, index) => {
              if (item.value === "") {
                return (
                  <GridCol span={{ base: 12, lg: 6 }} key={item + index}>
                    <Checkbox
                      key={index}
                      name="brand"
                      value={item.value}
                      onChange={(e) => handleBrand(e)}
                      label={item.label}
                      checked={checkFilter.brand.length === 0}
                    />
                  </GridCol>
                );
              }
              return (
                <GridCol span={{ base: 12, lg: 6 }} key={item + index}>
                  <Checkbox
                    key={index}
                    name="brand"
                    value={item.value}
                    onChange={(e) => handleBrand(e)}
                    label={item.label}
                    checked={checkFilter.brand.includes(item.value)}
                  />
                </GridCol>
              );
            })}
          </Grid>
        </Stack>
      </GridCol>

      <GridCol span={{ base: 12, lg: 10 }}>
        <Group hiddenFrom="lg" wrap="nowrap" mb={"sm"} justify="center">
          <Select
            data={dataFilterPrice}
            value={checkFilter?.price}
            onChange={handlePriceSelect}
            label="Price"
            ta={"center"}
          />
          <MultiSelect
            data={dataFilterBrandPhone}
            value={checkFilter?.brand}
            onChange={handleBrandSelect}
            clearable
            label="Brand"
            ta={"center"}
            maxDropdownHeight={200}
          />
        </Group>
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
          <Center w={"100%"}>
            <Loader size={"100"} />
          </Center>
        )}
      </GridCol>
    </Grid>
  );
};

export default ProductsByCategory;
