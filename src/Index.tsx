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
  allowMultiple?: boolean;
  disable?: boolean;
}

function DropZone({
  children = [],
  setIsHovering,
  onDrop,
  handleFiles,
  readAs,
  onError,
  handleProgress,
  allowMultiple = true,
  disable = false,
}: IProps) {
  const isHoveringRef = React.useRef<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>();
  const containerRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Enter":
        case " ":
          inputRef.current?.click();
          break;
      }
    }

    if (containerRef.current) {
      containerRef.current.addEventListener("keydown", handleKeyDown);
    }
  }, []);

  const renderChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {});
    } else {
      return child;
    }
  });

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (disable) {
      return;
    }

    // invoke onDrop callback
    onDrop();
    isHoveringRef.current && setIsHovering(false);
    isHoveringRef.current = false;

    let fileReaderResults: Array<FileReader | null> = [];
    const { items } = event.dataTransfer;

    if (items) {
      let files: Array<File | null> = [];
      for (let i = 0; i < (allowMultiple ? items.length : 1); i++) {
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

      for (let i = 0; i < (allowMultiple ? files.length : 1); i++) {
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
      ref={el => (containerRef.current = el as HTMLDivElement)}
      onClick={() => {
        inputRef.current?.click();
      }}
      onDragEnter={() => {
        !isHoveringRef.current && !disable && setIsHovering(true);
        isHoveringRef.current = true;
      }}
      onDragExit={() => {
        isHoveringRef.current && !disable && setIsHovering(false);
        isHoveringRef.current = false;
      }}
      onDragLeave={() => {
        isHoveringRef.current && !disable && setIsHovering(false);
        isHoveringRef.current = false;
      }}
      onDragOver={event => {
        event.preventDefault();
      }}
      onDrop={handleDrop}
      tabIndex={0}
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
