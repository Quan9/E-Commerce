/* eslint-disable react/prop-types */
import { Group, NumberFormatter, Table, Text } from "@mantine/core";

const FormatPrice = ({ price, discount, quantity }) => {
  if (quantity) {
    return (
      <>
        {discount ? (
          <>
            <Table.Td>
              <Group justify="space-evenly">
                <b>{quantity} </b>x
                <Text span>
                  <NumberFormatter
                    suffix="đ"
                    value={discount}
                    thousandSeparator
                  />
                </Text>
                <Text td="line-through" c={"red"} ta={"center"}>
                  <NumberFormatter suffix="đ" value={price} thousandSeparator />
                </Text>
              </Group>
            </Table.Td>
            <Table.Td>
              <Text span>
                <NumberFormatter
                  suffix="đ"
                  value={quantity * discount}
                  thousandSeparator
                />
              </Text>
            </Table.Td>
          </>
        ) : (
          <>
            <Table.Td>
              <b>{quantity} </b> x{" "}
              <NumberFormatter suffix="đ" value={price} thousandSeparator />
            </Table.Td>
            <Table.Td>
              <Text span>
                <NumberFormatter
                  suffix="đ"
                  value={quantity * price}
                  thousandSeparator
                />
              </Text>
            </Table.Td>
          </>
        )}
      </>
    );
  }
  if (discount) {
    return (
      <Text ta={"center"}>
        <NumberFormatter
          suffix="đ"
          value={price}
          thousandSeparator
          style={{ textDecorationLine: "line-through", color: "green" }}
        />
        <NumberFormatter
          prefix="&nbsp;&nbsp;"
          suffix="đ"
          value={discount}
          thousandSeparator
        />
      </Text>
    );
  }
  return (
    <Text ta={"center"}>
      <NumberFormatter suffix="đ" value={price} thousandSeparator />
    </Text>
  );
};

export default FormatPrice;
