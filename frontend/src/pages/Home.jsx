import { useEffect, useState } from "react";
// import Products from "../components/Products";
import { getAllPublicProducts } from "../services/product";
import { Categories, Products } from "../components";
import { Center, Container, Loader } from "@mantine/core";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mantine/hooks";
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
    <Container p={0} m={0}>
      <Categories />
      {data ? (
        <Products content={data} />
      ) : (
        <Center h={"100%"}>
          <Loader type="dots" size={100} />
        </Center>
      )}
    </Container>
  );
};

export default Home;
