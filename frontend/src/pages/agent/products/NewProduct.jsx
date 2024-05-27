import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { toast } from "react-toastify";
import { ReactImageTurntable } from "react-image-turntable";
import {
  Button,
  FileInput,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  NumberInput,
  Paper,
  Select,
  Space,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { createProduct } from "../../../services/product";
import { category, status } from "../../../components/misc/ProductData";
import { IconFileImport } from "@tabler/icons-react";
import ProductInfo from "../../../components/agent/ProductInfo";
import QuillEditor from "../../../components/misc/QuillEditor";

const NewProduct = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState({
    color: "",
    image: null,
    inStock: "",
  });
  const [colorError, setColorError] = useState();
  const [error360, setError360] = useState(null);
  const [image360, setImage360] = useState([]);
  const [preview360, setPreview360] = useState([]);
  const [autoplay, setAutoplay] = useState(true);
  const [error, setError] = useState();
  const quillRef = useRef();
  const [activeTab, setActiveTab] = useState("general");
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
  const onSelectFile = (e) => {
    let images = [];
    setImages(e);
    e.map((image) => {
      const ImageUrl = URL.createObjectURL(image);
      images.push(ImageUrl);
    });
    setPreview(images);
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
  const uploadImage = (data, preset) => {
    const formData = new FormData();
    formData.append("file", data);
    formData.append("upload_preset", preset);
    return axios.post(
      "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
      formData
    );
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError();
    if (data?.discount > data.price) {
      setError("Discount price cannot be higher than original price");
      return;
    }
    if (images) {
      setLoading(true);
      const uploaders = images.map(async (file) => {
        const res = await uploadImage(file, "MobileShop");
        const fileURL = res.data.url;
        setProductImage({ ...productImage }, fileURL);
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
      const newProduct = {
        ...data,
        colors,
        productImage,
        image360,
      };
      createProduct(newProduct)
        .then((res) => {
          toast.success(res.data, {
            position: "top-right",
          });
        })
        .catch((err) => {
          toast.error("Error" + err, {
            position: "top-center",
          });
        });
    } catch (err) {
      toast.error("Error", {
        position: "top-center",
      });
    }
  };
  useEffect(() => {
    if (data?.categories !== undefined && data?.systeminfo === undefined) {
      setData((prev) => ({
        ...prev,
        [`systeminfo`]: {},
      }));
    }
  }, [data]);
  const handleChange = (value, name) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Paper>
      <Title order={3} ta={"center"}>
        Add Product
      </Title>
      {loading && (
        <Title order={3} className="text-info" ta={'center'}>
          Processing...
        </Title>
      )}
      {error !== null && (
        <Title order={3} className="text-danger" ta={'center'}>
          {error}
        </Title>
      )}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabsList justify="space-between">
          <TabsTab value="general">General Info</TabsTab>
          <TabsTab value="description">Description</TabsTab>
          <Tooltip
            disabled={data?.categories ? true : false}
            label="Select category 1st"
            withArrow
          >
            <TabsTab
              value="systeminfo"
              disabled={data?.categories ? false : true}
            >
              System Info
            </TabsTab>
          </Tooltip>
          <TabsTab value="images">Images</TabsTab>
          <Button onClick={handleRegister} size="md" disabled={loading}>
            Add
          </Button>
        </TabsList>
        <TabsPanel value="general" mt={"md"}>
          <Stack>
            <Title order={4} ta={"center"}>
              General Info
            </Title>
            <Group justify="center" align="center">
              <TextInput
                label="Product Name"
                name="name"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, e.currentTarget.name)
                }
              />
              <NumberInput
                label="Price"
                onChange={(e) => handleChange(e, "price")}
              />
              <NumberInput
                label="Discount Price"
                onChange={(e) => handleChange(e, "discount")}
              />
              <Select
                label="Category"
                data={category}
                defaultValue={""}
                onChange={(e) => handleChange(e, "categories")}
              />
              <Select
                label="Status"
                data={status}
                defaultValue={""}
                onChange={(e) => handleChange(e, "isActive")}
              />
            </Group>
            <Space h={"md"} />
            <Title order={4} ta={"center"}>
              Colors
            </Title>
            {colorError ? (
              <Stack>
                <Title order={2} c={"red"} ta={"center"}>
                  {colorError}
                </Title>
              </Stack>
            ) : null}
            <Grid>
              <GridCol span={colors.length !== 0 ? 6 : 12}>
                <Group justify={"flex-start"} align="flex-end">
                  <TextInput
                    label="Color"
                    placeholder="Input"
                    value={color.color}
                    name="color"
                    onChange={(e) =>
                      handleNewColor(e.target.value, e.target.name)
                    }
                  />
                  <FileInput
                    accept="image/png,image/jpeg"
                    label="Image"
                    placeholder="upload Image"
                    w={100}
                    style={{ overflow: "hidden" }}
                    onChange={(e) => handleNewColor(e, "image")}
                    leftSection={<IconFileImport size={"24"} />}
                    leftSectionPointerEvents="none"
                  />
                  <NumberInput
                    label="In Stock"
                    value={color.inStock}
                    placeholder="Input"
                    allowNegative={false}
                    onChange={(e) => handleNewColor(e, "inStock")}
                  />
                  <Button onClick={AddNewColor}>Add Color</Button>
                </Group>
              </GridCol>

              {colors.length !== 0 && (
                <GridCol span={6}>
                  <Title order={4} c={"indigo"}>
                    Current Color
                  </Title>
                  {colors.map((item, index) => {
                    return (
                      <Grid key={item + index} justify="center" align="center">
                        <GridCol span={3} className="text-center">
                          <Text>Color</Text>
                          <Text>{item.color}</Text>
                        </GridCol>
                        <GridCol span={3}>
                          <label>Image</label>
                          <Image
                            name={`a+${index}`}
                            src={
                              typeof item.image === "string"
                                ? item.image
                                : URL.createObjectURL(item.image)
                            }
                            // className="img-fluid"
                            width={"100%"}
                          />
                        </GridCol>
                        <GridCol span={3}>
                          <NumberInput
                            label="In Stock"
                            value={item.inStock}
                            onChange={(e) => handleChangeColors(item, index, e)}
                            onWheel={(e) => {
                              e.target.blur();
                            }}
                          />
                        </GridCol>
                        <GridCol span={3}>
                          <Button
                            bg={"red"}
                            onClick={() => deleteColors(item, index)}
                          >
                            Delete
                          </Button>
                        </GridCol>
                      </Grid>
                    );
                  })}
                </GridCol>
              )}
            </Grid>
          </Stack>
        </TabsPanel>
        <TabsPanel value="systeminfo" mt={"md"}>
          {data?.categories && (
            <ProductInfo data={data} setData={setData} newData={true} />
          )}
        </TabsPanel>
        <TabsPanel value="description" mt={"md"}>
          <QuillEditor
            ref={quillRef}
            defaultValue={data?.desc}
            setData={setData}
          />
        </TabsPanel>
        <TabsPanel value="images" mt={"md"}>
          <Grid mt={"md"}>
            <GridCol span={6} bg={"rgba(0, 0, 0, 0.10)"}>
              <Flex align={"center"} justify={"space-between"}>
                <Title order={4}>Add New Images</Title>
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
              {preview.length !== 0 && (
                <Carousel slideSize={"100%"} withIndicators loop draggable>
                  {preview.map((img, index) => (
                    <CarouselSlide key={index} w={"100%"}>
                      {index + 1}/{preview.length}
                      <Image
                        src={img}
                        id={index}
                        alt="pic1"
                        fit="contain"
                        h={200}
                      />
                    </CarouselSlide>
                  ))}
                </Carousel>
              )}
            </GridCol>
            <GridCol span={6}>
              <Flex align={"center"} justify={"space-between"}>
                <Title order={3}>360&deg;</Title>
                <FileInput
                  multiple
                  placeholder="New images"
                  accept="image/png,image/jpeg"
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
    </Paper>
  );
};

export default NewProduct;
