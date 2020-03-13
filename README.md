<div align="center">
<h1>React Drop Region</h1>

<p align="center">
  <a href="https://codesandbox.io/s/flamboyant-wilson-yelm8"><img src="https://raw.githubusercontent.com/OnurErtugral/react-drop-region/master/assets/react-drop-region.gif" /></a>
</p>

<p align="middle">
  <i>Click above to play with <b>the live demo</b>.</i>
</p>

<p align="middle">
    A lightweight and type-safe React component to upload files with Drag & Drop.
</p>

</div>

## Installation

```
npm install react-drop-region
```

or

```
yarn add react-drop-region
```

## Usage

<b>Live demo:</b> <a href="https://codesandbox.io/s/flamboyant-wilson-yelm8">CodeSandbox</a>

```js
import DropRegion from "react-drop-region";

export default function DropRegionDemo() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <DropRegion
      setIsHovering={isHovering => {
        setIsHovering(isHovering);
      }}
      handleAcceptedFiles={files => {
        console.log("Accepted files: ", files);
      }}
    >
      <div
        className="drop-region"
        style={{ height: 150, width: 300, border: "2px dashed hotpink" }}
      >
        {isHovering ? "Drop here" : "Drag and drop to upload"}
      </div>
    </DropRegion>
  );
}
```

## Props

\* indicates that the prop is required.

| Props                 |    Type     |     Default     | Description                                                             |
| --------------------- | :---------: | :-------------: | ----------------------------------------------------------------------- |
| handleAcceptedFiles\* |  function   |        -        | returns accepted files as an array.                                     |
| handleRejectedFiles   |  function   |        -        | returns rejected files as an array.                                     |
| handleProgress        |  function   |        -        | is fired periodically as the files are being uploaded.                  |
| setIsHovering         |  function   |        -        | returns `true`, if user is dragging over DropRegion.                    |
| onDrop                |  function   |        -        | is invoked when upon `drop` event.                                      |
| onDragEnter           |  function   |        -        | is invoked upon `dragEnter` event.                                      |
| onDragLeave           |  function   |        -        | is invoked upon `dragLeave` or `dragExit` events.                       |
| onError               |  function   |        -        | is invoked, if an error occurs during uploading files.                  |
| readAs                |   string    | `readAsDataURL` | specifies reading method.                                               |
| allowMultiple         |   boolean   |     `true`      | if true, user may upload more than one file.                            |
| disable               |   boolean   |     `false`     | if true, user cannot upload files.                                      |
| allowKeyboard         |   boolean   |     `true`      | if true, user can open file dialog by pressing `Enter` or `Space` keys. |
| allowClick            |   boolean   |     `true`      | if true, user can open file dialog by clicking on DropRegion.           |
| validTypes            |  string[]   |       []        | pass accepted file types.                                               |
| showPlaceholder       |   boolean   |      true       | Placeholder is shown while waiting for full image to load               |
| customPlaceholder     | DOM Element |      null       | Pass your custom placeholder component/element.                         |
