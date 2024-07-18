import React from 'react';
import { useField } from 'formik';

interface CustomSelectFieldProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({ label, options, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-md md:text-lg font-normal mb-2">{label}</label>
      <select
        className={`shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 text-md md:text-lg leading-tight focus:outline-none focus:shadow-outline ${
          meta.touched && meta.error ? 'border-red-500' : ''
        }`}
        {...field}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <p className="text-red-500 text-sm italic text-end">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default CustomSelectField;