import * as React from "react";

import "./style.css";

interface IProps {
  children?: React.ReactNode;
  setIsHovering: (isHovering: boolean) => void;
  onDrop: () => void;
  handleFiles: (files: any) => void;
  readAs:
    | "readAsArrayBuffer"
    | "readAsBinaryString"
    | "readAsDataURL"
    | "readAsText";
  onError: (ErrorMessage: string) => void;
  handleProgress: (propgress: number) => void;
}

function DropZone({
  children = [],
  setIsHovering,
  onDrop,
  handleFiles,
  readAs,
  onError,
  handleProgress,
}: IProps) {
  const isHoveringRef = React.useRef<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>();

  const renderChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {});
    } else {
      return child;
    }
  });

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    // invoke onDrop callback prop
    onDrop();
    isHoveringRef.current && setIsHovering(false);
    isHoveringRef.current = false;

    const { items } = event.dataTransfer;
    let results: Array<FileReader | null> = [];

    if (event.dataTransfer.items) {
      for (let i = 0; i < items.length; i++) {
        // If dropped items aren't files, reject them
        if (items[i].kind === "file") {
          let file = items[i].getAsFile();

          if (file) {
            let result = await uplaodFile(file, i);
            results.push(result);
          }
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      const { files } = event.dataTransfer;

      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (file) {
          let result = await uplaodFile(file, i);
          results.push(result);
        }
      }
    }

    handleFiles(results);
  }

  async function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    let results: Array<FileReader | null> = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        // If dropped items aren't files, reject them
        let file = files[i];

        if (file) {
          let result = await uplaodFile(file, i);
          results.push(result);
        }
      }
      handleFiles(results);
    }
  }

  function uplaodFile(file: File, index: number): Promise<FileReader | null> {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      fileReader.onload = upload => {
        resolve(upload.target);
      };

      // (event.loaded / event.total) * 100
      fileReader.onprogress = progress => {
        handleProgress(progress.loaded);
      };

      fileReader.onerror = () => {
        onError(`Something went wrong while uploading file number ${index}.`);
        reject();
      };
      fileReader.onabort = () => {
        onError(`Something went wrong while uploading file number ${index}.`);
        reject();
      };

      fileReader[readAs](file);
    });
  }

  return (
    <div
      onClick={() => {
        inputRef.current?.click();
      }}
      onDragEnter={() => {
        !isHoveringRef.current && setIsHovering(true);
        isHoveringRef.current = true;
      }}
      onDragExit={() => {
        isHoveringRef.current && setIsHovering(false);
        isHoveringRef.current = false;
      }}
      onDragLeave={() => {
        isHoveringRef.current && setIsHovering(false);
        isHoveringRef.current = false;
      }}
      onDragOver={event => {
        event.preventDefault();
      }}
      onDrop={handleDrop}
    >
      {renderChildren}

      <input
        ref={el => (inputRef.current = el as HTMLInputElement)}
        style={{ display: "none" }}
        type="file"
        onChange={handleOnChange}
        multiple
      />
    </div>
  );
}

export default DropZone;
