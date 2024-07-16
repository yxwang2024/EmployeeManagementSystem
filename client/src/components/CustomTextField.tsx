import React from 'react';
import { useField } from 'formik';

interface CustomTextFieldProps {
  name: string;
  label: string;
  type?: string;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ label, type = 'text', ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-md md:text-xl font-bold mb-2">{label}</label>
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 text-md md:text-xl leading-tight focus:outline-none focus:shadow-outline ${
          meta.touched && meta.error ? 'border-red-500' : ''
        }`}
        type={type}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <p className="text-red-500 text-sm italic text-end">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default CustomTextField;