"use client";
import React from "react";

interface TextAreaFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label: string;
}

export default function TextAreaField({ name, value, onChange, placeholder, error, label }: TextAreaFieldProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-white text-black placeholder-grey transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${error ? "border-red-500" : "border-grey"}`}
        rows={4}
      />
    </div>
  );
}
