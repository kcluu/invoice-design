// stable dom ids for form fields, keyed the same way as validation errors
export const fieldId = (key: string) => `invoice-field-${key.replace(/\./g, '-')}`;
