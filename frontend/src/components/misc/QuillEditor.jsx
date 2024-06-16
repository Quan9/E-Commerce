/* eslint-disable react/prop-types */
import { forwardRef, useCallback, useEffect, useRef } from "react";
import Quill from "quill";
import axios from "axios";

// Editor is an uncontrolled React component
const QuillEditor = forwardRef(({ defaultValue, setData }, ref) => {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "true");
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
  const toolbarOptions = {
    container: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["image", "formula", "link"],

      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

      [{ header: 1 }, { header: 2 }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      [{ size: [] }],
      ["clean"],
    ], // remove formatting button

    handlers: { image: imageHandler },
  };
  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const quill = new Quill(editorContainer, {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions,
      },
      placeholder: "Enter text...",
    });

    ref.current = quill;
    if (defaultValueRef.current) {
      const delta = quill.clipboard.convert({ html: defaultValueRef.current });
      quill.setContents(delta);
    }
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setData((prev) => ({
        ...prev,
        ["desc"]: quill.root.innerHTML,
      }));
    });
    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  return <div ref={containerRef} className="quill"></div>;
});

QuillEditor.displayName = "Editor";

export default QuillEditor;
