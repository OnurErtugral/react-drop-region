import * as React from "react";

import "./style.css";

import { getTotalFileSize, getTotalUploadedSize } from "./utils";

const types = [
  "application",
  "audio",
  "font",
  "image",
  "model",
  "text",
  "video",
] as const;

interface IProps {
  children?: React.ReactNode;
  setIsHovering: (isHovering: boolean) => void;
  onDrop?: () => void;
  onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleAcceptedFiles: (files: Array<FileReader | null>) => void;
  handleRejectedFiles?: (files: Array<File | null>) => void;
  readAs:
    | "readAsArrayBuffer"
    | "readAsBinaryString"
    | "readAsDataURL"
    | "readAsText";
  onError?: (ErrorMessage: string) => void;
  handleProgress: (propgress: number) => void;
  allowMultiple?: boolean;
  disable?: boolean;
  allowKeyboard?: boolean;
  allowClick?: boolean;
  validTypes?: Array<typeof types[number]>;
}

function DropZone({
  children = [],
  setIsHovering,
  onDrop,
  onDragEnter,
  onDragLeave,
  handleAcceptedFiles,
  handleRejectedFiles,
  readAs,
  onError,
  handleProgress,
  allowMultiple = true,
  disable = false,
  allowKeyboard = true,
  allowClick = true,
  validTypes = [],
}: IProps) {
  const isHoveringRef = React.useRef<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>();
  const containerRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Enter":
        case " ":
          !disable && inputRef.current?.click();
          break;
      }
    }

    if (allowKeyboard && containerRef.current) {
      containerRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [allowKeyboard, disable]);

  const renderChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {});
    } else {
      return child;
    }
  });

  function verifyFileType(fileType: string) {
    if (validTypes.length === 0) {
      return true;
    }

    for (let index = 0; index < validTypes.length; index++) {
      const validType = validTypes[index];

      if (fileType.includes(validType)) {
        return true;
      }
    }

    return false;
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (disable) {
      return;
    }

    // invoke onDrop callback
    onDrop && onDrop();
    isHoveringRef.current && setIsHovering(false);
    isHoveringRef.current = false;

    let acceptedFiles: Array<FileReader | null> = [];
    let rejectedFiles: Array<File | null> = [];
    const { items } = event.dataTransfer;

    if (items) {
      let files: Array<File | null> = [];
      for (let i = 0; i < (allowMultiple ? items.length : 1); i++) {
        // If dropped items aren't files, skip them
        if (items[i].kind === "file") {
          if (verifyFileType(items[i].type)) {
            files.push(items[i].getAsFile());
          } else {
            rejectedFiles.push(items[i].getAsFile());
          }
        }
      }

      // Get total size of dropped files
      const totalSize = getTotalFileSize(files);

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // Get how much data has been uploaded, we will
        // use this info to calculate progress
        if (file) {
          const totalUploadedSoFar = getTotalUploadedSize(files, i);

          let result = await uplaodFile(file, i, totalSize, totalUploadedSoFar);
          acceptedFiles.push(result);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      const { files } = event.dataTransfer;

      // totalSize will be used to calculate the upload progress
      const totalSize = getTotalFileSize(files);

      for (let i = 0; i < (allowMultiple ? files.length : 1); i++) {
        let file = files[i];

        if (file) {
          if (verifyFileType(file.type)) {
            const totalUploadedSoFar = getTotalUploadedSize(
              Array.from(files),
              i,
            );

            let result = await uplaodFile(
              file,
              i,
              totalSize,
              totalUploadedSoFar,
            );
            acceptedFiles.push(result);
          } else {
            rejectedFiles.push(file);
          }
        }
      }
    }

    handleAcceptedFiles(acceptedFiles);
    handleRejectedFiles && handleRejectedFiles(rejectedFiles);
  }

  async function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    let acceptedFiles: Array<FileReader | null> = [];
    let rejectedFiles: Array<File | null> = [];

    if (files) {
      // Get total size of dropped files
      const totalSize = getTotalFileSize(files);

      for (let i = 0; i < (allowMultiple ? files.length : 1); i++) {
        // If dropped items aren't files, reject them
        let file = files[i];

        if (file) {
          if (verifyFileType(file.type)) {
            const totalUploadedSoFar = getTotalUploadedSize(
              Array.from(files),
              i,
            );

            let result = await uplaodFile(
              file,
              i,
              totalSize,
              totalUploadedSoFar,
            );
            acceptedFiles.push(result);
          } else {
            rejectedFiles.push(file);
          }
        }
      }

      handleAcceptedFiles(acceptedFiles);
      handleRejectedFiles && handleRejectedFiles(rejectedFiles);
    }
  }

  function uplaodFile(
    file: File,
    index: number,
    totalSize: number,
    totalUploadedSoFar: number = 0,
  ): Promise<FileReader | null> {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      fileReader.addEventListener("load", upload => {
        resolve(upload.target);
      });

      fileReader.onprogress = progress => {
        // if it is 100% loaded, do not call handleProgress here
        // it will be called in `fileReader.onloadend`
        progress.loaded !== file.size &&
          handleProgress(
            ((progress.loaded + totalUploadedSoFar) / totalSize) * 100,
          );
      };

      fileReader.onloadend = () => {
        handleProgress(((file.size + totalUploadedSoFar) / totalSize) * 100);
      };

      fileReader.onerror = () => {
        onError &&
          onError(`Something went wrong while uploading file number ${index}.`);
        reject();
      };
      fileReader.onabort = () => {
        onError &&
          onError(`Something went wrong while uploading file number ${index}.`);
        reject();
      };

      fileReader[readAs](file);
    });
  }

  return (
    <div
      ref={el => (containerRef.current = el as HTMLDivElement)}
      style={{
        cursor: allowClick ? (disable ? "default" : "pointer") : "default",
      }}
      onClick={() => {
        if (allowClick && !disable) {
          inputRef.current?.click();
        }
      }}
      onDragEnter={event => {
        if (!isHoveringRef.current && !disable) {
          setIsHovering(true);
          onDragEnter && onDragEnter(event);
        }

        isHoveringRef.current = true;
      }}
      onDragExit={event => {
        if (isHoveringRef.current && !disable) {
          setIsHovering(false);
          onDragLeave && onDragLeave(event);
        }

        isHoveringRef.current = false;
      }}
      onDragLeave={event => {
        if (isHoveringRef.current && !disable) {
          setIsHovering(false);
          onDragLeave && onDragLeave(event);
        }

        isHoveringRef.current = false;
      }}
      onDragOver={event => {
        event.preventDefault();
      }}
      onDrop={handleDrop}
      tabIndex={allowKeyboard ? (disable ? -1 : 0) : -1}
    >
      {renderChildren}

      <input
        ref={el => (inputRef.current = el as HTMLInputElement)}
        style={{ display: "none" }}
        type="file"
        onChange={handleOnChange}
        multiple={allowMultiple ? true : false}
        disabled={disable ? true : false}
      />
    </div>
  );
}

export default DropZone;
