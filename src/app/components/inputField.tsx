"use client"

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

interface InputFieldProps {
  type: InputType;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label: string;
}

export default function InputField({type, name, value, onChange, placeholder, error, label}: InputFieldProps) {

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-white text-black placeholder-grey transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
          error ? "border-red-500" : "border-grey"
        }`}
      />
    </div>
  );
}