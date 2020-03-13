import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import DropRegion from "./index.tsx";

beforeEach(() => {
  jest.restoreAllMocks();
  jest.resetAllMocks();
});

afterEach(() => {});

it("renders a single child", () => {
  let Child = () => <div className="demo"></div>;

  const wrapper = mount(
    <DropRegion>
      <Child />
    </DropRegion>,
  );

  expect(wrapper.find(Child)).toHaveLength(1);
});

it("renders multiple children", () => {
  let Child = () => <div className="demo"></div>;

  const wrapper = mount(
    <DropRegion>
      <Child />
      <Child />
    </DropRegion>,
  );

  expect(wrapper.find(Child)).toHaveLength(2);
});

it("renders non-valid elements", () => {
  let Child = () => <div className="demo"></div>;

  const wrapper = mount(
    <DropRegion>
      <Child />
      <Child />
      Hi I am a non-valid element.
    </DropRegion>,
  );

  expect(wrapper.find(Child)).toHaveLength(2);
  expect(wrapper.text()).toContain("Hi I am a non-valid element.");
});

it("opens file diolag with click, if 'allowClick' is true", () => {
  let wrapper = mount(<DropRegion></DropRegion>);

  const inputClickSpy = jest.spyOn(HTMLInputElement.prototype, "click");

  wrapper.simulate("click");
  expect(inputClickSpy).toBeCalledTimes(1);

  wrapper = mount(<DropRegion allowClick={false}></DropRegion>);
  wrapper.simulate("click");
  expect(inputClickSpy).toBeCalledTimes(1);
});

it("removes keyboard event listener on component unmount", () => {
  const map = {};
  HTMLDivElement.prototype.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });

  const addEventListenerSpy = jest.spyOn(
    HTMLDivElement.prototype,
    "addEventListener",
  );
  const removeEventListenerSpy = jest.spyOn(
    HTMLDivElement.prototype,
    "removeEventListener",
  );

  let wrapper = mount(<DropRegion allowKeyboard={true} />);
  expect(addEventListenerSpy).toBeCalledTimes(1);
  wrapper.unmount();
  expect(removeEventListenerSpy).toBeCalledTimes(1);
});

it("'tabIndex' is 0, if keyboard is allowed and not disabled", () => {
  let wrapper = mount(<DropRegion />);

  expect(wrapper.find("div").prop("tabIndex")).toBe(0);
});

it("if 'allowKeyboard' is false, 'tabindex' is -1", () => {
  let wrapper = mount(<DropRegion allowKeyboard={false} />);

  expect(wrapper.find("div").prop("tabIndex")).toBe(-1);
});

it("if 'disable' is true, 'tabindex' is -1", () => {
  let wrapper = mount(<DropRegion disable={true} />);

  expect(wrapper.find("div").prop("tabIndex")).toBe(-1);
});

it("if 'allowClick' is false, cursor is 'default'", () => {
  let wrapper = mount(<DropRegion allowClick={false} />);

  expect(wrapper.find("div").prop("style")).toHaveProperty("cursor", "default");
});

it("if 'allowClick' is true, cursor is 'pointer'", () => {
  let wrapper = mount(<DropRegion allowClick={true} />);

  expect(wrapper.find("div").prop("style")).toHaveProperty("cursor", "pointer");
});

it("if 'disable' is true, cursor is 'default'", () => {
  let wrapper = mount(<DropRegion disable={true} />);

  expect(wrapper.find("div").prop("style")).toHaveProperty("cursor", "default");
});

it("opens file diolag with keyboard event, if 'allowKeyboard' is true", () => {
  const map = {};
  HTMLDivElement.prototype.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });

  // Do not allow 'keyPress' event
  let wrapper = mount(<DropRegion allowKeyboard={false}></DropRegion>);

  const inputClickSpy = jest.spyOn(HTMLInputElement.prototype, "click");

  wrapper.simulate("keydown", { key: "Enter" });
  expect(inputClickSpy).toBeCalledTimes(0);

  // Allow 'keyPress' event
  wrapper = mount(<DropRegion allowClick={true}></DropRegion>);

  act(() => {
    map.keydown({ key: "Enter" });
  });
  expect(inputClickSpy).toBeCalledTimes(1);

  act(() => {
    map.keydown({ key: " " });
  });
  expect(inputClickSpy).toBeCalledTimes(2);
});

it("invokes 'setIsHovering' and 'onDragEnter' callbacks upon onDragEnter event", () => {
  const onDragEnter = jest.fn();
  const setIsHovering = jest.fn();

  let wrapper = mount(
    <DropRegion setIsHovering={setIsHovering} onDragEnter={onDragEnter} />,
  );

  wrapper.simulate("dragEnter");

  expect(setIsHovering).toBeCalledWith(true);
  expect(setIsHovering).toBeCalledTimes(1);
  expect(onDragEnter).toBeCalledTimes(1);
});

it("invokes 'setIsHovering' and 'onDragLeave' callbacks upon onDragLeave event", () => {
  const onDragLeave = jest.fn();
  const setIsHovering = jest.fn();

  let wrapper = mount(
    <DropRegion setIsHovering={setIsHovering} onDragLeave={onDragLeave} />,
  );

  wrapper.simulate("dragEnter");
  wrapper.simulate("dragLeave");

  expect(setIsHovering).toBeCalledWith(false);
  // 'setIsHovering' is invoked two times: onDragEnter, and onDragLeave
  expect(setIsHovering).toBeCalledTimes(2);
  expect(onDragLeave).toBeCalledTimes(1);
});

it("invokes 'setIsHovering' and 'onDragLeave' callbacks upon onDragExit event", () => {
  const onDragLeave = jest.fn();
  const setIsHovering = jest.fn();

  let wrapper = mount(
    <DropRegion setIsHovering={setIsHovering} onDragLeave={onDragLeave} />,
  );

  wrapper.simulate("dragEnter");
  wrapper.simulate("dragExit");

  expect(setIsHovering).toBeCalledWith(false);
  // 'setIsHovering' is invoked two times: onDragEnter, and onDragExit
  expect(setIsHovering).toBeCalledTimes(2);
  expect(onDragLeave).toBeCalledTimes(1);
});

it("invokes 'setIsHovering' and 'onDragLeave' callbacks upon onDragLeave event", () => {
  const onDragLeave = jest.fn();
  const setIsHovering = jest.fn();

  let wrapper = mount(
    <DropRegion setIsHovering={setIsHovering} onDragLeave={onDragLeave} />,
  );

  wrapper.simulate("dragEnter");
  wrapper.simulate("dragLeave");

  expect(setIsHovering).toBeCalledWith(false);
  // 'setIsHovering' is invoked two times: onDragEnter, and onDragLeave
  expect(setIsHovering).toBeCalledTimes(2);
  expect(onDragLeave).toBeCalledTimes(1);
});

it("invokes 'onDrop' upon onDrop event", () => {
  const map = {};
  HTMLDivElement.prototype.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });

  const onDrop = jest.fn();
  const setIsHovering = jest.fn();
  const handleAcceptedFiles = jest.fn();

  const wrapper = mount(
    <DropRegion
      onDrop={onDrop}
      setIsHovering={setIsHovering}
      handleAcceptedFiles={handleAcceptedFiles}
    />,
  );

  wrapper.simulate("dragEnter");
  wrapper.simulate("drop", { dataTransfer: { items: [], files: [] } });
  expect(setIsHovering).toBeCalledTimes(2);
  expect(onDrop).toBeCalledTimes(1);
  expect(handleAcceptedFiles).toBeCalledTimes(1);
  expect(handleAcceptedFiles).toBeCalledWith([]);
});

it("does not open file dialog, if 'disable' prop is set to true", () => {
  const map = {};
  HTMLDivElement.prototype.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });

  let disable = true;
  const inputClickSpy = jest.spyOn(HTMLInputElement.prototype, "click");

  let wrapper = mount(<DropRegion disable={disable} />);

  wrapper.simulate("click");
  expect(inputClickSpy).not.toBeCalled();

  act(() => {
    map.keydown({ key: "Enter" });
  });
  expect(inputClickSpy).toBeCalledTimes(0);

  act(() => {
    map.keydown({ key: " " });
  });
  expect(inputClickSpy).toBeCalledTimes(0);
});

it("does not fire onDrag* callbacks, if 'disable' prop is set to true", () => {
  let disable = true;

  const onDragEnter = jest.fn();
  const onDragLeave = jest.fn();
  const onDrop = jest.fn();
  const setIsHovering = jest.fn();

  let wrapper = mount(
    <DropRegion
      disable={disable}
      setIsHovering={setIsHovering}
      onDragLeave={onDragLeave}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
    />,
  );

  wrapper.simulate("dragEnter");
  expect(setIsHovering).not.toBeCalled();
  wrapper.simulate("dragLeave");
  expect(setIsHovering).not.toBeCalled();

  wrapper.simulate("dragEnter");
  expect(setIsHovering).not.toBeCalled();
  wrapper.simulate("dragExit");
  expect(setIsHovering).not.toBeCalled();

  wrapper.simulate("dragEnter");
  expect(setIsHovering).not.toBeCalled();
  wrapper.simulate("drop");
  expect(setIsHovering).not.toBeCalled();
});

it("calls 'preventDefault' onDragOver", () => {
  let wrapper = mount(<DropRegion />);

  let preventDefaultMock = jest.fn();
  wrapper.simulate("dragOver", { preventDefault: preventDefaultMock });
  expect(preventDefaultMock).toBeCalledTimes(1);
});

describe("'readAs' property", () => {
  const flushPromises = () => new Promise(window.setImmediate);

  it("readAsArrayBuffer ", async () => {
    const readAsArrayBufferSpy = jest.spyOn(
      FileReader.prototype,
      "readAsArrayBuffer",
    );
    jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        readAs="readAsArrayBuffer"
      />,
    );

    wrapper.find("input").simulate("change", {
      target: {
        files: [new File([], "myFile.png", { type: "image/png" })],
      },
    });

    await flushPromises();

    expect(readAsArrayBufferSpy).toBeCalledTimes(1);

    expect(handleAcceptedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toBeCalledTimes(1);
  });

  it("readAsText ", async () => {
    const readAsTextSpy = jest.spyOn(FileReader.prototype, "readAsText");
    jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        readAs="readAsText"
      />,
    );

    wrapper.find("input").simulate("change", {
      target: {
        files: [new File([], "myFile.png", { type: "image/png" })],
      },
    });

    await flushPromises();

    expect(readAsTextSpy).toBeCalledTimes(1);

    expect(handleAcceptedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toBeCalledTimes(1);
  });
});

describe("with click event: ", () => {
  const flushPromises = () => new Promise(window.setImmediate);

  it("uploads a single file, if 'allowMultiple' is false", async () => {
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const onloadSpy = jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        allowMultiple={false}
        readAs="readAsDataURL"
      />,
    );

    wrapper.find("input").simulate("change", {
      target: {
        files: [
          new File([], "myFile.png", { type: "image/png" }),
          new File([], "myFile.png", { type: "image/png" }),
        ],
      },
    });

    await flushPromises();

    expect(readAsDataURLSpy).toBeCalledTimes(1);
    expect(onloadSpy).toBeCalledTimes(1);

    expect(handleAcceptedFiles).toBeCalledTimes(1);

    expect(handleRejectedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toHaveBeenCalledWith([]);
  });

  it("uploads multiple files, if 'allowMultiple' is true", async () => {
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const onloadSpy = jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        allowMultiple={true}
        readAs="readAsDataURL"
      />,
    );

    wrapper.find("input").simulate("change", {
      target: {
        files: [
          new File([], "myFile.png", { type: "image/png" }),
          new File([], "myFile.png", { type: "image/png" }),
        ],
      },
    });

    await flushPromises();

    expect(readAsDataURLSpy).toBeCalledTimes(2);
    expect(onloadSpy).toBeCalledTimes(2);

    expect(handleAcceptedFiles).toBeCalledTimes(1);

    expect(handleRejectedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toHaveBeenCalledWith([]);
  });

  it("rejects files, if file extention does not match with 'validTypes'", async () => {
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const onloadSpy = jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        allowMultiple={true}
        readAs="readAsDataURL"
        validTypes={["image/"]}
      />,
    );

    const imageFile = new File([], "myFile.png", { type: "image/png" });
    const pdfFile = new File([], "myFile.pdf", { type: "application/pdf" });

    wrapper.find("input").simulate("change", {
      target: {
        files: [imageFile, pdfFile, pdfFile],
      },
    });

    await flushPromises();

    expect(readAsDataURLSpy).toBeCalledTimes(1);
    expect(onloadSpy).toBeCalledTimes(1);

    expect(handleAcceptedFiles).toBeCalledTimes(1);

    expect(handleRejectedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toHaveBeenCalledWith([pdfFile, pdfFile]);
  });
});

describe("with drag & drop event and 'dataTransfer.items: ", () => {
  const flushPromises = () => new Promise(window.setImmediate);

  it("uploads a single file, if 'allowMultiple' is false", async () => {
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const onloadSpy = jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const onDrop = jest.fn();
    const setIsHovering = jest.fn();
    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        setIsHovering={setIsHovering}
        onDrop={onDrop}
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        allowMultiple={false}
        readAs="readAsDataURL"
      />,
    );

    wrapper.simulate("drop", {
      dataTransfer: {
        files: [],
        items: [
          new File([], "myFile.png", { type: "image/png" }),
          new File([], "myFile.png", { type: "image/png" }),
        ].map(file => ({
          kind: "file",
          type: file.type,
          getAsFile: () => file,
        })),
      },
    });

    await flushPromises();

    expect(readAsDataURLSpy).toBeCalledTimes(1);
    expect(onloadSpy).toBeCalledTimes(1);

    expect(handleAcceptedFiles).toBeCalledTimes(1);

    expect(handleRejectedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toHaveBeenCalledWith([]);
  });

  it("uploads multiple files, if 'allowMultiple' is true", async () => {
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const onloadSpy = jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        allowMultiple={true}
        readAs="readAsDataURL"
      />,
    );

    wrapper.simulate("drop", {
      dataTransfer: {
        files: [],
        items: [
          new File([], "myFile.png", { type: "image/png" }),
          new File([], "myFile.png", { type: "image/png" }),
        ].map(file => ({
          kind: "file",
          type: file.type,
          getAsFile: () => file,
        })),
      },
    });

    await flushPromises();

    expect(readAsDataURLSpy).toBeCalledTimes(2);
    expect(onloadSpy).toBeCalledTimes(2);

    expect(handleAcceptedFiles).toBeCalledTimes(1);

    expect(handleRejectedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toHaveBeenCalledWith([]);
  });

  it("rejects files, if file extention does not match with 'validTypes'", async () => {
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const onloadSpy = jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        allowMultiple={true}
        readAs="readAsDataURL"
        validTypes={["image/"]}
      />,
    );

    const imageFile = new File([], "myFile.png", { type: "image/png" });
    const pdfFile = new File([], "myFile.pdf", { type: "application/pdf" });

    wrapper.simulate("drop", {
      dataTransfer: {
        files: [],
        items: [imageFile, pdfFile, pdfFile].map(file => ({
          kind: "file",
          type: file.type,
          getAsFile: () => file,
        })),
      },
    });

    await flushPromises();

    expect(readAsDataURLSpy).toBeCalledTimes(1);
    expect(onloadSpy).toBeCalledTimes(1);

    expect(handleAcceptedFiles).toBeCalledTimes(1);

    expect(handleRejectedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toHaveBeenCalledWith([pdfFile, pdfFile]);
  });
});

describe("with drag & drop event and 'dataTransfer.files: ", () => {
  const flushPromises = () => new Promise(window.setImmediate);

  it("uploads a single file, if 'allowMultiple' is false", async () => {
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const onloadSpy = jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const onDrop = jest.fn();
    const setIsHovering = jest.fn();
    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        setIsHovering={setIsHovering}
        onDrop={onDrop}
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        allowMultiple={false}
        readAs="readAsDataURL"
      />,
    );

    wrapper.simulate("drop", {
      dataTransfer: {
        files: [
          new File([], "myFile.png", { type: "image/png" }),
          new File([], "myFile.png", { type: "image/png" }),
        ],
      },
    });

    await flushPromises();

    expect(readAsDataURLSpy).toBeCalledTimes(1);
    expect(onloadSpy).toBeCalledTimes(1);

    expect(handleAcceptedFiles).toBeCalledTimes(1);

    expect(handleRejectedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toHaveBeenCalledWith([]);
  });

  it("uploads multiple files, if 'allowMultiple' is true", async () => {
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const onloadSpy = jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        allowMultiple={true}
        readAs="readAsDataURL"
      />,
    );

    wrapper.simulate("drop", {
      dataTransfer: {
        files: [
          new File([], "myFile.png", { type: "image/png" }),
          new File([], "myFile.png", { type: "image/png" }),
        ],
      },
    });

    await flushPromises();

    expect(readAsDataURLSpy).toBeCalledTimes(2);
    expect(onloadSpy).toBeCalledTimes(2);

    expect(handleAcceptedFiles).toBeCalledTimes(1);

    expect(handleRejectedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toHaveBeenCalledWith([]);
  });

  it("rejects files, if file extention does not match with 'validTypes'", async () => {
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const onloadSpy = jest
      .spyOn(FileReader.prototype, "addEventListener")
      .mockImplementation((type, upload) => {
        upload({ target: {} });
      });

    const handleAcceptedFiles = jest.fn();
    const handleRejectedFiles = jest.fn();

    let wrapper = mount(
      <DropRegion
        handleAcceptedFiles={handleAcceptedFiles}
        handleRejectedFiles={handleRejectedFiles}
        allowMultiple={true}
        readAs="readAsDataURL"
        validTypes={["image/"]}
      />,
    );

    const imageFile = new File([], "myFile.png", { type: "image/png" });
    const pdfFile = new File([], "myFile.pdf", { type: "application/pdf" });

    wrapper.simulate("drop", {
      dataTransfer: {
        files: [imageFile, pdfFile, pdfFile],
      },
    });

    await flushPromises();

    expect(readAsDataURLSpy).toBeCalledTimes(1);
    expect(onloadSpy).toBeCalledTimes(1);

    expect(handleAcceptedFiles).toBeCalledTimes(1);

    expect(handleRejectedFiles).toBeCalledTimes(1);
    expect(handleRejectedFiles).toHaveBeenCalledWith([pdfFile, pdfFile]);
  });
});
