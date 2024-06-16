import { useRef, useState } from "react";
import {QuillEditor} from "../../../components";
import { toast } from "react-toastify";
import { Button } from "@mantine/core";
const Example = () => {
  const quillRef = useRef();
  const [data, setData] = useState({
    desc: "<p>Hello World!</p>  <p>Some initial <strong>bold <3 </strong> text <3 <3</p>  <p><br></p>",
  });
  return (
    <>
      <Button
        onClick={() =>
          toast.success("Product Updated Successfully", {
            position: "top-right",
          })
        }
      ></Button>
      <QuillEditor ref={quillRef} defaultValue={data.desc} setData={setData} />
    </>
  );
};

export default Example;
