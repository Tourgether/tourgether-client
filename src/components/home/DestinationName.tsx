import { useEffect, useRef, useState } from "react";

interface DestinationNameProps {
  name: string;
}

export default function DestinationName({ name }: DestinationNameProps) {
  const nameRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    const element = nameRef.current;
    if (!element) return;

    const checkOverflow = () => {
      const lineHeight = fontSize * 1.3;
      const lines = element.clientHeight / lineHeight;

      if (lines > 2) {
        setFontSize(12);
      }
    };

    checkOverflow();
  }, [name, fontSize]);

  return (
    <div
      ref={nameRef}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: "bold",
        color: "#111",
        textAlign: "center",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        whiteSpace: "normal",
        lineHeight: "1.3",
      }}
    >
      {name}
    </div>
  );
}
