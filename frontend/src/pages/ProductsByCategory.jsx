
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getProductByCategory } from "../services/product";
import _ from "lodash";
import {
  Button,
  Card,
  Center,
  Checkbox,
  Grid,
  GridCol,
  Image,
  Loader,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import FormatPrice from "../components/misc/FormatPrice";
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
  const ref1 = useRef(checkFilter);

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
    if (_.isEqual(checkFilter, ref1.current)) {
      return setFilter(data);
    } else {
      let temp = [...data];
      const { price, brand } = checkFilter;
      if (price === "highToLow") {
        temp.sort((a, b) => {
          if (a.discount && b.discount) return a.discount - b.discount;
          else if (a.discount && !b.discount) return a.discount - b.price;
          else if (!a.discount && b.discount) return a.price - b.discount;
          else {
            return a.price - b.price;
          }
        });
      } else if (price === "lowToHigh")
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
    }
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
        params.append("price", e.target.value);
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
    <Paper ms={"lg"} me={"lg"} shadow="lg">
      <Grid>
        <GridCol span={{ base: 2, lg: 1 }}>
          <Stack gap={"xs"} style={{ position: "sticky", top: "5%" }}>
            <Title order={4} ta={"center"}>
              Price
            </Title>
            <Checkbox
              onChange={(e) => {
                handlePrice(e);
              }}
              size="sm"
              name="price"
              value={""}
              label="Default"
              checked={checkFilter.price === ""}
            />
            <Checkbox
              onChange={(e) => {
                handlePrice(e);
              }}
              name="price"
              size="sm"
              value={"lowToHigh"}
              label="high to low"
              checked={checkFilter.price === "lowToHigh"}
            />
            <Checkbox
              onChange={(e) => {
                handlePrice(e);
              }}
              size="sm"
              name="price"
              value={"highToLow"}
              label="low to high"
              checked={checkFilter.price === "highToLow"}
            />
            <Title order={4} ta={"center"}>
              Brand
            </Title>
            <Checkbox
              name="brand"
              value={""}
              onChange={(e) => handleBrand(e)}
              label="All"
              checked={checkFilter.brand.length === 0}
            />
            <Checkbox
              name="brand"
              value={"Samsung"}
              onChange={(e) => handleBrand(e)}
              label="Samsung"
              checked={checkFilter.brand.includes("Samsung")}
            />
            <Checkbox
              name="brand"
              value={"Oppo"}
              onChange={(e) => handleBrand(e)}
              label="Oppo"
              checked={checkFilter.brand.includes("Oppo")}
            />
            <Checkbox
              name="brand"
              value={"Xiaomi"}
              onChange={(e) => handleBrand(e)}
              label="Xiaomi"
              checked={checkFilter.brand.includes("Xiaomi")}
            />
            <Checkbox
              name="brand"
              value={"Apple"}
              onChange={(e) => handleBrand(e)}
              label="iPhone (Apple)"
              checked={checkFilter.brand.includes("Apple")}
            />
            <Checkbox
              name="brand"
              value={"Lenovo"}
              onChange={(e) => handleBrand(e)}
              label="Lenovo"
              checked={checkFilter.brand.includes("Lenovo")}
            />
          </Stack>
        </GridCol>
        {filter ? (
          <GridCol span={{ base: 10, lg: 11 }}>
            {filter.length === 0 ? (
              <Center h={"90vh"}>
                <Title order={4}>No items match requirements</Title>
              </Center>
            ) : (
              <Grid w={"100%"}>
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
          </GridCol>
        ) : (
          <Center h={"90vh"} w={"100%"}>
            <Loader size={"100"} />
          </Center>
        )}
      </Grid>
    </Paper>
  );
};

export default ProductsByCategory;
