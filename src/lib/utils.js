import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertToDynamicQRIS(qris, _nominal, useServiceFee = 'n', feeType = 'r', feeValue = 0) {
  let tax = '';

  if (useServiceFee === 'y') {
    tax = feeType === 'r'
      ? "55020256" + String(feeValue.length).padStart(2, '0') + feeValue
      : "55020357" + String(feeValue.length).padStart(2, '0') + feeValue;
  }

  qris = qris.slice(0, -4).replace("010211", "010212");

  const nominal = new String(_nominal);
  const [prefix, suffix] = qris.split("5802ID");
  const nominalData = "54" + String(nominal.length).padStart(2, '0') + nominal;

  const resultQRIS = `${prefix}${nominalData}${tax || ''}5802ID${suffix}${convertCRC16(prefix + nominalData + tax + "5802ID" + suffix)}`;
  console.log('hasile:');
  console.log(resultQRIS);
  return resultQRIS;
}

function convertCRC16(str) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}
