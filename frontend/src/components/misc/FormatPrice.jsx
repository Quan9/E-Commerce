/* eslint-disable react/prop-types */
import { Group, NumberFormatter, Text, Title } from "@mantine/core";

const FormatPrice = ({ price, discount, quantity }) => {
  if (quantity) {
    const discounted_price = parseFloat(
      ((price - discount) / price) * 100
    ).toFixed(0);
    return (
      <Title order={5}>
        {quantity} x{" "}
        {discount ? (
          <>
            <Text span td="line-through">
              <NumberFormatter  value={price} thousandSeparator />{" "}
            </Text>
            <Text span>
              <NumberFormatter value={discount} thousandSeparator />{" "}
            </Text>
            <Text c={"red"} span>
              ({discounted_price}%){" "}
            </Text>
            <Text span>
              ={" "}
              <NumberFormatter value={quantity * discount} thousandSeparator />
            </Text>
          </>
        ) : (
          <Text span>
            <NumberFormatter value={price} thousandSeparator /> ={" "}
            <NumberFormatter value={quantity * price} thousandSeparator />
          </Text>
        )}
      </Title>
    );
  }
  if (discount) {
    const discounted_price = parseFloat(
      ((price - discount) / price) * 100
    ).toFixed(0);
    return (
      <Group justify={"space-between"}>
        <Text td="line-through">
          <NumberFormatter suffix="vnd" value={price} thousandSeparator />
        </Text>
        <Text>
          <NumberFormatter suffix="vnd" value={discount} thousandSeparator />
        </Text>
        <Text c={"red"}>({discounted_price}%)</Text>
      </Group>
    );
  }
  return (
    <Group justify={"center"}>
      <Text>
        <NumberFormatter suffix="vnd" value={price} thousandSeparator />
      </Text>
    </Group>
  );
};

export default FormatPrice;
