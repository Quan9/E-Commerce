/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { deleteUser, getAllUsers } from "../../../services/user";
import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Group,
  Indicator,
  Loader,
  Modal,
  MultiSelect,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconChevronUp,
  IconEdit,
  IconRestore,
  IconSearch,
  IconSelector,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { DataTable } from "mantine-datatable";
import { toast } from "react-toastify";
const TotalUsers = () => {
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [dataFilter, setDataFilter] = useState();
  const PAGE_SIZES = [2, 5, 10, 15];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [records, setRecords] = useState();
  const [selectedRecords, setSelectedRecords] = useState();
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [sortStatus, setSortStatus] = useState(false);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const totalRole = ["guess", "user", "admin"];
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    getAllUsers().then((res) => {
      setData(res.data);
      setRecords(res.data.slice(0, pageSize));
      setDataFilter(res.data);
    });
  }, []);
  useEffect(() => {
    const update = () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecords(dataFilter.slice(from, to));
    };
    data && update();
  }, [page, pageSize]);
  useEffect(() => {
    if (data !== undefined && data.length !== 0) {
      const filterData = data.filter(({ _id, role }) => {
        if (
          debouncedQuery !== "" &&
          !`${_id}`.includes(debouncedQuery.trim().toLowerCase())
        ) {
          return false;
        }
        if (selectedRoles.length && !selectedRoles.includes(role)) {
          return false;
        }
        return true;
      });
      setDataFilter(filterData);
      setRecords(filterData.slice(0, pageSize));
      setPage(1);
    }
  }, [debouncedQuery, selectedRoles]);
  const displayModal = () => {
    return (
      <Modal opened={opened} onClose={close} withCloseButton={true}>
        <Text ta={"center"}>Delete User {selectedRecords.username}</Text>
        <Text ta={"center"} c={"red"} span>
          If this user is Deleted, the Chat Room of this user{" "}
          <Text fw={500} span>
            (if exist)
          </Text>{" "}
          will also be delete!
        </Text>
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
  const handleDelete = () => {
    deleteUser(selectedRecords._id, selectedRecords)
      .then((res) => {
        toast.warning(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  return (
    <Paper>
      {data ? (
        <>
          <Title ta={"center"}>Users</Title>
          <Flex>
            <Indicator title="Reset" disabled>
              <IconRestore
                onClick={() => {
                  setRecords(data);
                  setSelectedRoles([]);
                  setQuery("");
                }}
              />
            </Indicator>
            <Button mb={"sm"} onClick={() => nav("new")} ms="auto">
              Add New User
            </Button>
          </Flex>
          <Paper h={"70vh"} w={"100%"}>
            <DataTable
              highlightOnHover
              withColumnBorders
              style={{ wordBreak: "break-all", textAlign: "center" }}
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
                {
                  accessor: "username",
                  title: "User name",
                  textAlign: "center",
                },
                {
                  accessor: "email",
                  textAlign: "center",
                },
                {
                  accessor: "role",
                  textAlign: "center",
                  filter: (
                    <MultiSelect
                      label="Roles"
                      description="Show selected Roles"
                      data={totalRole}
                      value={selectedRoles}
                      placeholder="Search roles"
                      onChange={setSelectedRoles}
                      leftSection={<IconSearch size={16} />}
                      clearable
                      searchable
                    />
                  ),
                  filtering: selectedRoles.length > 0,
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
              sortIcons={{
                sorted: <IconChevronUp size={14} />,
                unsorted: <IconSelector size={14} />,
              }}
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

export default TotalUsers;
