import { customAlphabet } from "nanoid";
export const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 12);

export const genDoctorCode = () => "DR-" + customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6)();
