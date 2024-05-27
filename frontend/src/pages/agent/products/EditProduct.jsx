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
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { ReactImageTurntable } from "react-image-turntable";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductInfo from "../../../components/agent/ProductInfo";
import { category, status } from "../../../components/misc/ProductData";
import { IconFileImport } from "@tabler/icons-react";
import QuillEditor from "../../../components/misc/QuillEditor";
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
  const [activeTab, setActiveTab] = useState("images");
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
    if (image360) {
      setLoading(true);
      const images360 = [];
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
        image360,
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
    setImage360(e);
    e.map((image) => {
      const imageURL = URL.createObjectURL(image);
      images.push(imageURL);
    });
    setPreview360(images);
  };
  useEffect(() => {
    getProduct(id).then((res) => {
      setData(res.data.product);
      setColors(res.data.product?.colors);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabsList justify="space-between">
              <TabsTab value="general">General Info</TabsTab>
              <TabsTab value="description">Description</TabsTab>
              <TabsTab value="systeminfo">System Info</TabsTab>
              <TabsTab value="images">Images</TabsTab>
              <Button
                type="submit"
                size="md"
                onClick={handleSubmit}
                disabled={loading}
              >
                Edit
              </Button>
            </TabsList>
            <TabsPanel value="general" mt={"md"}>
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
                              <Button onClick={() => deleteColors(item, index)}>
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
            </TabsPanel>
            <TabsPanel value="description" mt={"md"}>
              <QuillEditor
                ref={quillRef}
                defaultValue={data.desc}
                setData={setData}
              />
            </TabsPanel>
            <TabsPanel value="systeminfo" mt={"md"}>
              <ProductInfo data={data} setData={setData} newData={false} />
            </TabsPanel>
            <TabsPanel value="images" mt={"md"}>
              <Grid mt={"md"}>
                {data?.productImage.length !== 0 && (
                  <GridCol span={6}>
                    <Paper>
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
                      {preview.length !== 0 && (
                        <>
                          <Title order={4}>Preview Images</Title>
                          <Carousel
                            withIndicators
                            loop
                          >
                            {preview.map((img, index) => (
                              <CarouselSlide key={index} w={"100%"}>
                                <Image src={img} alt="pic1" />
                              </CarouselSlide>
                            ))}
                          </Carousel>
                        </>
                      )}
                    </Paper>
                  </GridCol>
                )}
                <GridCol span={"auto"}>
                  <Title order={3} ta={"center"}>
                    360&deg;
                  </Title>
                  <FileInput
                    multiple
                    placeholder="New images"
                    accept="image/png,image/jpeg"
                    clearable
                    onChange={onSelect360}
                    w={150}
                    style={{ overflowX: "hidden" }}
                  />
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
                            a.substring(a.lastIndexOf("-"), a.lastIndexOf("."))
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
            </TabsPanel>
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
