export const getCookie = (name) => {
  console.log("getCookie");
  const value = `; `;
  const documentCookie = document.cookie;
  const parts = documentCookie.split(value);
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].split("=");
    if (part[0].trim() === name) {
      return part[1];
    }
  }
  return "";
};
