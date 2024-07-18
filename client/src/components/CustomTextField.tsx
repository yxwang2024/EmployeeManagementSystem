import React from 'react';
import { useField } from 'formik';

interface CustomTextFieldProps {
  name: string;
  label: string;
  label2?: string;
  type?: string;
  disabled?: boolean;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ label, label2, type = 'text', disabled = false, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-md md:text-lg font-normal mb-2">
        {label} 
        {label2 && <span className='text-gray-600 ml-4 text-sm md:text-md'>{label2}</span>}
      </label>
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 text-md md:text-lg leading-tight focus:outline-none focus:shadow-outline ${
          meta.touched && meta.error ? 'border-red-500' : ''
        }`}
        type={type}
        disabled={disabled}
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