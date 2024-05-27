/* eslint-disable react/prop-types */
import { Paper, Title } from "@mantine/core";
import NewProductInfo from "./NewProductInfo";
import EditProductInfo from "./EditProductInfo";

/* Card ,ANTUTU for tablet */

const ProductInfo = (props) => {
  const { data, setData, newData } = props;
  return (
    <Paper>
      <Title order={2} ta={"center"} c={"teal"}>
        System Info
      </Title>
      {newData ? (
        <NewProductInfo data={data} setData={setData} />
      ) : (
        <EditProductInfo data={data} setData={setData} />
      )}
    </Paper>
  );
};
export default ProductInfo;
