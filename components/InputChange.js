import React, { useState, useEffect } from 'react';

export function InputChange(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value.toUpperCase(),
    });
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return {
    values,
    setValues,
    handleInputChange,
    resetForm,
    errors,
    setErrors,
  };
}
