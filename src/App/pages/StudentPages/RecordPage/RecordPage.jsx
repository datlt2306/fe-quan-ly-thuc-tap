import React, { useState } from "react";

const DOCXUploadPreview = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textContent, setTextContent] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      readDocxFile(file);
    } else {
      setTextContent("");
    }
  };

  const readDocxFile = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      const buffer = new Uint8Array(arrayBuffer);
      const docText = parseDocx(buffer);
      setTextContent(docText);
    };
    reader.readAsArrayBuffer(file);
  };

  const parseDocx = (buffer) => {
    const zip = new JSZip();
    const docx = zip.loadAsync(buffer);

    return docx
      .then((zip) => {
        const content = zip.file("word/document.xml").async("string");
        return content;
      })
      .then((content) => {
        const doc = new DOMParser().parseFromString(content, "text/xml");
        const paragraphs = doc.getElementsByTagName("w:p");
        let text = "";
        for (let i = 0; i < paragraphs.length; i++) {
          const paragraph = paragraphs[i];
          const texts = paragraph.getElementsByTagName("w:t");
          for (let j = 0; j < texts.length; j++) {
            const textNode = texts[j].textContent;
            text += textNode + " ";
          }
          text += "\n";
        }
        return text;
      })
      .catch((error) => {
        console.error(error);
        return "";
      });
  };

  const renderPreview = () => {
    if (textContent) {
      return <pre>{textContent}</pre>;
    } else {
      return <div>No file selected.</div>;
    }
  };

  return (
    <div>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      {renderPreview()}
    </div>
  );
};

export default DOCXUploadPreview;
