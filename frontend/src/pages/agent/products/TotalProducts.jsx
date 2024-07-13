/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

import {
  deleteProduct,
  editProduct,
  getAllProducts,
} from "../../../services/product";
import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Indicator,
  Loader,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { FormatPrice, CheckInfo } from "../../../components";
import { DataTable } from "mantine-datatable";
import {
  IconEdit,
  IconRestore,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";

const TotalProducts = () => {
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [2, 5, 10, 15];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [dataFilter, setDataFilter] = useState();

  const [records, setRecords] = useState();
  const [selectedRecords, setSelectedRecords] = useState();
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [sortStatus, setSortStatus] = useState(false);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [opened, { open, close }] = useDisclosure(false);
  const [sortCategory, setSortCategory] = useState("");
  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    const update = () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecords(data.slice(from, to));
    };
    data && update();
  }, [page, pageSize]);
  useEffect(() => {
    if (data !== undefined && data.length !== 0) {
      const filterData = data.filter(({ _id, isActive, categories }) => {
        if (
          debouncedQuery !== "" &&
          !`${_id}`.includes(debouncedQuery.trim().toLowerCase())
        )
          return false;
        if (sortStatus && isActive === "Active") return false;

        if (sortCategory !== "" && categories !== sortCategory) return false;
        return true;
      });
      setDataFilter(filterData);
      setRecords(filterData.slice(0, pageSize));
      setPage(1);
      console.log(sortCategory, filterData);
    }
  }, [debouncedQuery, sortStatus, sortCategory]);
  const displayModal = () => {
    return (
      <Modal opened={opened} onClose={close} withCloseButton={true}>
        <Text ta={"center"}>Delete Product {selectedRecords._id}</Text>
        <Group justify={"center"}>
          <Button
            onClick={() => {
              handleDelete();
              close();
            }}
            color="red"
          >
            Delete
          </Button>
          <Button onClick={close}>Cancel</Button>
        </Group>
      </Modal>
    );
  };
  const getProducts = () => {
    getAllProducts().then((res) => {
      setData(res.data);
      const a = res.data;
      setRecords(a.slice(0, pageSize));
      setDataFilter(res.data);
    });
  };
  const handleStatus = (id, status) => {
    editProduct(id, { isActive: status }).then((res) => {
      const temp = [...data];
      const index = temp.findIndex((item) => item._id === id);
      temp[index] = res.data;
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      if (index <= to) {
        setRecords(temp.slice(from, to));
      }
      setData(temp);
    });
  };
  const handleDelete = () => {
    deleteProduct(selectedRecords._id).then((res) => {
      toast.info(res.data, {
        position: "top-right",
      });
      getProducts();
    });
  };
  return (
    <Paper m={0} p={0}>
      {data ? (
        <>
          <Title ta={"center"}>Products</Title>
          <Flex>
            <Indicator title="Reset" disabled>
              <IconRestore
                onClick={() => {
                  setRecords(data);
                  setQuery("");
                  setSortStatus(false);
                }}
              />
            </Indicator>
            <Button mb={"sm"} onClick={() => nav("new")} ms="auto">
              Add New Product
            </Button>
          </Flex>
          <Paper h={"70vh"} w={"100%"}>
            <DataTable
              highlightOnHover
              withColumnBorders
              withTableBorder
              style={{ wordBreak: "break-all" }}
              columns={[
                {
                  accessor: "_id",
                  width: 80,

                  textAlign: "center",
                  filter: (
                    <TextInput
                      label="Id"
                      description="Search Id"
                      placeholder="Search Id..."
                      leftSection={<IconSearch size={16} />}
                      rightSection={
                        <ActionIcon
                          size="sm"
                          variant="transparent"
                          c="dimmed"
                          onClick={() => setQuery("")}
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      }
                      value={query}
                      onChange={(e) => setQuery(e.currentTarget.value)}
                    />
                  ),
                  filtering: query !== "",
                },
                { accessor: "name", textAlign: "center" },
                {
                  accessor: "price",
                  textAlign: "center",
                  render: ({ price, discount }) => (
                    <>
                      {discount !== undefined ? (
                        <FormatPrice price={price} discount={discount} />
                      ) : (
                        <FormatPrice price={price} />
                      )}
                    </>
                  ),
                },
                {
                  accessor: "categories",
                  textAlign: "center",
                  title: "Category",
                  filter: (
                    <Select
                      data={["Phone", "Laptop", "Tablet"]}
                      onChange={setSortCategory}
                      placeholder="Select a category"
                      value={sortCategory}
                    />
                  ),
                },
                {
                  accessor: "image",
                  width: 100,
                  textAlign: "center",
                  render: ({ colors }) => <Image src={colors[0].image} />,
                },
                {
                  accessor: "colors",
                  textAlign: "center",
                  width: 200,
                  render: ({ colors }) => (
                    <Stack key={colors}>
                      {colors.map((color, index) => (
                        <Center key={color + index}>
                          <Group>
                            <Paper>
                              Color: {color.color} , In Stock: {color.inStock}
                            </Paper>
                          </Group>
                        </Center>
                      ))}
                    </Stack>
                  ),
                },
                {
                  accessor: "isActive",
                  textAlign: "center",
                  title: "Active",
                  width: 120,
                  render: ({ isActive, _id }) => (
                    <Stack>
                      <Center>{isActive}</Center>
                      <Button
                        justify="center"
                        wrap="nowrap"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isActive === "Active") {
                            handleStatus(_id, "Inactive");
                          } else {
                            handleStatus(_id, "Active");
                          }
                        }}
                        variant={isActive === "Active" && "filled"}
                        color={isActive === "Active" ? "red" : "blue"}
                      >
                        {isActive === "Active" ? "Inactive" : "Active"}
                      </Button>
                    </Stack>
                  ),
                  filter: () => (
                    <Checkbox
                      description="Show Disabled Product"
                      checked={sortStatus}
                      onChange={() => {
                        setSortStatus((current) => !current);
                      }}
                    />
                  ),
                },
                {
                  accessor: "Row Actions",
                  textAlign: "center",
                  width: "100px",
                  render: (record) => (
                    <Group gap={4} justify="center" wrap="nowrap">
                      <Indicator title="Edit" disabled>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="green"
                          onClick={() => nav(`${record._id}`)}
                        >
                          <IconEdit size={20} />
                        </ActionIcon>
                      </Indicator>
                      <Indicator title="Delete" disabled>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            open(true);
                            setSelectedRecords(record);
                          }}
                        >
                          <IconTrash size={20} />
                        </ActionIcon>
                      </Indicator>
                    </Group>
                  ),
                },
              ]}
              rowExpansion={{
                content: ({ record }) => (
                  <Grid h={200}>
                    <GridCol span={6} style={{ overflowY: "scroll" }}>
                      <Title order={3} c={"indigo"} ta={"center"}>
                        Description
                      </Title>
                      <Paper h={"100"}>{parse(`${record.desc}`)}</Paper>
                    </GridCol>
                    <GridCol span={6} style={{ overflowY: "scroll" }}>
                      <Title order={3} c={"indigo"} ta={"center"}>
                        System Info
                      </Title>
                      <Paper h={100}>
                        {record.systeminfo === undefined ? (
                          <>Nothing</>
                        ) : (
                          <CheckInfo
                            info={record.systeminfo}
                            withModal={false}
                          />
                        )}
                      </Paper>
                    </GridCol>
                  </Grid>
                ),
              }}
              records={records}
              totalRecords={dataFilter.length}
              paginationActiveBackgroundColor="grape"
              recordsPerPage={pageSize}
              page={page}
              onPageChange={(p) => setPage(p)}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setPageSize}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              idAccessor="_id"
            />
          </Paper>
          {selectedRecords && displayModal()}
        </>
      ) : (
        <Center h={"100%"}>
          <Loader size={"xl"} />
        </Center>
      )}
    </Paper>
  );
};
export default TotalProducts;
