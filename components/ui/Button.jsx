'use client';
import React from "react";

const Button = ({
  title,
  onClick,
  bg = "bg-[#2D5A4C]", // Default to forest green
  textColor = "text-white", // Default to white text
  className = "",
  type = "button",
  border = "", // Optional border style
  rounded = "rounded-lg", // Default rounded
  ...props
}) => {
  // Base structural styles
  const baseStyles = `px-5 py-2 font-semibold text-[14px] transition-all duration-200 active:scale-95 flex items-center justify-center ${rounded}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${bg} ${textColor} ${border} ${className}`}
      {...props}
    >
      {title}
    </button>
  );
};

export default Button;
