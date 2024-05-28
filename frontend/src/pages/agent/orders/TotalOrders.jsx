/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getAllOrder, getUserOrder } from "../../../services/order";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ActionIcon,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
const TotalOrders = () => {
  const { user } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [2, 5, 10, 15];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [records, setRecords] = useState();
  const [data, setData] = useState();
  const nav = useNavigate();
  useEffect(() => {
    const getOrder = () => {
      if (user.role === "user") {
        getUserOrder(user._id)
          .then((res) => {
            setRecords(res.data.slice(0, pageSize));
            setData(res.data);
          })
          .catch((err) => {
            toast.error("err: " + err, {
              position: "top-center",
            });
          });
      } else {
        getAllOrder()
          .then((res) => {
            setRecords(res.data.slice(0, pageSize));
            setData(res.data);
          })
          .catch((err) =>
            toast.error("err: " + err, {
              position: "top-center",
            })
          );
      }
    };
    getOrder();
  }, []);
  useEffect(() => {
    const update = () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecords(data.slice(from, to));
    };
    data && update();
  }, [page, pageSize]);
  return (
    <Paper>
      {data ? (
        <>
          <Title order={3} ta={"center"}>
            Orders
          </Title>
          <Paper h={"70vh"} w={"100%"}>
            <DataTable
              highlightOnHover
              style={{ wordBreak: "break-all" }}
              withColumnBorders
              columns={[
                {
                  accessor: "_id",
                  width: 80,
                  textAlign: "center",
                },
                { accessor: "amount", textAlign: "center" },
                { accessor: "status", textAlign: "center" },
                {
                  accessor: "address",
                  textAlign: "center",
                  render: (record) => (
                    <>
                      {record.address?.city === undefined ? (
                        <>
                          <Text>Email: {record.address?.email}</Text>
                          <Text>Name: {record.address?.name}</Text>
                          <Text>Phone Number: {record.address?.number}</Text>
                          <Text>Address: {record.address?.address}</Text>
                        </>
                      ) : (
                        <>
                          <Text>City: {record.address.city}</Text>
                          <Text>Country: {record.address.country}</Text>
                          <Text>Address: {record.address.line1}</Text>
                        </>
                      )}
                    </>
                  ),
                },
                {
                  accessor: "payment_method",
                  textAlign: "center",
                  title: "Payment Method",
                },
                {
                  accessor: "products",
                  textAlign: "center",
                  render: (record) => (
                    <Stack >
                      {record.products.map((product, index) => (
                        <Group key={product + index} justify="center" >
                          <Text>Product: {product.productName}</Text>
                          <Text>Quantity: {product.quantity}</Text>
                          <Text> Color: {product.color}</Text>
                        </Group>
                      ))}
                    </Stack>
                  ),
                },
                {
                  accessor: "Action",
                  render: (record) => (
                    <ActionIcon
                      title="Detail"
                      onClick={() => nav(`${record._id}`)}
                    >
                      <IconEdit />
                    </ActionIcon>
                  ),
                },
              ]}
              records={records}
              totalRecords={data.length}
              paginationActiveBackgroundColor="grape"
              recordsPerPage={pageSize}
              page={page}
              onPageChange={(p) => setPage(p)}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setPageSize}
              selectionTrigger="cell"
              idAccessor="_id"
            />
          </Paper>
        </>
      ) : (
        <Center h={"100%"}>
          <Loader size={"xl"} />
        </Center>
      )}
    </Paper>
  );
};

export default TotalOrders;
