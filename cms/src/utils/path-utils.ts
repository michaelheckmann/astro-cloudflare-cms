export const getFolderPath = (path: string) => {
  const parts = path.split("/");
  parts.pop();
  return parts.join("/");
};

export const removeExtension = (path: string) => {
  return path.replace(/\.[^/.]+$/, "");
};
