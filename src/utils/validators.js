import * as Yup from 'yup';

export const emailValidator = Yup.string()
  .email('Invalid email address')
  .required('Email is required');

export const passwordValidator = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required');

export const requiredValidator = Yup.string().required('This field is required');

export const phoneValidator = Yup.string()
  .matches(
    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    'Invalid phone number'
  );

export const dateValidator = Yup.date()
  .required('Date is required')
  .typeError('Invalid date');

export const numberValidator = Yup.number()
  .typeError('Must be a number')
  .positive('Must be positive');

export const urlValidator = Yup.string()
  .url('Must be a valid URL')
  .matches(
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    'Enter a valid URL'
  );

export const getSelectValidator = (options) => {
  return Yup.string()
    .oneOf(options.map(opt => opt.value), 'Invalid selection')
    .required('Selection is required');
};