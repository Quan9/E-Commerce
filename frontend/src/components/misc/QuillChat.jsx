/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import Quill from "quill";
import { forwardRef, useEffect, useRef, useState } from "react";
import MagicUrl from "quill-magic-url";
import { FileButton, Flex, Tooltip, UnstyledButton } from "@mantine/core";
import { IconPhoto, IconSend2 } from "@tabler/icons-react";
const BlockEmbed = Quill.import("blots/block/embed");

class VideoBlot extends BlockEmbed {
  static blotName = "video";
  static tagName = "iframe";

  static create(url) {
    let node = super.create();
    const a = {
      src: url.getAttribute("src"),
      title: url.getAttribute("title"),
      loading: url.getAttribute("loading"),
    };
    node.setAttribute("src", a.src);
    node.setAttribute("title", a.title);
    node.setAttribute("loading", a.loading);
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", true);
    return node;
  }

  static formats(node) {
    let format = {};
    if (node.hasAttribute("height")) {
      format.height = node.getAttribute("height");
    }
    if (node.hasAttribute("width")) {
      format.width = node.getAttribute("width");
    }
    return format;
  }

  static value(node) {
    node.getAttribute("src");
    return node;
  }

  format(name, value) {
    if (name === "height" || name === "width") {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(VideoBlot);
Quill.register("modules/magicUrl", MagicUrl);
const QuillChat = forwardRef(
  ({ defaultValue, setNewMessage, setDoubleKey, typing, setTyping }, ref) => {
    const [file, setFile] = useState([]);
    const resetRef = useRef([]);
    const clearFile = () => {
      resetRef.current?.();
    };
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const uploadImage = async (data, preset, index) => {
      const formData = new FormData();
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
          if (quill && !focus) {
            const range = quill.getSelection();
            if (preset === "mobileShopPdf") {
              const embedCode = `<iframe title='${data.name}' loading=lazy src='https://docs.google.com/viewer?url=${imgSrc}&embedded=true' ></iframe>`;
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
            setTyping(true);
            // setFileInclude(true);
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
      setTyping(false);
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
          // clipboard: {
          //   matchVisual: false,
          // },
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
      <Flex h={"10%"} gap={"sm"} bg={"white"}>
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
            <IconSend2 fill={!typing ? "gray" : "white"} />
          </UnstyledButton>
        </Tooltip>
      </Flex>
    );
  }
);

QuillChat.displayName = "Editor";

export default QuillChat;
