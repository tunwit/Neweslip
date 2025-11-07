const normalizeNull = <T extends object>(obj: T): any =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value === null ? undefined : value])
  );

export default normalizeNull;