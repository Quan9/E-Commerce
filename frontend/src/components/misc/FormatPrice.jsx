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
    const discountpercent = Math.ceil(((price - discount) / price) * 100);
    const discountedprice = price - discount;
    return (
      <>
        <Text>
          <NumberFormatter
            suffix="đ"
            value={price}
            thousandSeparator
            style={{ textDecorationLine: "line-through", color: "gray" }}
          />
          <Text c={"red"} span>
            &nbsp;&nbsp;{discountpercent}%
          </Text>
          <NumberFormatter
            prefix="&nbsp;&nbsp;(- "
            suffix="đ)"
            value={discountedprice}
            thousandSeparator
            style={{ color: "green" }}
          />
        </Text>
        <NumberFormatter
          suffix="đ"
          value={discount}
          thousandSeparator
        />
      </>
    );
  }
  return (
    <Text>
      <NumberFormatter suffix="đ" value={price} thousandSeparator />
    </Text>
  );
};

export default FormatPrice;
