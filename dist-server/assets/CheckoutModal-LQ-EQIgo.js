import { a as useCartStore, i as useAuthStore, r as haversineDistance, t as cn } from "./utils-CTF0MknL.js";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Calendar, CheckCircle2, Clock, MapPin, Navigation, Phone, Send, Store, Truck, User, X } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Turnstile } from "@marsidev/react-turnstile";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
//#region node_modules/leaflet/dist/images/marker-icon-2x.png
var marker_icon_2x_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABSCAMAAAAhFXfZAAAC91BMVEVMaXEzeak2f7I4g7g3g7cua5gzeKg8hJo3grY4g7c3grU0gLI2frE0daAubJc2gbQwd6QzeKk2gLMtd5sxdKIua5g1frA2f7IydaM0e6w2fq41fK01eqo3grgubJgta5cxdKI1f7AydaQydaMxc6EubJgvbJkwcZ4ubZkwcJwubZgubJcydqUydKIxapgubJctbJcubZcubJcvbJYubJcvbZkubJctbJctbZcubJg2f7AubJcrbZcubJcubJcua5g3grY0fq8ubJcubJdEkdEwhsw6i88vhswuhcsuhMtBjMgthMsrg8srgss6is8qgcs8i9A9iMYtg8spgcoogMo7hcMngMonf8olfso4gr8kfck5iM8jfMk4iM8he8k1fro7itAgesk2hs8eecgzfLcofssdeMg0hc4cd8g2hcsxeLQbdsgZdcgxeLImfcszhM0vda4xgckzhM4xg84wf8Yxgs4udKsvfcQucqhUndROmdM1fK0wcZ8vb5w0eqpQm9MzeKhXoNVcpdYydKNWn9VZotVKltJFjsIwcJ1Rms9OlslLmtH///8+kc9epdYzd6dbo9VHkMM2f7FHmNBClM8ydqVcpNY9hro3gLM9hLczealQmcw3fa46f7A8gLMxc6I3eagyc6FIldJMl9JSnNRSntNNl9JPnNJFi75UnM9ZodVKksg8kM45jc09e6ZHltFBk883gbRBh7pDk9EwcaBzn784g7dKkcY2i81Om9M7j85Llc81is09g7Q4grY/j9A0eqxKmdFFltBEjcXf6fFImdBCiLxJl9FGlNFBi78yiMxVndEvbpo6js74+vx+psPP3+o/ks5HkcpGmNCjwdZCkNDM3ehYoNJEls+lxNkxh8xHks0+jdC1zd5Lg6r+/v/H2ufz9/o3jM3t8/edvdM/k89Th61OiLBSjbZklbaTt9BfptdjmL1AicBHj8hGk9FAgK1dkLNTjLRekrdClc/k7fM0icy0y9tgp9c4jc2NtM9Dlc8zicxeXZn3AAAAQ3RSTlMAHDdTb4yPA+LtnEQmC4L2EmHqB7XA0d0sr478x4/Yd5i1zOfyPkf1sLVq4Nh3FvjxopQ2/STNuFzUwFIwxKaejILpIBEV9wAABhVJREFUeF6s1NdyFEcY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";
//#endregion
//#region node_modules/leaflet/dist/images/marker-icon.png
var marker_icon_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=";
//#endregion
//#region node_modules/leaflet/dist/images/marker-shadow.png
var marker_shadow_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC";
//#endregion
//#region src/components/OrderForm.jsx
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: marker_icon_default,
	iconRetinaUrl: marker_icon_2x_default,
	shadowUrl: marker_shadow_default
});
function LocationMarker({ position, setPosition, onPositionSelected }) {
	const map = useMapEvents({ click(e) {
		setPosition(e.latlng);
		map.flyTo(e.latlng, map.getZoom());
		if (onPositionSelected) onPositionSelected(e.latlng);
	} });
	useEffect(() => {
		if (position) map.flyTo(position, map.getZoom());
	}, [position, map]);
	return position === null ? null : /* @__PURE__ */ jsx(Marker, { position });
}
var OrderForm = ({ onSuccess }) => {
	const navigate = useNavigate();
	const { items, getTotal, clearCart } = useCartStore();
	const { token: customerToken, customer } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [error, setError] = useState(null);
	const [turnstileToken, setTurnstileToken] = useState(null);
	const [formData, setFormData] = useState(() => {
		const saved = localStorage.getItem("orderFormData");
		const base = saved ? JSON.parse(saved) : {
			name: "",
			phone: "",
			address: "",
			order_type: "delivery",
			pickup_delivery_date: "",
			pickup_delivery_time: ""
		};
		if (customer?.name) base.name = customer.name;
		return base;
	});
	const [mapPosition, setMapPosition] = useState(null);
	const [isLocating, setIsLocating] = useState(false);
	const handleGetCurrentLocation = () => {
		if (!navigator.geolocation) {
			alert("Geolocation tidak didukung oleh browser Anda");
			return;
		}
		setIsLocating(true);
		navigator.geolocation.getCurrentPosition((position) => {
			handlePositionSelected({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			});
			setIsLocating(false);
		}, (error) => {
			alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
			console.error(error);
			setIsLocating(false);
		}, { enableHighAccuracy: true });
	};
	const handlePositionSelected = (latlng) => {
		setMapPosition(latlng);
		const coordString = `(Koordinat Peta: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)})`;
		setFormData((prev) => {
			const currentAddress = prev.address || "";
			if (currentAddress.includes("(Koordinat Peta:")) return {
				...prev,
				address: currentAddress.replace(/\(Koordinat Peta: [-\d.]+, [-\d.]+\)/, coordString)
			};
			else return {
				...prev,
				address: currentAddress ? `${currentAddress}\n${coordString}` : coordString
			};
		});
	};
	const [voucherInput, setVoucherInput] = useState("");
	const [appliedVoucher, setAppliedVoucher] = useState(null);
	const [voucherError, setVoucherError] = useState(null);
	const [validatingVoucher, setValidatingVoucher] = useState(false);
	const STORE_COORDS = {
		lat: -7.394778,
		lng: 109.344413
	};
	const deliveryDistance = React.useMemo(() => {
		if (formData.order_type !== "delivery" || !mapPosition) return null;
		return haversineDistance(STORE_COORDS.lat, STORE_COORDS.lng, mapPosition.lat, mapPosition.lng);
	}, [mapPosition, formData.order_type]);
	const deliveryCost = deliveryDistance !== null ? Math.max(1e3, Math.round(deliveryDistance * 1e3)) : 0;
	const isDistanceTooFar = deliveryDistance !== null && deliveryDistance > 10;
	const totalWithDelivery = Math.max(0, getTotal() - (appliedVoucher?.amount || 0) + deliveryCost);
	const handleApplyVoucher = async () => {
		if (!voucherInput.trim()) return;
		setValidatingVoucher(true);
		setVoucherError(null);
		try {
			const res = await fetch(`https://api-worker-dapur.rempoah.my.id/vouchers/${voucherInput.trim().toUpperCase()}`);
			if (!res.ok) {
				let msg = "Voucher tidak valid";
				try {
					const errData = await res.json();
					if (errData.message) msg = errData.message;
				} catch (e) {}
				throw new Error(msg);
			}
			setAppliedVoucher((await res.json()).voucher);
		} catch (err) {
			setVoucherError(err.message);
			setAppliedVoucher(null);
		} finally {
			setValidatingVoucher(false);
		}
	};
	const handleRemoveVoucher = () => {
		setAppliedVoucher(null);
		setVoucherInput("");
		setVoucherError(null);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.order_type === "delivery" && !mapPosition) {
			setError("Mohon tentukan titik lokasi pengiriman pada peta.");
			return;
		}
		if (!turnstileToken) {
			setError("Mohon selesaikan verifikasi keamanan.");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const apiUrl = "https://api-worker-dapur.rempoah.my.id";
			const orderHeaders = { "Content-Type": "application/json" };
			if (customerToken) orderHeaders["Authorization"] = `Bearer ${customerToken}`;
			const response = await fetch(`${apiUrl}/orders`, {
				method: "POST",
				headers: orderHeaders,
				body: JSON.stringify({
					customer: {
						...formData,
						latitude: mapPosition ? mapPosition.lat : null,
						longitude: mapPosition ? mapPosition.lng : null
					},
					items,
					turnstileToken,
					voucherCode: appliedVoucher ? appliedVoucher.code : void 0,
					shippingFee: deliveryCost
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal mengirim pesanan. Silakan coba lagi.");
			}
			const result = await response.json();
			console.log("Order submitted:", result);
			const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
			orderHistory.push({
				hash: result.hash,
				date: (/* @__PURE__ */ new Date()).toISOString(),
				total: result.total
			});
			localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
			setDone(true);
			setTimeout(() => {
				clearCart();
				onSuccess();
				setDone(false);
				navigate(`/orders/${result.hash}`);
			}, 2e3);
		} catch (err) {
			console.error("Error submitting order:", err);
			setError(err.message);
			setTurnstileToken(null);
		} finally {
			setLoading(false);
		}
	};
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};
	useEffect(() => {
		localStorage.setItem("orderFormData", JSON.stringify(formData));
	}, [formData]);
	const appliedCustomerName = useRef(customer?.name);
	useEffect(() => {
		if (customer?.name && customer.name !== appliedCustomerName.current) {
			appliedCustomerName.current = customer.name;
			setFormData((prev) => ({
				...prev,
				name: customer.name
			}));
		}
	}, [customer?.name]);
	if (done) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6",
				children: /* @__PURE__ */ jsx(CheckCircle2, { size: 48 })
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-bold text-slate-900 mb-2",
				children: "Pesanan Diterima!"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-slate-500 max-w-xs mx-auto",
				children: "Terima kasih telah memesan di Dapur Rempoah. Kami akan segera memproses pesanan Anda."
			})
		]
	});
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-semibold text-slate-700 mb-1.5",
						children: "Nama Lengkap"
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(User, {
							className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400",
							size: 18
						}), /* @__PURE__ */ jsx("input", {
							required: true,
							type: "text",
							name: "name",
							value: formData.name,
							onChange: handleChange,
							placeholder: "Contoh: Budi Santoso",
							className: "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all"
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-semibold text-slate-700 mb-1.5",
						children: "Nomor WhatsApp"
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Phone, {
							className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400",
							size: 18
						}), /* @__PURE__ */ jsx("input", {
							required: true,
							type: "tel",
							name: "phone",
							value: formData.phone,
							onChange: handleChange,
							placeholder: "Contoh: 08123456789",
							className: "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all"
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-semibold text-slate-700 mb-1.5",
						children: "Tipe Pesanan"
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("label", {
							className: `flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${formData.order_type === "delivery" ? "bg-lime-50 border-lime-500 text-lime-700" : "bg-white border-slate-200 text-slate-500 hover:border-lime-200"}`,
							children: [
								/* @__PURE__ */ jsx("input", {
									type: "radio",
									name: "order_type",
									value: "delivery",
									checked: formData.order_type === "delivery",
									onChange: handleChange,
									className: "hidden"
								}),
								/* @__PURE__ */ jsx(Truck, { size: 20 }),
								/* @__PURE__ */ jsx("span", {
									className: "font-bold text-sm",
									children: "Pesan Antar"
								})
							]
						}), /* @__PURE__ */ jsxs("label", {
							className: `flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${formData.order_type === "pickup" ? "bg-lime-50 border-lime-500 text-lime-700" : "bg-white border-slate-200 text-slate-500 hover:border-lime-200"}`,
							children: [
								/* @__PURE__ */ jsx("input", {
									type: "radio",
									name: "order_type",
									value: "pickup",
									checked: formData.order_type === "pickup",
									onChange: handleChange,
									className: "hidden"
								}),
								/* @__PURE__ */ jsx(Store, { size: 20 }),
								/* @__PURE__ */ jsx("span", {
									className: "font-bold text-sm",
									children: "Ambil Sendiri"
								})
							]
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-semibold text-slate-700 mb-1.5",
							children: ["Tanggal ", formData.order_type === "delivery" ? "Kirim" : "Ambil"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(Calendar, {
								className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400",
								size: 18
							}), /* @__PURE__ */ jsx("input", {
								required: true,
								type: "date",
								name: "pickup_delivery_date",
								value: formData.pickup_delivery_date,
								onChange: handleChange,
								className: "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all"
							})]
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-semibold text-slate-700 mb-1.5",
							children: ["Waktu ", formData.order_type === "delivery" ? "Kirim" : "Ambil"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(Clock, {
								className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400",
								size: 18
							}), /* @__PURE__ */ jsx("input", {
								required: true,
								type: "time",
								name: "pickup_delivery_time",
								value: formData.pickup_delivery_time,
								onChange: handleChange,
								className: "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all"
							})]
						})] })]
					}),
					formData.order_type === "delivery" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-semibold text-slate-700 mb-1.5",
						children: "Alamat Pengiriman"
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(MapPin, {
							className: "absolute left-3 top-3 text-slate-400",
							size: 18
						}), /* @__PURE__ */ jsx("textarea", {
							required: true,
							name: "address",
							value: formData.address,
							onChange: handleChange,
							rows: "3",
							placeholder: "Masukkan alamat lengkap pengiriman...",
							className: "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all resize-none"
						})]
					})] }), /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between items-center mb-1.5",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "block text-sm font-semibold text-slate-700",
								children: ["Titik Lokasi Pengiriman ", /* @__PURE__ */ jsx("span", {
									className: "text-rose-500",
									children: "*"
								})]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handleGetCurrentLocation,
								disabled: isLocating,
								className: "flex items-center gap-1.5 text-xs font-bold text-lime-700 bg-lime-100 hover:bg-lime-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed",
								children: [/* @__PURE__ */ jsx(Navigation, {
									size: 14,
									className: isLocating ? "animate-pulse" : ""
								}), isLocating ? "Mencari..." : "Gunakan Lokasi Saat Ini"]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "h-64 w-full rounded-xl overflow-hidden border border-slate-200 relative z-0",
							children: /* @__PURE__ */ jsxs(MapContainer, {
								center: [-7.394801, 109.344261],
								zoom: 13,
								scrollWheelZoom: true,
								style: {
									height: "100%",
									width: "100%",
									zIndex: 0
								},
								children: [/* @__PURE__ */ jsx(TileLayer, {
									attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
									url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								}), /* @__PURE__ */ jsx(LocationMarker, {
									position: mapPosition,
									setPosition: setMapPosition,
									onPositionSelected: handlePositionSelected
								})]
							})
						}),
						mapPosition && /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-slate-500 mt-2",
							children: [
								"Koordinat terpilih: ",
								mapPosition.lat.toFixed(6),
								", ",
								mapPosition.lng.toFixed(6)
							]
						})
					] })] })
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-center my-4",
				children: /* @__PURE__ */ jsx(Turnstile, {
					siteKey: "0x4AAAAAABpeRsQmBwx6TnBV",
					onSuccess: (token) => setTurnstileToken(token)
				})
			}),
			error && /* @__PURE__ */ jsx("div", {
				className: "p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm",
				children: error
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3",
				children: [
					/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-semibold text-slate-700",
						children: "Kode Promo / Voucher"
					}),
					!appliedVoucher ? /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2 flex-wrap md:flex-row",
						children: [/* @__PURE__ */ jsx("input", {
							type: "text",
							value: voucherInput,
							onChange: (e) => setVoucherInput(e.target.value),
							placeholder: "Masukkan kode...",
							className: "flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all uppercase"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: handleApplyVoucher,
							disabled: validatingVoucher || !voucherInput.trim(),
							className: "bg-slate-900 text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50",
							children: validatingVoucher ? "Cek.." : "Gunakan"
						})]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(CheckCircle2, {
								className: "text-emerald-500",
								size: 18
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-bold text-emerald-700",
								children: appliedVoucher.code
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-emerald-600",
								children: ["Diskon Rp ", appliedVoucher.amount.toLocaleString("id-ID")]
							})] })]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: handleRemoveVoucher,
							className: "text-rose-500 hover:text-rose-600 text-sm font-bold",
							children: "Batal"
						})]
					}),
					voucherError && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-rose-500 font-medium",
						children: voucherError
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "p-4 bg-lime-50 rounded-2xl border border-lime-100 mt-8 space-y-2",
				children: [
					appliedVoucher && /* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-center text-slate-600 text-sm border-b border-lime-100/50 pb-2",
						children: [/* @__PURE__ */ jsx("span", { children: "Subtotal" }), /* @__PURE__ */ jsxs("span", { children: ["Rp ", getTotal().toLocaleString("id-ID")] })]
					}),
					appliedVoucher && /* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-center text-emerald-600 text-sm border-b border-lime-100/50 pb-2",
						children: [/* @__PURE__ */ jsx("span", { children: "Diskon Voucher" }), /* @__PURE__ */ jsxs("span", { children: ["- Rp ", appliedVoucher.amount.toLocaleString("id-ID")] })]
					}),
					formData.order_type === "delivery" && mapPosition && /* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-center text-slate-700 text-sm border-b border-lime-100/50 pb-2",
						children: [/* @__PURE__ */ jsx("span", { children: "Ongkos Kirim" }), /* @__PURE__ */ jsxs("span", { children: ["Rp ", deliveryCost.toLocaleString("id-ID")] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-center text-lime-900",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-sm uppercase tracking-wider",
							children: "Total Pesanan"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xl font-bold",
							children: ["Rp ", totalWithDelivery.toLocaleString("id-ID")]
						})]
					})
				]
			}),
			isDistanceTooFar && /* @__PURE__ */ jsx("div", {
				className: "p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm",
				children: "Lokasi pengiriman terlalu jauh (maksimal 10 km). Silakan pilih lokasi yang lebih dekat atau pilih Ambil Sendiri."
			}),
			/* @__PURE__ */ jsx("button", {
				disabled: loading || isDistanceTooFar,
				type: "submit",
				className: "w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-lime-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed",
				children: loading ? /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Send, { size: 18 }), "Konfirmasi Pesanan"] })
			})
		]
	});
};
//#endregion
//#region src/components/CheckoutModal.jsx
var CheckoutModal = ({ isOpen, onClose }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("fixed inset-0 z-[110] transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none"),
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-slate-900/60 backdrop-blur-md",
			onClick: onClose
		}), /* @__PURE__ */ jsxs("div", {
			className: cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl transition-all duration-300 p-8", isOpen ? "scale-100 translate-y-[-50%]" : "scale-95 translate-y-[-45%]"),
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors",
					children: /* @__PURE__ */ jsx(X, { size: 20 })
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold text-slate-900 mb-2",
					children: "Informasi Pengiriman"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-slate-500 mb-8",
					children: "Silakan lengkapi data di bawah ini untuk memproses pesanan Anda."
				}),
				/* @__PURE__ */ jsx(OrderForm, { onSuccess: onClose })
			]
		})]
	});
};
//#endregion
export { CheckoutModal };
