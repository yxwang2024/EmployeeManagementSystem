import React from 'react';
import { useField } from 'formik';

interface CustomCheckboxProps {
  name: string;
  label: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });

  return (
    <div className="mb-4">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          {...field}
          {...props}
          className="form-checkbox h-5 w-5 text-gray-600"
        />
        <span className="ml-2 text-gray-700 text-md md:text-lg">{label}</span>
      </label>
      {meta.touched && meta.error ? (
        <p className="text-red-500 text-sm v">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default CustomCheckbox;