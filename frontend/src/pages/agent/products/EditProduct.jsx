import { Carousel, CarouselSlide } from "@mantine/carousel";
import {
  Button,
  Center,
  FileInput,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Loader,
  NumberInput,
  Paper,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  Transition,
} from "@mantine/core";
import { ReactImageTurntable } from "react-image-turntable";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ProductInfo,
  category,
  status,
  QuillEditor,
} from "../../../components";
import { IconFileImport } from "@tabler/icons-react";
import axios from "axios";
import { editProduct, getProduct } from "../../../services/product";
import { toast } from "react-toastify";
const EditProduct = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [data, setData] = useState();
  const [dataError, setDataError] = useState();
  const [image360, setImage360] = useState([]);
  const [preview360, setPreview360] = useState([]);
  const [error360, setError360] = useState([]);
  const [autoplay, setAutoplay] = useState(true);
  const [colors, setColors] = useState();
  const [color, setColor] = useState({
    color: "",
    image: null,
    inStock: "",
  });
  const [colorError, setColorError] = useState();
  const [loading, setLoading] = useState(false);
  const quillRef = useRef();
  const [activeTab, setActiveTab] = useState("1");
  const [previousTab, setPreviousTab] = useState();
  const onSelectFile = (e) => {
    let images = [];
    setImages(e);
    e.map((image) => {
      const ImageUrl = URL.createObjectURL(image);
      images.push(ImageUrl);
    });
    setPreview(images);
  };
  const uploadImage = (data, preset) => {
    const formData = new FormData();
    formData.append("file", data);
    formData.append("upload_preset", preset);
    return axios.post(
      "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
      formData
    );
  };
  const handleSubmit = async () => {
    setDataError();
    if (data?.discount >= data.price) {
      setDataError("Discount price cannot be higher or equal original price");
      return;
    }
    const productImage = [];
    if (images) {
      setLoading(true);
      const uploaders = images.map(async (file) => {
        const res = await uploadImage(file, "MobileShop");
        const fileURL = res.data.url;
        productImage.concat(fileURL);
      });
      await axios.all(uploaders).then(() => {
        setLoading(false);
      });
    }
    if (colors) {
      setLoading(true);
      const uploaders = colors.map(async (item) => {
        const res = await uploadImage(item.image, "MobileShop");
        const fileURL = res.data.url;
        item.image = fileURL;
      });
      await axios.all(uploaders).then(() => {
        setLoading(false);
      });
    }
    const images360 = [];
    if (image360) {
      setLoading(true);
      const uploaders = image360.map(async (file) => {
        const res = await uploadImage(file, "MobileShop");
        const fileURL = res.data.url;
        images360.push(fileURL);
      });
      await axios.all(uploaders).then(() => {
        setLoading(false);
        setImage360(images360);
      });
    }
    try {
      setLoading(true);
      const newProduct = {
        ...data,
        colors,
        productImage: data.productImage.concat(productImage),
        image360: images360,
      };
      editProduct(data._id, newProduct)
        .then((res) => {
          toast.success("Product Updated Successfully", {
            position: "top-right",
          });
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          toast.error("Something wrong when update data", {
            position: "top-right",
            data: err,
          });
        });
    } catch (err) {
      toast.error("Connection to database failed", {
        position: "top-right",
      });
      setLoading(false);
    }
  };
  const handleChange = (value, name) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleNewColor = (value, name) => {
    if (value === null) {
      setColor((prev) => ({
        ...prev,
        [name]: null,
      }));
    } else if (typeof value === "number") {
      const data = Math.abs(value);
      setColor((prev) => ({
        ...prev,
        [name]: data,
      }));
    } else {
      setColor((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const AddNewColor = () => {
    if (color.color === "") {
      setColorError("Color field cannot be empty");
      return;
    }
    if (color.image === null) {
      setColorError("Select an image");
      return;
    }
    if (color.inStock === "") {
      setColorError("inStock field cannot be empty");
      return;
    }
    if (colors.length !== 0) {
      const checkColorExist = colors.findIndex((colorA) => {
        return colorA.color === color.color;
      });
      if (checkColorExist > -1) {
        setColorError("This color already exist!");
        return;
      }
    }
    setColorError();
    setColors(colors.concat(color));
    setColor({
      color: "",
      image: null,
      inStock: "",
    });
  };
  const deleteColors = (item, index) => {
    let newColors = [...colors];
    let filtered = newColors.filter((_, ind) => {
      return ind !== index;
    });
    newColors = filtered;
    setColors(newColors);
  };
  const handleChangeColors = (item, index, e) => {
    const newInstock = [...colors];
    newInstock[index].inStock = e.target.value;
    setColors(newInstock);
  };
  const onSelect360 = (e) => {
    setError360();
    if (e.length < 36) {
      setError360(`Must have at least 36 file, current: ${e.length}`);
      setImage360([]);
      setPreview360([]);
      return;
    }
    const preview = [];
    setImage360(e);
    e.map((image) => {
      const imageURL = URL.createObjectURL(image);
      preview.push(imageURL);
    });
    setPreview360(preview);
  };
  useEffect(() => {
    getProduct(id).then((res) => {
      setData(res.data.product);
      setColors(res.data.product?.colors);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleTabChange = (data) => {
    const previous = activeTab;
    const temp = Number(data) - Number(previous);
    setPreviousTab(temp.toString());
    setActiveTab(data);
  };
  return (
    <Paper shadow="lg">
      {data ? (
        <>
          <Title order={3} align="center">
            Edit Product ({data.name})
          </Title>
          {loading && (
            <Title order={2} c={"blue"} align="center">
              Processing...
            </Title>
          )}
          {dataError !== null && (
            <Title order={2} c={"red"} align="center">
              {dataError}
            </Title>
          )}
          <Tabs value={activeTab} onChange={(e) => handleTabChange(e)}>
            <Tabs.List justify="space-between">
              <Tabs.Tab value="1">General Info</Tabs.Tab>
              <Tabs.Tab value="2">Description</Tabs.Tab>
              <Tabs.Tab value="3">System Info</Tabs.Tab>
              <Tabs.Tab value="4">Images</Tabs.Tab>
              <Button
                type="submit"
                size="md"
                onClick={handleSubmit}
                disabled={loading}
              >
                Edit
              </Button>
            </Tabs.List>
            <Transition
              mounted={activeTab === "1"}
              transition={"slide-right"}
              duration={300}
              timingFunction="ease"
            >
              {(transitionStyle) => (
                <Tabs.Panel value="1" mt={"md"} style={{ ...transitionStyle }}>
                  <Grid>
                    <GridCol span={colors.length !== 0 ? 6 : 12}>
                      <Group justify="center" mb={"md"}>
                        <TextInput
                          label={"Name"}
                          value={data.name}
                          onChange={(e) =>
                            handleChange(
                              e.currentTarget.value,
                              e.currentTarget.name
                            )
                          }
                        />
                        <NumberInput
                          label="Price"
                          value={data.price}
                          onChange={(e) => handleChange(e, "price")}
                        />
                        <NumberInput
                          label="Discount price"
                          value={data.discount}
                          onChange={(e) => handleChange(e, "discount")}
                        />
                        <Select
                          label="Category"
                          placeholder="Select an option"
                          value={data.categories}
                          data={category}
                          onChange={(e) => handleChange(e, "categories")}
                        />
                        <Select
                          placeholder="Select an option"
                          label="Status"
                          value={data.isActive}
                          data={status}
                          onChange={(e) => handleChange(e, "isActive")}
                        />
                      </Group>
                      <Group wrap="nowrap" align="flex-end" justify="center">
                        <TextInput
                          label="Color"
                          placeholder="Input"
                          name="color"
                          value={color.color}
                          onChange={(e) =>
                            handleNewColor(e.target.value, e.target.name)
                          }
                        />
                        <FileInput
                          accept="image/png,image/jpeg"
                          label="Image"
                          placeholder="Image"
                          w={100}
                          style={{ overflow: "hidden" }}
                          onChange={(e) => handleNewColor(e, "image")}
                          leftSection={<IconFileImport size={"24"} />}
                          leftSectionPointerEvents="none"
                        />
                        <NumberInput
                          label="In Stock"
                          aria-label="In Stock"
                          value={color.inStock}
                          placeholder="Input"
                          allowNegative={false}
                          onChange={(e) => handleNewColor(e, "inStock")}
                        />
                        <Button onClick={AddNewColor}>Add Color</Button>
                      </Group>
                      {colorError ? (
                        <Title order={2} c={"red"} ta={"center"} mt={"md"}>
                          {colorError}
                        </Title>
                      ) : null}
                    </GridCol>
                    {colors.length !== 0 && (
                      <GridCol span={6}>
                        <Title order={4} c={"indigo"} ta={"center"}>
                          Current Color(s)
                        </Title>
                        <Stack>
                          {colors.map((item, index) => {
                            return (
                              <Grid
                                justify="start"
                                key={item + index}
                                align="flex-end"
                              >
                                <GridCol span={3}>
                                  <Text span fw={500}>
                                    Color:
                                  </Text>
                                  <Text span>{item.color}</Text>
                                </GridCol>
                                <GridCol span={3}>
                                  <Image
                                    name={`a+${index}`}
                                    src={
                                      typeof item.image === "string"
                                        ? item.image
                                        : URL.createObjectURL(item.image)
                                    }
                                    fit="contain"
                                  />
                                </GridCol>
                                <GridCol span={3}>
                                  <Group>
                                    <Text fw={500}>In Stock:</Text>
                                    <NumberInput
                                      value={item.inStock}
                                      onChange={(e) =>
                                        handleChangeColors(item, index, e)
                                      }
                                      onWheel={(e) => {
                                        e.target.blur();
                                      }}
                                    />
                                  </Group>
                                </GridCol>
                                <GridCol span={3}>
                                  <Button
                                    onClick={() => deleteColors(item, index)}
                                  >
                                    Delete
                                  </Button>
                                </GridCol>
                              </Grid>
                            );
                          })}
                        </Stack>
                      </GridCol>
                    )}
                  </Grid>
                </Tabs.Panel>
              )}
            </Transition>
            <Transition
              mounted={activeTab === "2"}
              transition={previousTab > 0 ? "slide-left" : "slide-right"}
              duration={300}
              timingFunction="ease"
            >
              {(transitionStyle) => (
                <Tabs.Panel value="2" mt={"md"} style={{ ...transitionStyle }}>
                  <QuillEditor
                    ref={quillRef}
                    defaultValue={data.desc}
                    setData={setData}
                  />
                </Tabs.Panel>
              )}
            </Transition>
            <Transition
              mounted={activeTab === "3"}
              transition={previousTab > 0 ? "slide-left" : "slide-right"}
              duration={300}
              timingFunction="ease"
            >
              {(transitionStyle) => (
                <Tabs.Panel value="3" mt={"md"} style={{ ...transitionStyle }}>
                  <ProductInfo data={data} setData={setData} newData={false} />
                </Tabs.Panel>
              )}
            </Transition>
            <Transition
              mounted={activeTab === "4"}
              transition={previousTab > 0 ? "slide-left" : "slide-right"}
              duration={300}
              timingFunction="ease"
            >
              {(transitionStyle) => (
                <Tabs.Panel value="4" mt={"md"} style={{ ...transitionStyle }}>
                  <Grid mt={"md"}>
                    <GridCol span={6}>
                      {data?.productImage.length !== 0 ? (
                        <>
                          <Flex align={"center"} justify={"space-between"}>
                            <Title order={4}>Current Images</Title>
                            <FileInput
                              multiple
                              placeholder="New images"
                              accept="image/png,image/jpeg"
                              clearable
                              onChange={onSelectFile}
                              w={150}
                              style={{ overflowX: "hidden" }}
                            />
                          </Flex>
                          <Carousel
                            slideSize={"100%"}
                            height={"300"}
                            withIndicators
                            loop
                          >
                            {data.productImage.map((product, index) => (
                              <CarouselSlide key={index} w={"100%"}>
                                <Image src={product} alt={"image " + index} />
                              </CarouselSlide>
                            ))}
                          </Carousel>
                        </>
                      ) : (
                        <>
                          <Flex align={"center"} justify={"space-between"}>
                            <Title order={4}>New Images</Title>
                            <FileInput
                              multiple
                              placeholder="New images"
                              accept="image/png,image/jpeg"
                              clearable
                              onChange={onSelectFile}
                              w={150}
                              style={{ overflowX: "hidden" }}
                            />
                          </Flex>
                        </>
                      )}
                      {preview.length !== 0 && (
                        <>
                          <Title order={4}>Preview Images</Title>
                          <Carousel withIndicators loop>
                            {preview.map((img, index) => (
                              <CarouselSlide key={index} w={"100%"}>
                                <Image src={img} alt="pic1" />
                              </CarouselSlide>
                            ))}
                          </Carousel>
                        </>
                      )}
                    </GridCol>
                    <GridCol span={"auto"}>
                      <Flex align={"center"} justify={"space-between"}>
                        <Title order={3} ta={"center"}>
                          360&deg;
                        </Title>
                        <FileInput
                          multiple
                          placeholder="New images"
                          accept="image/png,image/jpeg,image/webp"
                          clearable
                          onChange={onSelect360}
                          w={150}
                          style={{ overflowX: "hidden" }}
                        />
                      </Flex>
                      {error360 && (
                        <Text fw={600} c={"red"}>
                          {error360}
                        </Text>
                      )}
                      {data.image360.length !== 0 && (
                        <>
                          <Title order={5}>
                            Current 360<sup>o</sup> Image
                          </Title>
                          <ReactImageTurntable
                            className="image360"
                            images={data.image360.sort(
                              (a, b) =>
                                b.substring(
                                  b.lastIndexOf("-"),
                                  b.lastIndexOf(".")
                                ) -
                                a.substring(
                                  a.lastIndexOf("-"),
                                  a.lastIndexOf(".")
                                )
                            )}
                            autoRotate={{ disabled: !autoplay, interval: 150 }}
                          />
                          <Text>Autoplay</Text>
                          <Button
                            onClick={() => {
                              setAutoplay(!autoplay);
                            }}
                          >
                            {!autoplay ? "start" : "stop"}
                          </Button>
                        </>
                      )}
                      {preview360.length !== 0 && (
                        <>
                          <Title order={5}>360&deg; Preview</Title>
                          <ReactImageTurntable
                            className="image360"
                            images={preview360}
                          />
                          <Text>Autoplay</Text>
                          <Button
                            onClick={() => {
                              setAutoplay(!autoplay);
                            }}
                          >
                            {!autoplay ? "start" : "stop"}
                          </Button>
                        </>
                      )}
                    </GridCol>
                  </Grid>
                </Tabs.Panel>
              )}
            </Transition>
          </Tabs>
        </>
      ) : (
        <Center h={"90vh"}>
          <Loader size={60} />
        </Center>
      )}
    </Paper>
  );
};

export default EditProduct;
