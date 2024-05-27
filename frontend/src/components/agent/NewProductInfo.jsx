/* eslint-disable react/prop-types */
import { Group, MultiSelect, Select, TextInput, Title } from "@mantine/core";
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
const NewProductInfo = (props) => {
  const { data, setData } = props;
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
  /*
  generalInfo,ram, 
  
  */
  /*
 connect -> slot : simSlot, type : simType , support : networkSupport, other : otherConnection
 batteryCharge : battery
backCamera -> singleRearCamera : cameraRear , mainCamera: 
 */
  return (
    <>
      {/* generalInfo */}
      <Title order={4} ta={"center"}>
        General Info
      </Title>
      <Group justify="center" align="center" mb={"md"}>
        <Select
          placeholder="Select an option"
          label="Brand"
          data={dataBrand}
          onChange={(e) => handleChange(e, "productInfo", "brand")}
        />
        <Select
          placeholder="Select Option"
          data={data2}
          label="Manufacturer"
          onChange={(e) => handleChange(e, "productInfo", "manufacturer")}
        />
        <DateInput
          label="Release Date"
          valueFormat="YYYY MMM DD"
          placeholder="Date input"
          onChange={(e) => handleChange(e, "productInfo", "releaseDate")}
        />
        <Select
          placeholder="Select Option"
          data={dataMonth}
          label="Insurance"
          onChange={(e) => handleChange(e, "productInfo", "insurance")}
        />
        <Select
          placeholder="Select Option"
          data={dataManual}
          label="Manual"
          onChange={(e) => handleChange(e, "productInfo", "manual")}
        />
        <Select
          placeholder="Select Option"
          data={dataInstruction}
          label="Instruction"
          onChange={(e) => handleChange(e, "productInfo", "instruction")}
        />
      </Group>

      {/* Ram */}
      <Title order={4} ta={"center"}>
        Ram
      </Title>
      <Group justify="center" align="center" mb={"md"}>
        <TextInput
          placeholder="Input"
          label="RAM"
          onChange={(e) => handleChange(e.currentTarget.value, "ram", "ram")}
        />
        <TextInput
          placeholder="Input"
          label="RAM Type"
          onChange={(e) =>
            handleChange(e.currentTarget.value, "ram", "ramType")
          }
        />
      </Group>
      {data.categories !== "Laptop" && (
        <>
          {/* Back Camera */}
          <Title order={4} ta={"center"}>
            Back Camera
          </Title>
          <Group justify="center" align="center" mb={"md"}>
            <Select
              data={dataBackCamera}
              label="Camera rear(s)"
              placeholder="Select camera rear"
              onChange={(e) => handleChange(e, "backCamera", "cameraRear")}
            />
            {data?.systeminfo?.backCamera?.cameraRear && (
              <>
                <Select
                  data={dataCameraRes}
                  label="Main Camera"
                  placeholder="Select option"
                  onChange={(e) => handleChange(e, "backCamera", "mainCamera")}
                />
                {!data?.systeminfo?.backCamera?.cameraRear.includes(
                  "Single"
                ) && (
                  <Select
                    data={dataCameraRes}
                    label="Support Camera"
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
                    label="2nd Support Camera"
                    placeholder="Select option"
                    onChange={(e) =>
                      handleChange(e, "backCamera", "supportCamera2")
                    }
                  />
                )}
                <MultiSelect
                  data={data2}
                  label="Camera Film"
                  onChange={(e) => handleChangeArray(e, "backCamera", "film")}
                />
                <MultiSelect
                  data={data2}
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
              placeholder="Select camera rear"
              onChange={(e) => handleChange(e, "selfie", "cameraRear")}
            />
            {data?.systeminfo?.selfie?.cameraRear && (
              <>
                <Select
                  data={dataCameraRes}
                  label="Main Camera"
                  placeholder="Select option"
                  onChange={(e) => handleChange(e, "selfie", "mainCamera")}
                />
                {!data?.systeminfo?.selfie?.cameraRear.includes("Single") && (
                  <Select
                    data={dataCameraRes}
                    label="Support Camera"
                    placeholder="Select option"
                    onChange={(e) => handleChange(e, "selfie", "supportCamera")}
                  />
                )}
                {data?.systeminfo?.selfie?.cameraRear.includes("Triple") && (
                  <Select
                    data={dataCameraRes}
                    label="2nd Support Camera"
                    placeholder="Select option"
                    onChange={(e) =>
                      handleChange(e, "selfie", "supportCamera2")
                    }
                  />
                )}
                <MultiSelect
                  data={data2}
                  label="Camera Film"
                  onChange={(e) => handleChangeArray(e, "selfie", "film")}
                />
                <MultiSelect
                  data={data2}
                  label="Camera Function"
                  onChange={(e) => handleChangeArray(e, "selfie", "function")}
                />
              </>
            )}
          </Group>

          {/* Battery & Charge */}
          <Title order={4} ta={"center"}>
            Battery & Charge
          </Title>
          <Group justify="center" align="center" mb={"md"}>
            <Select
              data={dataCameraRes}
              label="Battery Type"
              onChange={(e) => handleChange(e, "batteryCharger", "batteryType")}
            />
            <Select
              data={dataCameraRes}
              label="Battery Capacity"
              onChange={(e) =>
                handleChange(e, "batteryCharger", "batteryCapacity")
              }
            />
            <MultiSelect
              data={dataCameraRes}
              label="Battery Technology"
              onChange={(e) =>
                handleChangeArray(e, "batteryCharger", "batteryTechnology")
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
              label="Internal memory"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "storage", "internal")
              }
            />
            <TextInput
              placeholder="Input"
              label="Contact Memory"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "storage", "contact")
              }
            />
            <TextInput
              placeholder="Input"
              label="External Memory Card"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "storage", "external")
              }
            />
          </Group>

          {/* Screen */}
          <Title order={4} ta={"center"}>
            Screen
          </Title>
          <Group justify="center" align="center" mb={"md"}>
            <TextInput
              placeholder="Input"
              label="Screen Size"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "screen", "size")
              }
            />
            <TextInput
              placeholder="Input"
              label="Screen Color"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "screen", "color")
              }
            />
            <TextInput
              placeholder="Input"
              label="Touch Type"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "screen", "touch")
              }
            />
            <TextInput
              placeholder="Input"
              label="Aspect ratio"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "screen", "ratio")
              }
            />
            <TextInput
              placeholder="Input"
              label="Screen tech"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "screen", "tech")
              }
            />
            <TextInput
              placeholder="Input"
              label="Standard Screen"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "screen", "standard")
              }
            />
            <TextInput
              placeholder="Input"
              label="Resolution"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "screen", "resolution")
              }
            />
            <TextInput
              placeholder="Input"
              label="Scan Frequency"
              onChange={(e) =>
                handleChange(e.currentTarget.value, "screen", "scanFrequency")
              }
            />
          </Group>
        </>
      )}
      {/* Operating System */}
      <Title order={4} ta={"center"}>
        Operating System
      </Title>
      <Group justify="center" align="center" mb={"md"}>
        <Select
          placeholder="Select an option"
          data={dataCameraRes}
          label="OS"
          onChange={(e) => handleChange(e, "operatingSystem", "OS")}
        />
        <Select
          placeholder="Select an option"
          data={dataCameraRes}
          label="Version"
          onChange={(e) => handleChange(e, "operatingSystem", "Version")}
        />
      </Group>
      {/* Communication & Connect */}
      <Title order={4} ta={"center"}>
        Communication & Connect
      </Title>
      <Group justify="center" align="center" mb={"md"}>
        <Select
          placeholder="Select an option"
          data={dataMaterial}
          label="Sim Slot"
          onChange={(e) => handleChange(e, "connect", "simSlot")}
        />
        <Select
          placeholder="Select an option"
          data={dataMaterial}
          label="Sim Type"
          onChange={(e) => handleChange(e, "connect", "simType")}
        />
        <Select
          placeholder="Select an option"
          data={dataMaterial}
          label="Bluetooth"
          onChange={(e) => handleChange(e, "connect", "bluetooth")}
        />
        <MultiSelect
          placeholder="Select options"
          data={dataMaterial}
          label="Network Support"
          onChange={(e) => handleChangeArray(e, "connect", "networkSupport")}
        />
        <Select
          placeholder="Select an option"
          data={dataMaterial}
          label="Charge port"
          onChange={(e) => handleChange(e, "connect", "port")}
        />
        <MultiSelect
          placeholder="Select options"
          data={dataMaterial}
          label="Wifi"
          onChange={(e) => handleChangeArray(e, "connect", "wifi")}
        />
        <Select
          placeholder="Select an option"
          data={dataMaterial}
          label="GPS"
          onChange={(e) => handleChange(e, "connect", "gps")}
        />
        <MultiSelect
          placeholder="Select options"
          data={dataMaterial}
          label="Other connection"
          onChange={(e) => handleChangeArray(e, "connect", "otherConnection")}
        />
      </Group>
    </>
  );
};

export default NewProductInfo;
