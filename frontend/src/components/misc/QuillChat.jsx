/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import Quill from "quill";
import { forwardRef, useEffect, useRef, useState } from "react";
import MagicUrl from "quill-magic-url";
import {
  FileButton,
  Flex,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconMessage, IconPhoto } from "@tabler/icons-react";
Quill.register("modules/magicUrl", MagicUrl);
const QuillChat = forwardRef(
  ({ defaultValue, setNewMessage, setDoubleKey, typing }, ref) => {
    const [file, setFile] = useState([]);
    const resetRef = useRef([]);
    const clearFile = () => {
      resetRef.current?.();
    };
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);

    const uploadImage = async (data, preset, index) => {
      const formData = new FormData();
      console.log("in map");
      formData.append("file", data);
      formData.append("upload_preset", preset);
      await axios
        .post(
          "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
          formData
        )
        .then((res) => {
          const imgSrc = res.data.url;
          const quill = ref.current;
          const focus = quill.focus();
          console.log(res.data.url);
          if (quill && !focus) {
            const range = quill.getSelection();
            if (preset === "mobileShopPdf") {
              const embedCode = `<iframe src='${imgSrc}'></iframe>`;
              range &&
                quill.clipboard.dangerouslyPasteHTML(range.index, embedCode);
            } else {
              range && quill.insertEmbed(range.index, "image", imgSrc);
            }
          }
        })
        .then(() => {
          if (index === file.length - 1) {
            setFile([]);
          }
        });
    };
    useEffect(() => {
      ref.current?.enable(typing);
    }, [ref, typing]);
    useEffect(() => {
      const handle = () => {
        if (file.length !== 0) {
          imageHandle();
        } else {
          clearFile();
        }
      };
      handle();
    }, [file]);
    const imageHandle = async () => {
      file.map(async (file, index) => {
        if (file.type === "application/pdf") {
          await uploadImage(file, "mobileShopPdf", index);
        } else {
          await uploadImage(file, "mobileShop", index);
        }
      });
    };
    const handleDoubleKey = () => {
      setDoubleKey(true);
    };
    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        theme: "snow",
        modules: {
          toolbar: false,
          magicUrl: true,
          clipboard: {
            matchVisual: false,
          },
        },
        placeholder: "Enter Message ...",
      });
      ref.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }
      quill.root.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
          handleDoubleKey();
        }
      });
      quill.on("text-change", () => {
        setNewMessage(quill.root.innerHTML);
      });
      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref]);

    return (
      <Flex
        h={"10vh"}
        gap={"sm"}
        bg={'white'}
      >
        <div ref={containerRef} className="quill-chat"></div>
        <FileButton
          onChange={setFile}
          multiple
          resetRef={resetRef}
          accept="image/png,image/jpeg,application/pdf"
          disabled={!typing}
        >
          {(props) => (
            <Tooltip label="Upload File" disabled={!typing}>
              <UnstyledButton {...props} disabled={!typing}>
                <IconPhoto fill={!typing ? "gray" : "white"} />
              </UnstyledButton>
            </Tooltip>
          )}
        </FileButton>
        <Tooltip label="Submit (Cntrl+Enter)" disabled={!typing}>
          <UnstyledButton onClick={handleDoubleKey} disabled={!typing}>
            <IconMessage fill={!typing ? "gray" : "white"} />
          </UnstyledButton>
        </Tooltip>
      </Flex>
    );
  }
);

QuillChat.displayName = "Editor";

export default QuillChat;
