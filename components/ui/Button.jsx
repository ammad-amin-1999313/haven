"use client";
import React from "react";

const VARIANTS = {
  primary: "bg-[#2D5A4C] text-white hover:bg-[#23473b]",
  outline: "bg-white border border-[#2D5A4C] text-[#2D5A4C] hover:bg-[#2D5A4C]/5",
  ghost: "bg-transparent text-[#2D5A4C] hover:bg-[#2D5A4C]/10",
  danger: "bg-red-500 text-white hover:bg-red-600",
  dangerOutline: "bg-white border border-red-200 text-red-600 hover:bg-red-50",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "p-2",
};

const Button = ({
  title,
  children,
  iconLeft,
  iconRight,
  onClick,
  variant = "primary",
  size = "md",
  rounded = "rounded-lg",
  fullWidth = false,
  className = "",
  type = "button",
  disabled = false,
  textColor,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${rounded}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {iconLeft && <span className="flex items-center">{iconLeft}</span>}

      {(children || title) && <span>{children || title}</span>}

      {iconRight && <span className="flex items-center">{iconRight}</span>}
    </button>
  );
};

export default Button;
