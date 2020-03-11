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

it("opens file diolag with click if 'allowClick' is true", () => {
  let wrapper = mount(<DropRegion></DropRegion>);

  const inputClickSpy = jest.spyOn(HTMLInputElement.prototype, "click");

  wrapper.simulate("click");
  expect(inputClickSpy).toBeCalledTimes(1);

  wrapper = mount(<DropRegion allowClick={false}></DropRegion>);
  wrapper.simulate("click");
  expect(inputClickSpy).toBeCalledTimes(1);
});

it("opens file diolag with keyboard event if 'allowKeyboard' is true", () => {
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

  //   console.log(wrapper.debug());
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
