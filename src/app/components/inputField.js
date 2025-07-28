"use client"
export default function InputField({type, name, value, onChange, placeholder, error, label}) {

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