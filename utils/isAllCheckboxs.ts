export const isAllCheckboxs = (checkboxes: Record<string, boolean>) => {
  const allChecked =
    Object.values(checkboxes).every((v) => v === true) &&
    Object.values(checkboxes).length > 0;
  const noneChecked = Object.values(checkboxes).every((v) => v === false);
  const someChecked = !allChecked && !noneChecked;
  return { allChecked, someChecked, noneChecked };
};
