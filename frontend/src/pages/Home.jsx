import { useEffect, useState } from "react";
// import Products from "../components/Products";
import { getAllPublicProducts } from "../services/product";
import Categories from "../components/client/Categories";
import Products from "../components/client/Products";
import { Container } from "@mantine/core";
import { toast } from "react-toastify";
const Home = () => {
  const [data, setData] = useState();
  useEffect(() => {
    getAllPublicProducts()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);
  return (
    <Container px={0}>
      <Categories />
      {data && <Products content={data} />}
    </Container>
  );
};

export default Home;
