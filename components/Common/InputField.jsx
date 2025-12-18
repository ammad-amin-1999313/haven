'use client';

import React, { useEffect, useMemo, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function InputField({
  id,
  label,
  labelRight,               // 👈 NEW (Forgot password / links / actions)
  type = "text",
  value = "",
  onChange,
  placeholder,
  required = false,
  className = "",
  inputClassName = "",
  validate = false,
  validationType = "none",  // "none" | "email"
  showErrorOn = "blur",     // "blur" | "change"
  errorMessage,
  ...props
}) {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState("");

  const computedError = useMemo(() => {
    if (!validate) return "";

    if (validationType === "email") {
      if (!value) {
        return required ? (errorMessage || "Email is required.") : "";
      }
      return EMAIL_REGEX.test(value)
        ? ""
        : (errorMessage || "Please enter a valid email address.");
    }

    return "";
  }, [validate, validationType, value, required, errorMessage]);

  const shouldShowError =
    validate &&
    !!computedError &&
    (showErrorOn === "change" ? true : touched);

  useEffect(() => {
    setLocalError(computedError);
  }, [computedError]);

  const baseInput =
    "h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-offset-0";

  const normalBorder = "border-gray-200 focus:ring-emerald-600";
  const errorBorder = "border-red-500 focus:ring-red-500";

  return (
    <div className={`space-y-2 ${className}`}>
      {label ? (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-medium text-gray-800">
            {label}
            {required ? <span className="text-red-500"> *</span> : null}
          </label>

          {labelRight ? (
            <div className="text-xs">{labelRight}</div>
          ) : null}
        </div>
      ) : null}

      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange?.(e)}
        onBlur={() => setTouched(true)}
        className={`${baseInput} ${
          shouldShowError ? errorBorder : normalBorder
        } ${inputClassName}`}
        aria-invalid={shouldShowError ? "true" : "false"}
        aria-describedby={shouldShowError ? `${id}-error` : undefined}
        {...props}
      />

      {shouldShowError ? (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {localError}
        </p>
      ) : null}
    </div>
  );
}
