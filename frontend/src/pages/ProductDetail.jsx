import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createProductReview, getProduct } from "../services/product";
import { useDispatch } from "react-redux";
import { addItem } from "../slices/CartSlice";
import parse from "html-react-parser";
import { ReactImageTurntable } from "react-image-turntable";
import _ from "lodash";
import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Paper,
  Rating,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useForm } from "@mantine/form";
import { CheckInfo, FormatPrice } from "../components";

import { motion } from "framer-motion";
import { toast } from "react-toastify";
const ProductDetail = (props) => {
  // eslint-disable-next-line react/prop-types
  const { user } = props;
  const location = useLocation().pathname.split("/")[2];
  const [data, setData] = useState();
  const [cart, setCart] = useState();
  const [color, setColor] = useState();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [similarProduct, setSimilarProduct] = useState();
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const ref = useRef();
  const [display, setDisplay] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const form = useForm({
    initialValues: {
      comment: "",
      rating: 0,
      user: user,
    },
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const checkRef = () => {
      if (!ref.current) return;
      const isoverFlow = ref.current.clientHeight < ref.current.scrollHeight;
      if (isoverFlow) setOverflow(true);
    };
    checkRef();
  });
  useEffect(() => {
    const getData = async () => {
      await getProduct(location).then((res) => {
        setData(res.data.product);
        const { colors } = res.data.product;
        const colorsFilled = colors.filter((color) => color.inStock !== 0);
        setColor(colorsFilled[0]);
        setCart(res.data.product);
        setSimilarProduct(res.data.similarProduct);
        setOpen(false);
      });
    };
    getData();
  }, [location]);
  useEffect(() => {
    const getDispatch = () => {
      if (typeof cart.colors === "string") {
        dispatch(addItem(cart));
        toast.success("Item added to cart", { position: "top-right" });
      }
    };
    cart?.colors && getDispatch();
  }, [cart]);

  const handleCart = (color) => {
    setCart((prev) => ({
      ...prev,
      colors: color.color,
      colorId: color._id,
      image: color.image,
      inStock: color.inStock,
    }));
  };
  const handleSubmitReview = (values) => {
    if (values.rating === 0) {
      form.setFieldError("rating", "At least 0.5 star");
    }
    if (values.comment.length < 2) {
      form.setFieldError("comment", "Must have at least 2 letters");
    }
    if (_.isEmpty(form.errors)) {
      setLoading(true);
      createProductReview(location, form.values)
        .then((res) => {
          setLoading(false);
          form.reset();
          setData((prev) => ({
            ...prev,
            ["numReviews"]: res.data.data.numReviews,
            ["rating"]: res.data.data.rating,
            ["reviews"]: res.data.data.reviews,
          }));
          toast.success(res.data.message, { position: "top-right" });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response.data, { position: "top-right" });
        });
    }
  };
  const handleReview = (values) => {
    values.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return (
      <>
        {values.map((review, index) => (
          <Card key={review + index} bg={"rgba(195, 195, 195, 0.2)"} w={"100%"}>
            <Title order={5}>{review.name}</Title>
            <Text span inline>
              {review.comment} <Rating value={review.rating} readOnly />
            </Text>
          </Card>
        ))}
      </>
    );
  };
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ease: "easeInOut", duration: 1 }}
      >
        {data && (
          <>
            <Grid mb={"sm"}>
              <GridCol
                span={{ base: 12, lg: 6 }}
                display={data.productImage.length === 0 && "none"}
              >
                <Flex display={!display && "none"}>
                  <Carousel flex={1} loop height={300}>
                    {data.productImage.map((product, index) => {
                      return (
                        <Carousel.Slide key={index}>
                          <Image src={product} alt={product} h={300} />
                        </Carousel.Slide>
                      );
                    })}
                  </Carousel>
                </Flex>
                {data.image360 !== undefined && (
                  <Paper display={display && "none"}>
                    <ReactImageTurntable
                      className="image360"
                      images={data.image360.sort(
                        (a, b) =>
                          b.substring(b.lastIndexOf("-"), b.lastIndexOf(".")) -
                          a.substring(a.lastIndexOf("-"), a.lastIndexOf("."))
                      )}
                      autoRotate={{ disabled: !autoplay, interval: 150 }}
                    />
                  </Paper>
                )}
                <Stack>
                  {!_.isEmpty(data.image360) && (
                    <Center>
                      <Button
                        variant={display ? "light" : "default"}
                        onClick={() => setDisplay(true)}
                      >
                        Images
                      </Button>
                      <Button
                        onClick={() => setDisplay(false)}
                        variant={display ? "default" : "light"}
                      >
                        360 &deg;
                      </Button>
                    </Center>
                  )}
                  <Button
                    onClick={() => {
                      setAutoplay(!autoplay);
                    }}
                    display={display && "none"}
                    leftSection="Autoplay: "
                    fullWidth
                  >
                    {!autoplay ? "off" : "on"}
                  </Button>
                </Stack>
              </GridCol>
              <GridCol
                span={data.productImage.length === 0 ? 12 : { base: 12, lg: 6 }}
              >
                <Stack ta={"center"}>
                  <Title order={1} fw={750}>
                    {data.name}
                  </Title>
                  <Flex
                    gap={"sm"}
                    align={data.productImage.length === 0 && "center"}
                    justify={data.productImage.length === 0 && "center"}
                  >
                    <Text fw={600}>Price:</Text>
                    <FormatPrice price={data.price} discount={data.discount} />
                  </Flex>
                  <Group justify={data.productImage.length === 0 && "center"}>
                    {data.colors.map((item, index) => {
                      return (
                        <Flex
                          direction={"column"}
                          key={item._id + index}
                          onClick={() => {
                            setColor(item);
                            if (item.inStock !== 0) {
                              setDisabled(false);
                            } else {
                              setDisabled(true);
                            }
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.cursor = "pointer")
                          }
                          mah={"100%"}
                          align={"center"}
                          justify={"center"}
                        >
                          <Image src={item.image} h={"100px"} />
                          <Button
                            variant="default"
                            bg={color._id === item._id ? "blue" : ""}
                            mt={"auto"}
                          >
                            {item.color}
                          </Button>
                        </Flex>
                      );
                    })}
                  </Group>
                  {disabled ? (
                    <Text>Out of Stock</Text>
                  ) : (
                    <Button
                      variant="subtle"
                      onClick={() => handleCart(color)}
                      m={data.productImage.length === 0 && "auto"}
                    >
                      Add to cart
                    </Button>
                  )}
                </Stack>
              </GridCol>
            </Grid>
            <Grid mb={"sm"}>
              <GridCol span={{ base: 12, lg: 8 }} className="description">
                {data?.desc ? (
                  <>
                    <Paper
                      ref={ref}
                      style={
                        !open
                          ? {
                              height: "350px",
                              overflowY: "hidden",
                              textOverflow: "ellipsis",
                              overflowX: "hidden",
                            }
                          : {}
                      }
                    >
                      <Title order={2} ta={"center"}>
                        Description
                      </Title>
                      {parse(`${data.desc}`)}
                    </Paper>
                    {overflow && (
                      <Button
                        onClick={() => setOpen(!open)}
                        fullWidth
                        variant="default"
                      >
                        {!open ? "Show more" : "Show less"}
                      </Button>
                    )}
                  </>
                ) : (
                  <>NO DESCRIPTION</>
                )}
              </GridCol>
              <GridCol span={{ base: 12, lg: 4 }}>
                {data?.systeminfo && (
                  <CheckInfo info={data?.systeminfo} withModal={true} />
                )}
              </GridCol>
            </Grid>
            <Grid>
              <Card bg={"rgba(195, 195, 195, 0.3)"} w={"100%"} ta={"center"}>
                <form
                  onSubmit={form.onSubmit((values) =>
                    handleSubmitReview(values)
                  )}
                >
                  <Grid align="flex-end">
                    <GridCol span={3} ta={"center"}>
                      Rating
                      <Rating
                        m={"auto"}
                        mt={"sm"}
                        fractions={2}
                        value={form.rating}
                        {...form.getInputProps("rating")}
                        style={
                          form.errors.rating && {
                            border: "1px solid red",
                            borderRadius: "10px",
                          }
                        }
                      />
                      {form.errors.rating && (
                        <Text
                          mt={"sm"}
                          ta={"center"}
                          fw={400}
                          inline
                          size="12"
                          c={"red"}
                          mah={"20%"}
                        >
                          {form.errors.rating}
                        </Text>
                      )}
                    </GridCol>
                    <GridCol span={6} ta={"center"}>
                      Comment
                      <TextInput
                        placeholder="Review Product"
                        m={"auto"}
                        {...form.getInputProps("comment")}
                      />
                    </GridCol>
                    <GridCol span={3}>
                      <Button
                        type="submit"
                        mt={"sm"}
                        disabled={loading}
                        loading={loading}
                      >
                        Submit
                      </Button>
                    </GridCol>
                  </Grid>
                </form>
              </Card>
              <GridCol>
                <Group justify="space-around">
                  <Tooltip label={data.rating}>
                    <Rating value={data.rating} fractions={5} readOnly />
                  </Tooltip>
                  <Text span>Reviews ({data.numReviews})</Text>
                </Group>
                {data.reviews && handleReview(data.reviews)}
              </GridCol>
              <GridCol>
                <Title order={4} ta={"center"}>
                  Similar Product
                </Title>
                <Carousel
                  withIndicators
                  slideSize={{ base: "100%", sm: "50%", md: "33.333333%" }}
                  slideGap={{ base: 0, sm: "md" }}
                  align="start"
                >
                  {similarProduct.map((items, i) => {
                    return (
                      <Carousel.Slide key={items._id + i}>
                        <Link
                          to={`/${items.categories}/${items._id}`}
                          className="text-decoration-none"
                        >
                          <Image
                            src={items.colors[0].image}
                            width={"90%"}
                            h={200}
                            className="img-fluid"
                          />
                          <span className="text-break text-dark">
                            {items.name}
                          </span>
                        </Link>
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>
              </GridCol>
            </Grid>
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default ProductDetail;
