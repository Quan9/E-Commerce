/* eslint-disable react/prop-types */
import {
  Grid,
  GridCol,
  Group,
  MultiSelect,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  data2,
  dataBackCamera,
  dataBrand,
  dataCameraRes,
  dataInstruction,
  dataManual,
  dataMaterial,
  dataMonth,
  dataSelfie,
} from "../misc/ProductData";
import dayjs from "dayjs";
import { useEffect } from "react";
const EditProductInfo = (props) => {
  const { data, setData } = props;
  useEffect(() => {
    const checkSystemInfo = () => {
      if (data?.systeminfo === undefined) {
        setData((prev) => ({
          ...prev,
          ["systeminfo"]: {},
        }));
      }
    };
    checkSystemInfo();
  }, []);
  const handleChange = (value, parent, name) => {
    setData((prev) => ({
      ...prev,
      ["systeminfo"]: {
        ...prev["systeminfo"],
        [parent]: {
          ...prev["systeminfo"][parent],
          [name]: value,
        },
      },
    }));
  };
  const handleChangeArray = (value, parent, name) => {
    if (value.length === 0) {
      setData((prev) => {
        const newData = { ...prev };
        delete newData["systeminfo"][parent][name];
        return newData;
      });
    } else {
      setData((prev) => ({
        ...prev,
        ["systeminfo"]: {
          ...prev["systeminfo"],
          [parent]: {
            ...prev["systeminfo"][parent],
            [name]: value,
          },
        },
      }));
    }
  };
  return (
    <Grid
      justify="space-evenly"
      align="flex-start"
      bg={"rgba(198,198,198,0.3)"}
    >
      {data && (
        <>
          <GridCol span={6}>
            {/* generalInfo */}
            <Title order={4} ta={"center"}>
              General Info
            </Title>
            <Group justify="center" align="center" mb={"md"}>
              <Select
                placeholder="Select an option"
                label="Brand"
                data={dataBrand}
                value={data.systeminfo?.productInfo?.brand}
                onChange={(e) => handleChange(e, "productInfo", "brand")}
              />
              <Select
                placeholder="Select Option"
                data={data2}
                value={data.systeminfo?.productInfo?.manufacturer}
                label="Manufacturer"
                onChange={(e) => handleChange(e, "productInfo", "manufacturer")}
              />
              <DateInput
                label="Release Date"
                valueFormat="YYYY MMM DD"
                value={
                  data.systeminfo?.productInfo?.releaseDate &&
                  dayjs(
                    data.systeminfo?.productInfo?.releaseDate,
                    "YYYY MMM DD"
                  ).toDate()
                }
                placeholder="Date input"
                onChange={(e) => handleChange(e, "productInfo", "releaseDate")}
              />
              <Select
                placeholder="Select Option"
                value={data.systeminfo?.productInfo?.insurance}
                data={dataMonth}
                label="Insurance"
                onChange={(e) => handleChange(e, "productInfo", "insurance")}
              />
              <Select
                placeholder="Select Option"
                data={dataManual}
                value={data.systeminfo?.productInfo?.manual}
                label="Manual"
                onChange={(e) => handleChange(e, "productInfo", "manual")}
              />
              <Select
                placeholder="Select Option"
                data={dataInstruction}
                value={data.systeminfo?.productInfo?.instruction}
                label="Instruction"
                onChange={(e) => handleChange(e, "productInfo", "instruction")}
              />
            </Group>
          </GridCol>
          <GridCol span={6}>
            {/* Back Camera */}
            <Title order={4} ta={"center"}>
              Back Camera
            </Title>
            <Group justify="center" align="center" mb={"md"}>
              <Select
                data={dataBackCamera}
                value={data.systeminfo?.backCamera?.cameraRear}
                label="Camera rear(s)"
                placeholder="Select camera rear"
                onChange={(e) => handleChange(e, "backCamera", "cameraRear")}
              />
              {data?.systeminfo?.backCamera?.cameraRear && (
                <>
                  <Select
                    data={dataCameraRes}
                    value={data.systeminfo?.backCamera?.mainCamera}
                    label="Main Camera"
                    placeholder="Select option"
                    onChange={(e) =>
                      handleChange(e, "backCamera", "mainCamera")
                    }
                  />
                  {!data?.systeminfo?.backCamera?.cameraRear.includes(
                    "Single"
                  ) && (
                    <Select
                      data={dataCameraRes}
                      label="Support Camera"
                      value={data.systeminfo?.backCamera?.supportCamera}
                      placeholder="Select option"
                      onChange={(e) =>
                        handleChange(e, "backCamera", "supportCamera")
                      }
                    />
                  )}
                  {data?.systeminfo?.backCamera?.cameraRear.includes(
                    "Triple"
                  ) && (
                    <Select
                      data={dataCameraRes}
                      value={data.systeminfo?.backCamera?.supportCamera2}
                      label="2nd Support Camera"
                      placeholder="Select option"
                      onChange={(e) =>
                        handleChange(e, "backCamera", "supportCamera2")
                      }
                    />
                  )}
                  <MultiSelect
                    data={data2}
                    value={data.systeminfo?.backCamera?.film}
                    label="Camera Film"
                    onChange={(e) => handleChangeArray(e, "backCamera", "film")}
                  />
                  <MultiSelect
                    data={data2}
                    value={data.systeminfo?.backCamera?.function}
                    label="Camera Function"
                    onChange={(e) =>
                      handleChangeArray(e, "backCamera", "function")
                    }
                  />
                </>
              )}
            </Group>
            {/* Front Camera (Selfie) */}
            <Title order={4} ta={"center"}>
              Front Camera(Selfie)
            </Title>
            <Group justify="center" align="center" mb={"md"}>
              <Select
                data={dataSelfie}
                label="Camera rear(s)"
                value={data.systeminfo?.selfie?.cameraRear}
                placeholder="Select camera rear"
                onChange={(e) => handleChange(e, "selfie", "cameraRear")}
              />
              {data?.systeminfo?.selfie?.cameraRear && (
                <>
                  <Select
                    data={dataCameraRes}
                    value={data.systeminfo?.selfie?.mainCamera}
                    label="Main Camera"
                    placeholder="Select option"
                    onChange={(e) => handleChange(e, "selfie", "mainCamera")}
                  />
                  {!data?.systeminfo?.selfie?.cameraRear.includes("Single") && (
                    <Select
                      data={dataCameraRes}
                      value={data.systeminfo?.selfie?.supportCamera}
                      label="Support Camera"
                      placeholder="Select option"
                      onChange={(e) =>
                        handleChange(e, "selfie", "supportCamera")
                      }
                    />
                  )}
                  {data?.systeminfo?.selfie?.cameraRear.includes("Triple") && (
                    <Select
                      data={dataCameraRes}
                      value={data.systeminfo?.selfie?.supportCamera2}
                      label="2nd Support Camera"
                      placeholder="Select option"
                      onChange={(e) =>
                        handleChange(e, "selfie", "supportCamera2")
                      }
                    />
                  )}
                  <MultiSelect
                    data={data2}
                    value={data.systeminfo?.selfie?.film}
                    label="Camera Film"
                    onChange={(e) => handleChangeArray(e, "selfie", "film")}
                  />
                  <MultiSelect
                    data={data2}
                    value={data.systeminfo?.selfie?.function}
                    label="Camera Function"
                    onChange={(e) => handleChangeArray(e, "selfie", "function")}
                  />
                </>
              )}
            </Group>
          </GridCol>
          <GridCol span={6}>
            {/* Battery & Charge */}
            <Title order={4} ta={"center"}>
              Battery & Charge
            </Title>
            <Group justify="center" align="center" mb={"md"}>
              <Select
                data={dataCameraRes}
                value={data.systeminfo?.batteryCharger?.type}
                label="Battery Type"
                onChange={(e) =>
                  handleChange(e, "batteryCharger", "batteryType")
                }
              />
              <Select
                data={dataCameraRes}
                value={data.systeminfo?.batteryCharger?.capacity}
                label="Battery Capacity"
                onChange={(e) =>
                  handleChange(e, "batteryCharger", "batteryCapacity")
                }
              />
              <MultiSelect
                data={dataCameraRes}
                value={data.systeminfo?.batteryCharger?.technology}
                label="Battery Technology"
                onChange={(e) =>
                  handleChangeArray(e, "batteryCharger", "battery technology")
                }
              />
            </Group>
            {/* Storage */}
            <Title order={4} ta={"center"}>
              Storage
            </Title>
            <Group justify="center" align="center" mb={"md"}>
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.storage?.internal}
                label="Internal memory"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "storage", "internal")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.storage?.contact}
                label="Contact Memory"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "storage", "contact")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.storage?.external}
                label="External Memory Card"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "storage", "external")
                }
              />
            </Group>
          </GridCol>
          <GridCol span={6}>
            {/* Ram */}
            <Title order={4} ta={"center"}>
              Ram
            </Title>
            <Group justify="center" align="center" mb={"md"}>
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.ram?.ram}
                label="RAM"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "ram", "ram")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.ram?.ramType}
                label="RAM Type"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "ram", "ramType")
                }
              />
            </Group>
            {/* Operating System */}
            <Title order={4} ta={"center"}>
              Operating System
            </Title>
            <Group justify="center" align="center" mb={"md"}>
              <Select
                placeholder="Select an option"
                data={dataCameraRes}
                value={data.systeminfo?.operatingSystem?.OS}
                label="OS"
                onChange={(e) => handleChange(e, "operatingSystem", "OS")}
              />
              <Select
                placeholder="Select an option"
                value={data.systeminfo?.operatingSystem?.Version}
                data={dataCameraRes}
                label="Version"
                onChange={(e) => handleChange(e, "operatingSystem", "Version")}
              />
            </Group>
          </GridCol>
          <GridCol span={6}>
            {/* Screen */}
            <Title order={4} ta={"center"}>
              Screen
            </Title>
            <Group justify="center" align="center" mb={"md"}>
              <TextInput
                value={data.systeminfo?.screen?.size}
                placeholder="Input"
                label="Screen Size"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "screen", "size")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.screen?.color}
                label="Screen Color"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "screen", "color")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.screen?.touch}
                label="Touch Type"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "screen", "touch")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.screen?.ratio}
                label="Aspect ratio"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "screen", "ratio")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.screen?.tech}
                label="Screen tech"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "screen", "tech")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.screen?.standard}
                label="Standard Screen"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "screen", "standard")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.screen?.resolution}
                label="Resolution"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "screen", "resolution")
                }
              />
              <TextInput
                placeholder="Input"
                value={data.systeminfo?.screen?.scanFrequency}
                label="Scan Frequency"
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "screen", "scanFrequency")
                }
              />
            </Group>{" "}
          </GridCol>

          <GridCol span={6}>
            {/* Communication & Connect */}
            <Title order={4} ta={"center"}>
              Communication & Connect
            </Title>
            <Group justify="center" align="center" mb={"md"}>
              <Select
                placeholder="Select an option"
                data={dataMaterial}
                value={data.systeminfo?.connect?.simSlot}
                label="Sim Slot"
                onChange={(e) =>
                  handleChange(e, "communication&connect", "simSlot")
                }
              />
              <Select
                placeholder="Select an option"
                data={dataMaterial}
                value={data.systeminfo?.connect?.simType}
                label="Sim Type"
                onChange={(e) =>
                  handleChange(e, "communication&connect", "simType")
                }
              />
              <Select
                placeholder="Select an option"
                data={dataMaterial}
                value={data.systeminfo?.connect?.Bluetooth}
                label="Bluetooth"
                onChange={(e) =>
                  handleChange(e, "communication&connect", "bluetooth")
                }
              />
              <MultiSelect
                placeholder="Select options"
                data={dataMaterial}
                value={data.systeminfo?.connect?.networkSupport}
                label="Network Support"
                onChange={(e) =>
                  handleChangeArray(
                    e,
                    "communication&connect",
                    "networkSupport"
                  )
                }
              />
              <Select
                placeholder="Select an option"
                data={dataMaterial}
                value={data.systeminfo?.connect?.port}
                label="Charge port"
                onChange={(e) =>
                  handleChange(e, "communication&connect", "port")
                }
              />
              <MultiSelect
                placeholder="Select options"
                data={dataMaterial}
                value={data.systeminfo?.connect?.Wifi}
                label="Wifi"
                onChange={(e) =>
                  handleChangeArray(e, "communication&connect", "wifi")
                }
              />
              <Select
                placeholder="Select an option"
                value={data.systeminfo?.connect?.gps}
                data={dataMaterial}
                label="GPS"
                onChange={(e) =>
                  handleChange(e, "communication&connect", "gps")
                }
              />
              <MultiSelect
                placeholder="Select options"
                data={dataMaterial}
                value={data.systeminfo?.connect?.otherConnection}
                label="Other connection"
                onChange={(e) =>
                  handleChangeArray(
                    e,
                    "communication&connect",
                    "otherConnection"
                  )
                }
              />
            </Group>{" "}
          </GridCol>
        </>
      )}
    </Grid>
  );
};

export default EditProductInfo;
