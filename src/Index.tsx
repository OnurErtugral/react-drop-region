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

    // invoke onDrop callback
    onDrop();
    isHoveringRef.current && setIsHovering(false);
    isHoveringRef.current = false;

    let fileReaderResults: Array<FileReader | null> = [];
    const { items } = event.dataTransfer;

    if (items) {
      let files: Array<File | null> = [];
      for (let i = 0; i < items.length; i++) {
        // If dropped items aren't files, reject them
        if (items[i].kind === "file") {
          files.push(items[i].getAsFile());
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
          fileReaderResults.push(result);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      const { files } = event.dataTransfer;
      const totalSize = getTotalFileSize(files);

      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (file) {
          const totalUploadedSoFar = getTotalUploadedSize(Array.from(files), i);

          let result = await uplaodFile(file, i, totalSize, totalUploadedSoFar);
          fileReaderResults.push(result);
        }
      }
    }

    handleFiles(fileReaderResults);
  }

  async function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    let fileReaderResults: Array<FileReader | null> = [];

    if (files) {
      // Get total size of dropped files
      const totalSize = getTotalFileSize(files);

      for (let i = 0; i < files.length; i++) {
        // If dropped items aren't files, reject them
        let file = files[i];

        if (file) {
          const totalUploadedSoFar = getTotalUploadedSize(Array.from(files), i);

          let result = await uplaodFile(file, i, totalSize, totalUploadedSoFar);
          fileReaderResults.push(result);
        }
      }

      handleFiles(fileReaderResults);
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

      fileReader.onload = upload => {
        resolve(upload.target);
      };

      fileReader.onprogress = progress => {
        handleProgress(
          ((progress.loaded + totalUploadedSoFar) / totalSize) * 100,
        );
      };

      fileReader.onloadend = () => {
        handleProgress(((file.size + totalUploadedSoFar) / totalSize) * 100);
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

  function getTotalFileSize(files: Array<File | null> | FileList) {
    let totalSize: number = 0;

    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      totalSize += element ? element.size : 0;
    }

    return totalSize;
  }

  function getTotalUploadedSize(files: Array<File | null>, i: number) {
    return files
      .slice(0, i)
      .map(file => (file ? file.size : 0))
      .reduce((t, v) => t + v, 0);
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
