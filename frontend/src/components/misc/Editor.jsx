/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import Quill from "quill";
import axios from "axios";
const Editor = forwardRef(({ defaultValue, setData, onTextChange }, ref) => {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);
  const onTextChangeRef = useRef(onTextChange);
  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
  });
  const toolbarOptions = [
    ["bold", "italic"],
    ["link", "image"],
  ];
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const formData = new FormData();
        formData.append("file", input.files[0]);
        formData.append("upload_preset", "MobileShop");
        axios
          .post(
            "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
            formData
          )
          .then((res) => {
            const imgSrc = res.data.url;
            const quill = ref.current;
            if (quill) {
              const range = quill.getSelection();
              range && quill.insertEmbed(range.index, "image", imgSrc);
            }
          });
      }
    };
  }, []);
  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const quill = new Quill(editorContainer, {
      theme: "snow",
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: { image: imageHandler },
        },
      },
    });

    ref.current = quill;
    if (defaultValueRef.current) {
      const delta = quill.clipboard.convert({ html: defaultValueRef.current });
      quill.setContents(delta);
    }
    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      onTextChangeRef.current(quill.root.innerHTML);
    });
    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  return <div ref={containerRef}></div>;
});

Editor.displayName = "Editor";

export default Editor;
