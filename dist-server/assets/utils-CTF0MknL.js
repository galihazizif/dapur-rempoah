import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
//#region src/store/useCartStore.js
var useCartStore = create(persist((set, get) => ({
	items: [],
	addItem: (product) => {
		const { items } = get();
		if (items.find((item) => item.id === product.id)) set({ items: items.map((item) => item.id === product.id ? {
			...item,
			quantity: item.quantity + 1
		} : item) });
		else set({ items: [...items, {
			...product,
			quantity: 1
		}] });
	},
	removeItem: (productId) => {
		set({ items: get().items.filter((item) => item.id !== productId) });
	},
	updateQuantity: (productId, quantity) => {
		if (quantity <= 0) {
			get().removeItem(productId);
			return;
		}
		set({ items: get().items.map((item) => item.id === productId ? {
			...item,
			quantity
		} : item) });
	},
	clearCart: () => set({ items: [] }),
	getTotal: () => {
		const { items } = get();
		return items.reduce((total, item) => total + item.price * item.quantity, 0);
	},
	getItemCount: () => {
		const { items } = get();
		return items.reduce((count, item) => count + item.quantity, 0);
	}
}), { name: "dapur-rempoah-cart" }));
//#endregion
//#region src/store/useAuthStore.js
function readLocal(key) {
	try {
		if (typeof localStorage === "undefined") return null;
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}
var useAuthStore = create((set) => ({
	token: readLocal("customer_token"),
	customer: JSON.parse(readLocal("customer_profile")) || null,
	setAuth: (token, customer) => {
		localStorage.setItem("customer_token", token);
		localStorage.setItem("customer_profile", JSON.stringify(customer));
		set({
			token,
			customer
		});
	},
	logout: () => {
		localStorage.removeItem("customer_token");
		localStorage.removeItem("customer_profile");
		set({
			token: null,
			customer: null
		});
	}
}));
//#endregion
//#region src/lib/utils.js
function haversineDistance(lat1, lng1, lat2, lng2) {
	const R = 6371;
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLng = (lng2 - lng1) * Math.PI / 180;
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
	return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function convertToDynamicQRIS(qris, _nominal, useServiceFee = "n", feeType = "r", feeValue = 0) {
	let tax = "";
	if (useServiceFee === "y") tax = feeType === "r" ? "55020256" + String(feeValue.length).padStart(2, "0") + feeValue : "55020357" + String(feeValue.length).padStart(2, "0") + feeValue;
	qris = qris.slice(0, -4).replace("010211", "010212");
	const nominal = new String(_nominal);
	const [prefix, suffix] = qris.split("5802ID");
	const nominalData = "54" + String(nominal.length).padStart(2, "0") + nominal;
	const resultQRIS = `${prefix}${nominalData}${tax || ""}5802ID${suffix}${convertCRC16(prefix + nominalData + tax + "5802ID" + suffix)}`;
	console.log("hasile:");
	console.log(resultQRIS);
	return resultQRIS;
}
function convertCRC16(str) {
	let crc = 65535;
	for (let c = 0; c < str.length; c++) {
		crc ^= str.charCodeAt(c) << 8;
		for (let i = 0; i < 8; i++) crc = crc & 32768 ? crc << 1 ^ 4129 : crc << 1;
	}
	return (crc & 65535).toString(16).toUpperCase().padStart(4, "0");
}
//#endregion
export { useCartStore as a, useAuthStore as i, convertToDynamicQRIS as n, haversineDistance as r, cn as t };
