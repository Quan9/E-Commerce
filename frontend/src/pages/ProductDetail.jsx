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
  CardSection,
  Center,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Loader,
  Pagination,
  Paper,
  Rating,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useForm } from "@mantine/form";
import { CheckInfo, FormatPrice } from "../components";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconArrowLeft,
  IconArrowRight,
  IconGripHorizontal,
} from "@tabler/icons-react";
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
  const [display, setDisplay] = useState("image");
  const [autoplay, setAutoplay] = useState(false);
  const [activePage, setPage] = useState(1);
  const ref = useRef();
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
        toast.success("Item added to cart", {
          position: "top-right",
          closeOnClick: true,
        });
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
      return form.setFieldError("comment", "Must have at least 2 letters");
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
          toast.success(res.data.message, {
            position: "top-right",
            closeOnClick: true,
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response.data, {
            position: "top-right",
            closeOnClick: true,
          });
        });
    }
  };
  const handleDisplay = (value) => {
    const currentPage = 5 * activePage;

    if (value >= (activePage - 1) * 5 && value < currentPage) {
      return true;
    }
    return false;
  };
  const handleReview = (values) => {
    values.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return (
      <CardSection>
        <Group justify="space-around">
          <Tooltip label={data.rating}>
            <Rating value={data.rating} fractions={5} readOnly />
          </Tooltip>
          <Text span>Reviews ({data.numReviews})</Text>
        </Group>
        {values.length === 0 ? (
          <Center h={"100%"}>
            <Title order={3}>No Reviews</Title>
          </Center>
        ) : (
          <>
            {values.map((review, index) => (
              <CardSection
                key={review + index}
                pl={"md"}
                mb={"sm"}
                display={!handleDisplay(index) && "none"}
                withBorder
              >
                <Title order={5}>{review.name}</Title>
                <Group>
                  <Tooltip label={review.rating}>
                    <Rating value={review.rating} readOnly fractions={2} />
                  </Tooltip>
                  {review.comment}
                </Group>
                {new Date(review.createdAt).toLocaleTimeString()}{" "}
                {new Date(review.createdAt).toDateString()}
              </CardSection>
            ))}
            <Center>
              <Pagination
                total={Math.ceil(values.length / 5)}
                withEdges
                value={activePage}
                onChange={setPage}
                nextIcon={IconArrowRight}
                previousIcon={IconArrowLeft}
                firstIcon={IconArrowBarToLeft}
                lastIcon={IconArrowBarToRight}
                dotsIcon={IconGripHorizontal}
              />
            </Center>
          </>
        )}
      </CardSection>
    );
  };
  return (
    <Container m={"lg"} style={{ border: "1px ridge" }}>
      {data ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: "easeInOut", duration: 1 }}
        >
          <Grid mb={"sm"}>
            <GridCol span={{ base: 12, lg: 6 }}>
              {data.productImage.length !== 0 ? (
                <>
                  <Flex display={display !== "image" && "none"}>
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
                    <Paper display={display !== "360" && "none"}>
                      <ReactImageTurntable
                        className="image360"
                        images={data.image360.sort(
                          (a, b) =>
                            b.substring(
                              b.lastIndexOf("-"),
                              b.lastIndexOf(".")
                            ) -
                            a.substring(a.lastIndexOf("-"), a.lastIndexOf("."))
                        )}
                        autoRotate={{ disabled: !autoplay, interval: 150 }}
                      />
                    </Paper>
                  )}
                  <Paper display={display !== "video" && "none"}>
                    <iframe
                      src="https://www.youtube.com/embed/mzJ4vCjSt28"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      height={300}
                      width={"100%"}
                    />
                  </Paper>
                </>
              ) : (
                <Center h={"100%"}>No Images</Center>
              )}

              {!_.isEmpty(data.image360) && (
                <Group justify="center">
                  <Button
                    variant={display === "image" ? "white" : "default"}
                    onClick={() => setDisplay("image")}
                  >
                    Images
                  </Button>
                  <Button
                    onClick={() => setDisplay("360")}
                    variant={display === "360" ? "white" : "default"}
                  >
                    360&deg;
                  </Button>
                  <Button
                    onClick={() => setDisplay("video")}
                    variant={display === "video" ? "white" : "default"}
                  >
                    Video
                  </Button>
                </Group>
              )}
              <Group justify="center" mt={"sm"}>
                <Button
                  onClick={() => {
                    setAutoplay(!autoplay);
                  }}
                  display={display !== "360" && "none"}
                  variant={autoplay ? "gradient" : "subtle"}
                >
                  {!autoplay ? "off" : "on"}
                </Button>
              </Group>
            </GridCol>
            <GridCol span={{ base: 12, lg: 6 }}>
              <Stack ta={{ base: "center", lg: "start" }}>
                <Title order={1} fw={750}>
                  {data.name} <Text span>({color.color})</Text>
                </Title>
                <Flex gap={"sm"}>
                  <Text fw={600}>Price:</Text>
                  <FormatPrice price={data.price} discount={data.discount} />
                </Flex>
                <Group>
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
                          className={color._id === item._id && "selected"}
                          mt={"auto"}
                        >
                          {item.color}
                        </Button>
                      </Flex>
                    );
                  })}
                </Group>
                {disabled ? (
                  <Text ta={"center"}>Out of Stock</Text>
                ) : (
                  <Button
                    variant="gradient"
                    onClick={() => handleCart(color)}
                    m={"auto"}
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
                <Center h={"100%"}>
                  <Title order={3}>NO DESCRIPTION</Title>
                </Center>
              )}
            </GridCol>
            <GridCol span={{ base: 12, lg: 4 }}>
              {data?.systeminfo ? (
                <CheckInfo info={data?.systeminfo} withModal={true} />
              ) : (
                <Title order={3}>No System Info</Title>
              )}
            </GridCol>
          </Grid>
          <Grid>
            <GridCol>
              <Card>
                <CardSection>
                  <form
                    onSubmit={form.onSubmit((values) =>
                      handleSubmitReview(values)
                    )}
                    style={{ margin: "auto" }}
                  >
                    <Group align="center" justify="center">
                      <Stack align="center" gap={0}>
                        <Rating
                          fractions={2}
                          value={form.rating}
                          color={"grape"}
                          {...form.getInputProps("rating")}
                          style={
                            form.errors.rating && {
                              border: "1px solid red",
                              borderRadius: "10px",
                            }
                          }
                        />
                        {form.errors.rating && (
                          <Text mt={"sm"} c={"red"} ta={"end"}>
                            {form.errors.rating}
                          </Text>
                        )}
                      </Stack>

                      <Textarea
                        placeholder="Review Product"
                        {...form.getInputProps("comment")}
                        rows={2}
                        label="Comment"
                        ta={"center"}
                      />
                      <Button
                        type="submit"
                        mt={"sm"}
                        disabled={loading}
                        loading={loading}
                      >
                        Submit
                      </Button>
                    </Group>
                  </form>
                </CardSection>
                {data.reviews && handleReview(data.reviews)}
              </Card>
            </GridCol>
            <GridCol>
              <Title order={4} ta={"center"}>
                Similar Product
              </Title>
              <Carousel
                slideSize={{ base: "100%", sm: "50%", md: "33.333333%" }}
                slideGap={{ base: 0, sm: "md", md: "xs" }}
                align="start"
                slidesToScroll={2}
              >
                {similarProduct.map((items, i) => {
                  return (
                    <Carousel.Slide
                      key={items._id + i}
                      className="similarProduct"
                    >
                      <Link
                        to={`/${items.categories}/${items._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Image
                          src={items.colors[0].image}
                          width={"90%"}
                          h={200}
                          className="img-fluid"
                        />
                        <Text ta={"center"}>{items.name}</Text>
                      </Link>
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            </GridCol>
          </Grid>
        </motion.div>
      ) : (
        <Center h={"90vh"}>
          <Loader size={100} />
        </Center>
      )}
    </Container>
  );
};

export default ProductDetail;
