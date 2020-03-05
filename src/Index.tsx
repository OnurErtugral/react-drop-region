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

  const renderChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {});
    } else {
      return child;
    }
  });

  return (
    <div
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
      onDrop={event => {
        onDrop();
        isHoveringRef.current && setIsHovering(false);
        isHoveringRef.current = false;

        event.preventDefault();

        if (event.dataTransfer.items) {
          let results: Array<FileReader | null> = [];

          for (let i = 0; i < event.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (event.dataTransfer.items[i].kind === "file") {
              let file = event.dataTransfer.items[i].getAsFile();

              let fileReader = new FileReader();

              fileReader.onload = upload => {
                results.push(upload.target);
              };

              // (event.loaded / event.total) * 100
              fileReader.onprogress = progress => {
                handleProgress(progress.loaded);
              };

              fileReader.onerror = () => {
                onError(
                  `Something went wrong while uploading file number ${i}.`,
                );
              };
              fileReader.onabort = () => {
                onError(
                  `Something went wrong while uploading file number ${i}.`,
                );
              };

              if (file) {
                fileReader[readAs](file);
              }
            }
          }
          handleFiles(results);
        } else {
          // Use DataTransfer interface to access the file(s)
          for (let i = 0; i < event.dataTransfer.files.length; i++) {
            // TODO
          }
        }
      }}
    >
      {renderChildren}
    </div>
  );
}

export default DropZone;
