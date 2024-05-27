import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserStats } from "../services/user";
import { getOrdersPerMonth } from "../services/order";
import {
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { LineChart } from "@mantine/charts";
import FormatPrice from "../components/misc/FormatPrice";
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

  return (
    <Center maw={"90%"} h={"100%"}>
      {user.role === "user" ? (
        <Group>
          <Button
            variant="default"
            onClick={() => nav(`/user/${user._id}`)}
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
            <Stack align="center" justify="center" w={"100%"}>
              <Title>Users Visited Site Per Year</Title>
              <LineChart
                h={300}
                data={Object.values(userStats)}
                dataKey={"month"}
                series={[{ name: "users", color: "blue.6" }]}
                curveType="linear"
                connectNulls
              />
              <Title>
                Annual Income <FormatPrice price={total} />
              </Title>
              <Text
                c={"blue"}
                fw={500}
                onClick={() => nav("orders")}
                onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
              >
                Details
              </Text>
              <Table withColumnBorders highlightOnHover align="center">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Month</Table.Th>
                    <Table.Th>Total Orders</Table.Th>
                    <Table.Th>Income Per Month</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Stack>
          )}
        </>
      )}
    </Center>
  );
};

export default ProfilePage;
