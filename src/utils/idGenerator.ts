export const generateFieldId = (
  namespace: string,
  section: string,
  fieldName: string
): string => {
  return `${namespace}_${section}-${fieldName}`.toLowerCase();
};
