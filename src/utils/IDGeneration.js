export const IDgen = (numberOfElement) => {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let ID = "";
  for (let index = 0; index < numberOfElement; index++) {
    ID += alphabet.charAt(Math.floor(Math.random() * alphabet.length) + 1);
  }

  return ID;
};
