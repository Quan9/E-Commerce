import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserStats } from "../../services/user";
import { getOrdersPerMonth } from "../../services/order";
import {
  Button,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { FormatPrice } from "../../components";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const [total, setTotal] = useState(0);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [userStats, setUserStats] = useState(
    MONTHS.map((month) => {
      return { month: month, users: 0 };
    })
  );
  const [orders, setOrders] = useState(
    MONTHS.map((month) => {
      return { month: month, totalOrder: 0, total: 0 };
    })
  );
  useEffect(() => {
    const getStats = async () => {
      if (user.role !== "user") {
        const [result1, result2] = await Promise.all([
          getUserStats(),
          getOrdersPerMonth(),
        ]);
        result1.data.map((item) => {
          setUserStats((prev) => ({
            ...prev,
            [item._id - 1]: {
              ...prev[item._id - 1],
              ["users"]: item.total,
            },
          }));
        });
        result2.data.map((item) => {
          setTotal((prev) => prev + item.income);
          setOrders((prev) => ({
            ...prev,
            [item._id - 1]: {
              ...prev[item._id - 1],
              ["totalOrder"]: item.sum,
              ["total"]: item.income,
            },
          }));
        });
        setLoading(false);
      }
    };

    getStats();
  }, []);

  const rows = Object.values(orders).map((item) => {
    return (
      <Table.Tr key={item.month}>
        <Table.Td>{item.month}</Table.Td>
        <Table.Td>{item.totalOrder}</Table.Td>
        <Table.Td>{item.total}</Table.Td>
      </Table.Tr>
    );
  });
  const columns = (data) => {
    return (
      <>
        {Object.values(orders).map((item) => {
          return <Table.Td>{item[`${data}`]}</Table.Td>;
        })}
      </>
    );
  };
  return (
    <Center h={"100%"}>
      {user.role === "user" ? (
        <Group>
          <Button
            variant="default"
            onClick={() => nav(`/user/totalUsers/${user._id}`)}
            c={"blue"}
          >
            Edit Profile
          </Button>
          <Button
            onClick={() => nav(`/user/orders`)}
            variant="default"
            c={"blue"}
          >
            Order
          </Button>
        </Group>
      ) : (
        <>
          {loading ? (
            <Loader size={100} />
          ) : (
            <Group justify="space-around">
              <Stack>
                <Title ta={"center"}>Users Visited Site This Year</Title>
                <LineChart
                  h={300}
                  w={500}
                  data={Object.values(userStats)}
                  dataKey={"month"}
                  series={[{ name: "users", color: "blue.6" }]}
                  curveType="linear"
                  connectNulls
                />
              </Stack>
              <Stack>
                <Title ta={"center"}>Annual Income</Title>
                <FormatPrice price={total} />
                <Group justify="center">
                  <Button onClick={() => nav("Orders")}>Details</Button>
                </Group>
                <Table
                  visibleFrom="md"
                  withColumnBorders
                  highlightOnHover
                  align="center"
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Month</Table.Th>
                      <Table.Th>Total Orders</Table.Th>
                      <Table.Th>Total Income</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
                <ScrollArea w={600} >
                  <Table hiddenFrom="md" withColumnBorders highlightOnHover>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Th>Month</Table.Th>
                        {columns("month")}
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Total Income</Table.Th>
                        {columns("totalOrder")}
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Total Orders</Table.Th>
                        {columns("total")}
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Stack>
            </Group>
          )}
        </>
      )}
    </Center>
  );
};

export default ProfilePage;
