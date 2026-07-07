import React from "react";

interface ShiningWaveLogoProps {
  text?: string;
  className?: string;
}

export default function ShiningWaveLogo({ text = "Stream Align", className = "" }: ShiningWaveLogoProps) {
  return (
    <span className={`font-black tracking-tight inline-flex items-center select-none ${className}`}>
      {text.split("").map((char, idx) => {
        if (char === " ") {
          return <span key={idx} className="w-[0.25em]" />;
        }
        return (
          <span
            key={idx}
            className="wave-letter shining-wave-text"
            style={{
              animationDelay: `${idx * 0.08}s`,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
