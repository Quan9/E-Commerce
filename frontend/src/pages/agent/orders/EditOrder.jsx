import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleOrder, updateOrder } from "../../../services/order";
import { FormatPrice } from "../../../components";
import { useSelector } from "react-redux";
import {
  Button,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { toast } from "react-toastify";
const EditOrder = () => {
  const { _id } = useParams();
  const [data, setData] = useState();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    getSingleOrder(_id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error(err, { position: "top-right" });
      });
  }, []);
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };
  const handleUpdate = () => {
    updateOrder(_id, data)
      .then((res) => {
        toast.success(res.data, { position: "top-right" });
      })
      .catch((err) => {
        toast.error(err, { position: "top-right" });
      });
  };
  return (
    <Paper>
      {data && (
        <>
          <Title order={3} ta="center">
            Order {data._id}
          </Title>
          {user.role !== "user" && (
            <Paper ta={"center"}>
              <Button onClick={handleUpdate}>Update Order</Button>
            </Paper>
          )}
          <Grid>
            <GridCol span={"auto"} ta={"center"}>
              <Text fw={500}>
                {data.userId.match(/^[0-9]/) ? "UserId" : "User Name"}
              </Text>
              {data.userId}
            </GridCol>
            <GridCol span={"auto"} ta={"center"}>
              <Text fw={500}>Products</Text>
              {data.products.map((product, index) => {
                return (
                  <Stack key={index}>
                    <Group>
                      <Text>Name: {product.productName}</Text>
                      <Text>Color: {product.color}</Text>
                      <Text>Quantity: {product.quantity}</Text>
                    </Group>
                  </Stack>
                );
              })}
            </GridCol>
            <GridCol span={"auto"} ta={"center"}>
              <Text fw={500}>Address</Text>
              <Stack>
                {data.address?.city === undefined ? (
                  <>
                    <Text>Email: {data.address?.email}</Text>
                    <Text>Name: {data.address?.name}</Text>
                    <Text>Phone Number: {data.address?.number}</Text>
                    <Text>Address: {data.address?.address}</Text>
                  </>
                ) : (
                  <>
                    <Text>City: {data.address.city}</Text>
                    <Text>Country: {data.address.country}</Text>
                    <Text>Address: {data.address.line1}</Text>
                  </>
                )}
              </Stack>
            </GridCol>
            <GridCol span={"content"} ta={"center"}>
              <Text fw={500}>Total Price</Text>
              <FormatPrice price={data.amount} />
            </GridCol>

            <GridCol span={"content"} ta={"center"}>
              <Text fw={500}>Shipment Status</Text>
              {user.role === "user" ? (
                <Text c={"blue"}>{data.status}</Text>
              ) : (
                <>
                  {data.status === "success" ? (
                    <Text c={"green"}>{data.status}</Text>
                  ) : (
                    <select value={data.status} onChange={handleChange}>
                      <option value="pending">Pending</option>
                      <option value="On Delivery">On Delivery</option>
                      <option value="success">Success</option>
                    </select>
                  )}
                </>
              )}
            </GridCol>
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default EditOrder;
