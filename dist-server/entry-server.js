import { a as useCartStore, i as useAuthStore, n as convertToDynamicQRIS, t as cn } from "./assets/utils-CTF0MknL.js";
import { renderToString } from "react-dom/server";
import { Link, MemoryRouter, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, CreditCard, Edit2, Eye, FileText, Gift, History, LogOut, Mail, MapPin, Menu, MessageCircle, MessageSquare, Minus, MoreVertical, Package, Percent, Phone, Plus, Printer, Save, Search, Send, Settings, Shield, ShieldCheck, ShoppingBag, ShoppingCart, Ticket, Trash2, User, Users, X, XCircle } from "lucide-react";
import { create } from "zustand";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { clsx } from "clsx";
import { QRCode } from "react-qr-code";
import { Turnstile } from "@marsidev/react-turnstile";
//#region src/hooks/useMounted.js
function useMounted() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	return mounted;
}
//#endregion
//#region src/components/Navbar.jsx
var Navbar = ({ onCartClick }) => {
	const itemCount = useCartStore((state) => state.getItemCount());
	const { token, customer, setAuth, logout } = useAuthStore();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isLoggedIn = useMounted() && token;
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const handleGoogleSuccess = async (response) => {
		try {
			const data = await (await fetch(`${apiUrl}/auth/google`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ credential: response.credential })
			})).json();
			if (data.success) setAuth(data.token, data.customer);
			else alert("Gagal login dengan Google");
		} catch (e) {
			console.error("Login failed", e);
		}
	};
	return /* @__PURE__ */ jsxs("nav", {
		className: "sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200",
		children: [/* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-center h-16",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "text-2xl font-bold text-green",
							children: "Dapur Rempoah"
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "hidden md:block",
						children: /* @__PURE__ */ jsxs("div", {
							className: "ml-10 flex items-baseline space-x-4",
							children: [
								/* @__PURE__ */ jsx(Link, {
									to: "/",
									className: "text-slate-700 hover:text-lime-600 px-3 py-2 rounded-md text-sm font-medium transition-colors",
									children: "Menu"
								}),
								/* @__PURE__ */ jsx("a", {
									href: "#",
									className: "text-slate-700 hover:text-lime-600 px-3 py-2 rounded-md text-sm font-medium transition-colors",
									children: "Tentang Kami"
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/history",
									className: "text-slate-700 hover:text-lime-600 px-3 py-2 rounded-md text-sm font-medium transition-colors",
									children: "Riwayat"
								}),
								!isLoggedIn ? /* @__PURE__ */ jsx("div", {
									className: "ml-4 transform scale-90 inline-block align-middle origin-left",
									children: /* @__PURE__ */ jsx(GoogleLogin, {
										onSuccess: handleGoogleSuccess,
										onError: () => console.log("Login failed"),
										useOneTap: true,
										shape: "pill"
									})
								}) : /* @__PURE__ */ jsxs("div", {
									className: "relative group inline-flex items-center ml-4 cursor-pointer",
									children: [/* @__PURE__ */ jsx("img", {
										src: customer?.picture || "/default-avatar.png",
										alt: "Profile",
										className: "w-8 h-8 rounded-full border border-slate-200 shadow-sm"
									}), /* @__PURE__ */ jsxs("div", {
										className: "absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top translate-y-1 group-hover:translate-y-0 z-50 overflow-hidden",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "px-4 py-3 border-b border-slate-100 bg-slate-50/50",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-sm font-bold text-slate-800 truncate",
												children: customer?.name
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 truncate",
												children: customer?.email
											})]
										}), /* @__PURE__ */ jsx("button", {
											onClick: logout,
											className: "w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 font-bold transition-colors",
											children: "Logout"
										})]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: onCartClick,
							className: "relative p-2 text-slate-700 hover:text-lime-600 transition-colors",
							children: [/* @__PURE__ */ jsx(ShoppingCart, { size: 24 }), itemCount > 0 && /* @__PURE__ */ jsx("span", {
								className: "absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-600 rounded-full",
								children: itemCount
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "md:hidden",
							children: /* @__PURE__ */ jsx("button", {
								onClick: () => setIsMenuOpen(!isMenuOpen),
								className: "p-2 text-slate-700 hover:text-lime-600 transition-colors",
								children: isMenuOpen ? /* @__PURE__ */ jsx(X, { size: 24 }) : /* @__PURE__ */ jsx(Menu, { size: 24 })
							})
						})]
					})
				]
			})
		}), /* @__PURE__ */ jsx("div", {
			className: `md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-64 border-t border-slate-100 bg-white" : "max-h-0"}`,
			children: /* @__PURE__ */ jsxs("div", {
				className: "px-4 pt-2 pb-6 space-y-2 shadow-inner",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						onClick: () => setIsMenuOpen(false),
						className: "block px-4 py-3 rounded-2xl text-slate-700 hover:bg-lime-50 hover:text-lime-600 font-medium transition-all",
						children: "Menu"
					}),
					/* @__PURE__ */ jsx("a", {
						href: "#",
						onClick: () => setIsMenuOpen(false),
						className: "block px-4 py-3 rounded-2xl text-slate-700 hover:bg-lime-50 hover:text-lime-600 font-medium transition-all",
						children: "Tentang Kami"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/history",
						onClick: () => setIsMenuOpen(false),
						className: "block px-4 py-3 rounded-2xl text-slate-700 hover:bg-lime-50 hover:text-lime-600 font-medium transition-all",
						children: "Riwayat Pesanan"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "pt-2 mt-2 border-t border-slate-100",
						children: !isLoggedIn ? /* @__PURE__ */ jsx("div", {
							className: "px-4 py-2",
							children: /* @__PURE__ */ jsx(GoogleLogin, {
								onSuccess: handleGoogleSuccess,
								onError: () => console.log("Login failed"),
								width: "100%"
							})
						}) : /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between px-4 py-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("img", {
									src: customer?.picture || "/default-avatar.png",
									alt: "Profile",
									className: "w-10 h-10 rounded-full border border-slate-200"
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-bold text-slate-800",
									children: customer?.name
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500",
									children: customer?.email
								})] })]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => {
									logout();
									setIsMenuOpen(false);
								},
								className: "px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg",
								children: "Logout"
							})]
						})
					})
				]
			})
		})]
	});
};
//#endregion
//#region src/store/useSettingsStore.js
var useSettingsStore = create((set) => ({
	settings: {
		store_status: "open",
		store_message: ""
	},
	loading: true,
	error: null,
	fetchSettings: async () => {
		try {
			set({
				loading: true,
				error: null
			});
			set({
				settings: await (await fetch(`https://api-worker-dapur.rempoah.my.id/settings`)).json(),
				loading: false
			});
		} catch (err) {
			set({
				error: err.message,
				loading: false
			});
		}
	}
}));
//#endregion
//#region src/components/CartDrawer.jsx
var CartDrawer = ({ isOpen, onClose, onCheckout }) => {
	const { items, updateQuantity, removeItem, getTotal } = useCartStore();
	const isClosed = useSettingsStore((state) => state.settings?.store_status) === "closed";
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const getImageUrl = (url) => {
		if (!url) return "https://via.placeholder.com/100";
		if (url.startsWith("http")) return url;
		return `${apiUrl}${url}`;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn("fixed inset-0 z-[100] transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none"),
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm",
			onClick: onClose
		}), /* @__PURE__ */ jsx("div", {
			className: cn("absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out", isOpen ? "translate-x-0" : "translate-x-full"),
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col h-full",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-6 border-b border-slate-100 flex justify-between items-center",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-xl font-bold text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(ShoppingBag, {
								size: 24,
								className: "text-lime-600"
							}), "Keranjang Belanja"]
						}), /* @__PURE__ */ jsx("button", {
							onClick: onClose,
							className: "p-2 hover:bg-slate-100 rounded-full transition-colors",
							children: /* @__PURE__ */ jsx(X, { size: 20 })
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex-1 overflow-y-auto p-6 space-y-6",
						children: items.length === 0 ? /* @__PURE__ */ jsxs("div", {
							className: "h-full flex flex-col items-center justify-center text-center space-y-4",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "p-6 bg-slate-50 rounded-full text-slate-300",
									children: /* @__PURE__ */ jsx(ShoppingBag, { size: 64 })
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "text-lg font-semibold text-slate-900",
									children: "Wah, keranjang kosong!"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-slate-500",
									children: "Yuk, pilih menu lezat kami untuk mengisinya."
								})] }),
								/* @__PURE__ */ jsx("button", {
									onClick: onClose,
									className: "px-6 py-2 bg-lime-600 text-white rounded-xl font-medium",
									children: "Mulai Pesan"
								})
							]
						}) : items.map((item) => /* @__PURE__ */ jsxs("div", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-20 h-20 rounded-xl overflow-hidden flex-shrink-0",
								children: /* @__PURE__ */ jsx("img", {
									src: getImageUrl(item.image_url),
									alt: item.name,
									className: "w-full h-full object-cover"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ jsx("h4", {
										className: "font-bold text-slate-900 truncate",
										children: item.name
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-lime-600 font-semibold text-sm",
										children: ["Rp ", item.price.toLocaleString("id-ID")]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 mt-2",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center border border-slate-200 rounded-lg",
											children: [
												/* @__PURE__ */ jsx("button", {
													onClick: () => updateQuantity(item.id, item.quantity - 1),
													className: "p-1 hover:bg-slate-50 text-slate-500",
													children: /* @__PURE__ */ jsx(Minus, { size: 14 })
												}),
												/* @__PURE__ */ jsx("span", {
													className: "w-8 text-center text-sm font-medium",
													children: item.quantity
												}),
												/* @__PURE__ */ jsx("button", {
													onClick: () => updateQuantity(item.id, item.quantity + 1),
													className: "p-1 hover:bg-slate-50 text-slate-500",
													children: /* @__PURE__ */ jsx(Plus, { size: 14 })
												})
											]
										}), /* @__PURE__ */ jsx("button", {
											onClick: () => removeItem(item.id),
											className: "text-slate-400 hover:text-pink-600 transition-colors",
											children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
										})]
									})
								]
							})]
						}, item.id))
					}),
					items.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "p-6 border-t border-slate-100 bg-slate-50/50",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between items-center mb-6",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-500 font-medium",
								children: "Total Pembayaran"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-2xl font-bold text-slate-900",
								children: ["Rp ", getTotal().toLocaleString("id-ID")]
							})]
						}), /* @__PURE__ */ jsx("button", {
							onClick: onCheckout,
							disabled: isClosed,
							className: cn("w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all", isClosed ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-lime-600 active:scale-[0.98]"),
							children: isClosed ? "Toko Tutup" : "Lanjut ke Checkout"
						})]
					})
				]
			})
		})]
	});
};
//#endregion
//#region src/data/menu.json
var menu_default = [
	{
		"id": 2,
		"name": "Paket Sambel Rempoah",
		"category": "makanan",
		"price": 18e3,
		"description": "Nasi Ayam Goreng Sambel Rempoah\r\nBerisi Nasi 1 Porsi\r\nAyam 1 Biji\r\nTempe dan Tahu",
		"image_url": "/product-images/product-f5fa6b5c-96ca-44e7-a01a-d34a31822a6e-paket_sambel_rempoah.jpg",
		"available": 1,
		"created_at": "2026-05-23 02:19:21"
	},
	{
		"id": 3,
		"name": "Telur Dadar ",
		"category": "makanan",
		"price": 6e3,
		"description": "Telur Dadar Biasa",
		"image_url": "/product-images/product-41b9013e-3ca5-4866-b3c0-e85b080dedcb-photo_2026-05-23_09-21-07.jpg",
		"available": 1,
		"created_at": "2026-05-23 02:22:20"
	},
	{
		"id": 4,
		"name": "Nasi Putih",
		"category": "makanan",
		"price": 4e3,
		"description": "Nasi Putih",
		"image_url": "/product-images/product-04ed4563-7290-4395-835f-77cee64c4130-photo_2026-05-23_09-22-32.jpg",
		"available": 1,
		"created_at": "2026-05-23 02:23:01"
	},
	{
		"id": 6,
		"name": "Paket Sambel Ijo",
		"category": "makanan",
		"price": 18e3,
		"description": "Nasi, Ayam Goreng, Tempe, Tahu, Sambel Ijo",
		"image_url": "/product-images/product-32b3a292-9883-47ae-ba5c-154798c5d5b8-photo_2026-05-23_09-29-11.jpg",
		"available": 1,
		"created_at": "2026-05-23 02:29:46"
	},
	{
		"id": 7,
		"name": "Ayam Goreng",
		"category": "makanan",
		"price": 8e3,
		"description": "Ayam Goreng 1 Buah",
		"image_url": "/product-images/product-83bf4787-63df-43a1-942f-435c2a30c28c-photo_2026-05-23_09-30-14.jpg",
		"available": 1,
		"created_at": "2026-05-23 02:30:38"
	},
	{
		"id": 8,
		"name": "Ayam Goreng Sambel Ijo",
		"category": "makanan",
		"price": 1e4,
		"description": "Ayam Goreng + Sambel Ijo",
		"image_url": "/product-images/product-4d147989-9b66-4513-87bb-be4636aeb60b-photo_2026-05-23_09-31-20.jpg",
		"available": 1,
		"created_at": "2026-05-23 02:31:46"
	},
	{
		"id": 9,
		"name": "Ayam Goreng Sambel Rempoah",
		"category": "makanan",
		"price": 1e4,
		"description": "Ayam Goreng + Sambel Rempoah",
		"image_url": "/product-images/product-368bd960-0987-4d8a-87d4-583fa4710ca7-photo_2026-05-23_09-31-10.jpg",
		"available": 1,
		"created_at": "2026-05-23 02:32:13"
	},
	{
		"id": 10,
		"name": "Es Jeruk Peras",
		"category": "minuman",
		"price": 5e3,
		"description": "Es Jeruk Peras dengan gula tebu asli",
		"image_url": "/product-images/product-ef1c963f-8c46-4edb-8e88-8783aefc61aa-1000223106.png",
		"available": 1,
		"created_at": "2026-06-18 14:16:37"
	},
	{
		"id": 11,
		"name": "Es Good Day Vanilla",
		"category": "minuman",
		"price": 6e3,
		"description": "GoodDay Vanila dengan es batu",
		"image_url": "/product-images/product-6d35639c-a65c-4d18-ad96-0a13f086676a-1000212877.png",
		"available": 1,
		"created_at": "2026-06-18 14:19:10"
	},
	{
		"id": 12,
		"name": "Nasi Ayam Sambel Lamongan",
		"category": "makanan",
		"price": 14e3,
		"description": "Nasi + Ayam Goreng + Sambel Lamongan",
		"image_url": "/product-images/product-2b3b27b7-fb21-486f-9589-b48c7542fb33-1000233536.png",
		"available": 1,
		"created_at": "2026-07-11 04:33:05"
	},
	{
		"id": 13,
		"name": "Ayam Goreng Sambel Lamongan",
		"category": "makanan",
		"price": 1e4,
		"description": "Ayam Goreng + Sambel lamongan tanpa nasi",
		"image_url": "/product-images/product-3b320581-839f-4e69-b972-c4a8c12fec5b-1000233537.png",
		"available": 1,
		"created_at": "2026-07-11 04:33:44"
	}
];
//#endregion
//#region src/hooks/useMenu.js
function useMenu() {
	const [menu, setMenu] = useState(menu_default);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		let cancelled = false;
		async function fetchMenu() {
			try {
				const response = await fetch(`https://api-worker-dapur.rempoah.my.id/menu`);
				if (!response.ok) throw new Error("Gagal mengambil data menu");
				const data = await response.json();
				if (!cancelled) setMenu(data);
			} catch (err) {
				console.error("Error refreshing menu:", err);
			}
		}
		fetchMenu();
		return () => {
			cancelled = true;
		};
	}, []);
	return {
		menu,
		loading,
		error
	};
}
//#endregion
//#region src/assets/wa_icon.png
var wa_icon_default = "/assets/wa_icon-qxoxDh1f.png";
//#endregion
//#region src/components/Hero.jsx
var Hero = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "relative overflow-hidden bg-white py-16 sm:py-24",
		children: [/* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ jsx("div", {
				className: "relative z-10 lg:w-full lg:max-w-2xl",
				children: /* @__PURE__ */ jsx("main", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 md:mt-16 lg:px-8 lg:pl-0 lg:mt-20 pb-20",
					children: /* @__PURE__ */ jsxs("div", {
						className: "sm:text-center lg:text-left",
						children: [
							/* @__PURE__ */ jsxs("h2", {
								className: "text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl",
								children: [/* @__PURE__ */ jsx("span", {
									className: "block xl:inline",
									children: "Dapur Rempoah"
								}), " "]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0",
								children: "Pesan ayam goreng rumahan secara online. Dapur Rempoah adalah plaftorm untuk melakukan pemesanan makanan rumahan secara online, menghadirkan hidangan tradisional dengan sentuhan modern. Kami menggunakan bahan-bahan segar dan rempah pilihan."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start",
								children: [/* @__PURE__ */ jsx("div", {
									className: "rounded-md shadow",
									children: /* @__PURE__ */ jsx("a", {
										href: "#menu",
										className: "w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 md:py-4 md:text-lg md:px-10 transition-colors",
										children: "Pesan Sekarang"
									})
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-3 sm:mt-0 sm:ml-3",
									children: /* @__PURE__ */ jsxs("a", {
										href: "https://wa.me/6285117054626",
										className: "w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-lime-700 bg-lime-100 hover:bg-lime-200 md:py-4 md:text-lg md:px-10 transition-colors",
										children: [/* @__PURE__ */ jsx("img", {
											src: wa_icon_default,
											className: "w-6 h-6 mr-2"
										}), " WhatsApp"]
									})
								})]
							})
						]
					})
				})
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2",
			children: /* @__PURE__ */ jsx("img", {
				className: "w-full",
				src: "/photo_2026-04-26_19-33-45.jpg",
				alt: "Dapur Rempoah Food"
			})
		})]
	});
};
//#endregion
//#region src/components/MenuCard.jsx
var MenuCard = ({ item }) => {
	const addItem = useCartStore((state) => state.addItem);
	const items = useCartStore((state) => state.items);
	const storeStatus = useSettingsStore((state) => state.settings?.store_status);
	const cartItem = items.find((i) => i.id === item.id);
	const isAvailable = item.available && storeStatus === "open";
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const getImageUrl = (url) => {
		if (!url) return "https://via.placeholder.com/400x300?text=Menu";
		if (url.startsWith("http")) return url;
		return `${apiUrl}${url}`;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn("group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100", !isAvailable && "opacity-60 grayscale"),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative h-48 overflow-hidden",
			children: [
				/* @__PURE__ */ jsx("img", {
					src: getImageUrl(item.image_url),
					alt: item.name,
					className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				}),
				!isAvailable && /* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 bg-slate-900/60 flex items-center justify-center",
					children: /* @__PURE__ */ jsx("span", {
						className: "text-white font-bold px-4 py-2 border-2 border-white rounded-full",
						children: !item.available ? "Habis" : "Tutup"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-900 shadow-sm",
					children: ["Rp ", item.price.toLocaleString("id-ID")]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-start mb-2",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-bold text-slate-900 group-hover:text-lime-600 transition-colors",
						children: item.name
					}), /* @__PURE__ */ jsx("span", {
						className: "hidden md:block text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-md uppercase tracking-wider",
						children: item.category
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-slate-500 text-sm line-clamp-2 mb-4 h-10",
					children: item.description
				}),
				/* @__PURE__ */ jsxs("button", {
					disabled: !isAvailable,
					onClick: () => addItem(item),
					className: cn("hidden md:flex w-full items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all duration-200", isAvailable ? "bg-slate-900 text-white hover:bg-lime-600 active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed"),
					children: [/* @__PURE__ */ jsx(ShoppingCart, { size: 18 }), cartItem ? `Tambah Lagi (${cartItem.quantity})` : "Tambah ke Keranjang"]
				}),
				/* @__PURE__ */ jsxs("button", {
					disabled: !isAvailable,
					onClick: () => addItem(item),
					className: cn("flex md:hidden w-full items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all duration-200", isAvailable ? "bg-slate-900 text-white hover:bg-lime-600 active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed"),
					children: [/* @__PURE__ */ jsx(ShoppingCart, { size: 18 }), cartItem ? `Tambah (${cartItem.quantity})` : "Tambah"]
				})
			]
		})]
	});
};
//#endregion
//#region src/components/MenuSection.jsx
var MenuSection = ({ menu = [], loading, error }) => {
	const [filter, setFilter] = useState("all");
	const categories = [
		"all",
		"makanan",
		"minuman",
		"camilan"
	];
	const filteredMenu = filter === "all" ? menu : menu.filter((item) => item.category === filter);
	return /* @__PURE__ */ jsx("section", {
		id: "menu",
		className: "py-20 bg-slate-50",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-12",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-3xl font-extrabold text-slate-900 sm:text-4xl",
						children: "Menu Kami"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-4 text-xl text-slate-500",
						children: "Pilih hidangan favoritmu dari dapur kami."
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-center flex-wrap gap-2 mb-10",
					children: categories.map((cat) => /* @__PURE__ */ jsx("button", {
						onClick: () => setFilter(cat),
						className: `px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${filter === cat ? "bg-lime-600 text-white shadow-lg shadow-lime-200" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`,
						children: cat
					}, cat))
				}),
				loading ? /* @__PURE__ */ jsx("div", {
					className: "flex justify-center py-20",
					children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600" })
				}) : error ? /* @__PURE__ */ jsxs("div", {
					className: "text-center py-20",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-red-500 mb-4",
						children: error
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => window.location.reload(),
						className: "px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors",
						children: "Coba Lagi"
					})]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2",
					children: [filteredMenu.map((item) => /* @__PURE__ */ jsx(MenuCard, { item }, item.id)), filteredMenu.length === 0 && /* @__PURE__ */ jsx("div", {
						className: "col-span-full text-center py-20 text-slate-500",
						children: "Tidak ada menu untuk kategori ini."
					})]
				})
			]
		})
	});
};
//#endregion
//#region src/pages/Home.jsx
function Home({ menu, loading, error }) {
	const { settings } = useSettingsStore();
	return /* @__PURE__ */ jsxs("main", { children: [
		settings?.store_status === "closed" && /* @__PURE__ */ jsx("div", {
			className: "bg-rose-50 border-b border-rose-200 py-3 px-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto flex items-center justify-center text-rose-700 text-sm font-bold text-center gap-2",
				children: [
					/* @__PURE__ */ jsx("span", { children: "⛔" }),
					" ",
					settings.store_message || "Maaf, toko sedang libur. Anda tidak dapat memesan saat ini."
				]
			})
		}),
		/* @__PURE__ */ jsx(Hero, {}),
		/* @__PURE__ */ jsx(MenuSection, {
			menu,
			loading,
			error
		})
	] });
}
//#endregion
//#region src/pages/OrderDetail.jsx
function OrderDetail() {
	const { hash } = useParams();
	const [orderData, setOrderData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [dynamicQris, setDynamicQris] = useState("");
	const [adminToken] = useState(() => localStorage.getItem("admin_token") || "");
	const [editingFees, setEditingFees] = useState(null);
	const [editingItems, setEditingItems] = useState(null);
	const [availableProducts, setAvailableProducts] = useState([]);
	const [saving, setSaving] = useState(false);
	const [printEndpoint, setPrintEndpoint] = useState(() => localStorage.getItem("print_endpoint") || "");
	const [showPrintConfig, setShowPrintConfig] = useState(false);
	const [printEndpointInput, setPrintEndpointInput] = useState("");
	const [printing, setPrinting] = useState(false);
	const [printError, setPrintError] = useState(null);
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const staticQris = "00020101021126690021ID.CO.BANKMANDIRI.WWW01189360000802098144690211720981446990303UMI51440014ID.CO.QRIS.WWW0215ID10265217470670303UMI5204581253033605802ID5921Dapur Rempoah Babakan6015Purbalingga (Ka61055337162070703A016304FB30";
	const fetchOrder = useCallback(async () => {
		try {
			const data = await (await fetch(`${apiUrl}/orders/${hash}`)).json();
			if (data.success) {
				setOrderData(data);
				setDynamicQris(convertToDynamicQRIS(staticQris, data.order.total_amount));
			} else setError(data.message || "Gagal memuat detail pesanan");
		} catch (err) {
			setError("Terjadi kesalahan saat menghubungi server");
		} finally {
			setLoading(false);
		}
	}, [
		hash,
		apiUrl,
		staticQris
	]);
	useEffect(() => {
		fetchOrder();
	}, [fetchOrder]);
	const handleUpdateOrder = async (updates) => {
		if (!adminToken) return;
		setSaving(true);
		try {
			const response = await fetch(`${apiUrl}/admin/orders/${orderData.order.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify(updates)
			});
			if (response.ok) await fetchOrder();
			else {
				const errData = await response.json();
				alert("Gagal mengupdate pesanan: " + (errData.message || ""));
			}
		} catch (err) {
			alert("Gagal mengupdate pesanan");
		} finally {
			setSaving(false);
		}
	};
	const handleOpenEditItems = async () => {
		setSaving(true);
		try {
			setAvailableProducts((await (await fetch(`${apiUrl}/products`)).json()).filter((p) => p.available));
			setEditingItems({ items: orderData.items.map((i) => ({ ...i })) });
		} catch (err) {
			alert("Gagal memuat produk");
		} finally {
			setSaving(false);
		}
	};
	const handleSaveItems = async () => {
		if (!editingItems) return;
		setSaving(true);
		try {
			const requestItems = editingItems.items.map((item) => ({
				product_id: item.product_id,
				quantity: parseInt(item.quantity)
			}));
			const response = await fetch(`${apiUrl}/admin/orders/${orderData.order.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify({ items: requestItems })
			});
			if (response.ok) {
				setEditingItems(null);
				await fetchOrder();
			} else {
				const errData = await response.json();
				alert("Gagal menyimpan item: " + errData.message);
			}
		} catch (err) {
			alert("Gagal menyimpan item pesanan");
		} finally {
			setSaving(false);
		}
	};
	const buildPrintPayload = () => {
		const { order, items } = orderData;
		const itemsSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
		const fmt = (n) => n.toLocaleString("id-ID");
		const content = [
			{
				type: "text",
				text: "DAPUR REMPOAH",
				align: "center",
				bold: true,
				size: "large"
			},
			{
				type: "text",
				text: "Babakan, Purbalingga",
				align: "center"
			},
			{
				type: "text",
				text: "",
				align: "center"
			},
			{ type: "divider" },
			{
				type: "row",
				left: "ORDER",
				right: `#${order.id}`,
				bold: false
			},
			{
				type: "row",
				left: "Jam",
				right: order.created_at
			},
			{ type: "divider" },
			...items.map((item) => ({
				type: "row",
				left: `${item.product_name} x${item.quantity}`,
				right: item.price === 0 ? "GRATIS" : fmt(item.price * item.quantity)
			})),
			{ type: "divider" },
			{
				type: "row",
				left: "Subtotal",
				right: fmt(itemsSubtotal)
			}
		];
		if (order.voucher_code) if ((order.discount_amount || 0) > 0) content.push({
			type: "row",
			left: `Diskon (${order.voucher_code})`,
			right: `-${fmt(order.discount_amount || 0)}`
		});
		else content.push({
			type: "row",
			left: `Voucher (${order.voucher_code})`,
			right: "Bonus Item"
		});
		if (order.shipping_fee > 0) content.push({
			type: "row",
			left: "Ongkir",
			right: fmt(order.shipping_fee)
		});
		if (order.additional_fee) content.push({
			type: "row",
			left: "Biaya",
			right: fmt(order.additional_fee)
		});
		content.push({
			type: "row",
			left: "TOTAL",
			right: fmt(order.total_amount),
			bold: true
		}, {
			type: "text",
			text: "Terima kasih!",
			align: "center"
		});
		return {
			cut: false,
			content
		};
	};
	const sendToPrinter = async () => {
		if (!printEndpoint) return;
		setPrinting(true);
		setPrintError(null);
		try {
			const response = await fetch(printEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(buildPrintPayload())
			});
			if (!response.ok) {
				const text = await response.text();
				throw new Error(text || `HTTP ${response.status}`);
			}
			alert("Struk berhasil dikirim ke printer.");
		} catch (err) {
			setPrintError("Gagal mengirim struk: " + err.message);
		} finally {
			setPrinting(false);
		}
	};
	const handlePrint = () => {
		if (!printEndpoint) {
			setPrintEndpointInput("");
			setShowPrintConfig(true);
			return;
		}
		sendToPrinter();
	};
	const handleSavePrintEndpoint = async () => {
		const endpoint = printEndpointInput.trim();
		if (!endpoint) return;
		localStorage.setItem("print_endpoint", endpoint);
		setPrintEndpoint(endpoint);
		setShowPrintConfig(false);
		setPrintError(null);
		sendToPrinter();
	};
	const getStatusColor = (status) => {
		switch (status) {
			case "pending": return "bg-amber-100 text-amber-700";
			case "pending payment": return "bg-orange-100 text-orange-700";
			case "inprogress": return "bg-blue-100 text-blue-700";
			case "complete": return "bg-emerald-100 text-emerald-700";
			case "cancelled": return "bg-rose-100 text-rose-700";
			default: return "bg-slate-100 text-slate-700";
		}
	};
	const getStatusColorInteractive = (status) => {
		switch (status) {
			case "pending": return "bg-amber-100 text-amber-700 hover:bg-amber-200";
			case "pending payment": return "bg-orange-100 text-orange-700 hover:bg-orange-200";
			case "inprogress": return "bg-blue-100 text-blue-700 hover:bg-blue-200";
			case "complete": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
			case "cancelled": return "bg-rose-100 text-rose-700 hover:bg-rose-200";
			default: return "bg-slate-100 text-slate-700 hover:bg-slate-200";
		}
	};
	const getPaymentStatusColor = (status) => {
		switch (status) {
			case "unpaid": return "bg-amber-100 text-amber-700";
			case "confirmation": return "bg-indigo-100 text-indigo-700";
			case "paid": return "bg-emerald-100 text-emerald-700";
			default: return "bg-slate-100 text-slate-700";
		}
	};
	const getPaymentStatusColorInteractive = (status) => {
		switch (status) {
			case "unpaid": return "bg-amber-100 text-amber-700 hover:bg-amber-200";
			case "confirmation": return "bg-lime-100 text-lime-700 hover:bg-lime-200";
			case "paid": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
			default: return "bg-slate-100 text-slate-700 hover:bg-slate-200";
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center min-h-[60vh]",
		children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" })
	});
	if (error) return /* @__PURE__ */ jsx("div", {
		className: "max-w-3xl mx-auto px-4 py-12 text-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-red-50 text-red-600 p-6 rounded-2xl",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-lg font-medium",
				children: error
			}), /* @__PURE__ */ jsx(Link, {
				to: "/",
				className: "inline-block mt-4 text-sm font-semibold hover:underline",
				children: "Kembali ke Menu"
			})]
		})
	});
	const { order, items } = orderData;
	const itemsSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
	const isEditable = order.status === "pending" || order.status === "pending payment";
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-3xl mx-auto px-4 py-8",
		children: [
			adminToken ? /* @__PURE__ */ jsxs(Link, {
				to: "/admin/orders",
				className: "inline-flex items-center text-slate-500 hover:text-lime-600 transition-colors mb-6 group",
				children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" }), "Kelola Pesanan"]
			}) : /* @__PURE__ */ jsxs(Link, {
				to: "/history",
				className: "inline-flex items-center text-slate-500 hover:text-violet-600 transition-colors mb-6 group",
				children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" }), "Riwayat Pesanan"]
			}),
			adminToken && /* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl w-fit",
				children: [/* @__PURE__ */ jsx(ShieldCheck, {
					size: 14,
					className: "text-lime-600"
				}), "Mode Admin — kontrol tersedia di bawah"]
			}),
			adminToken && orderData && /* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex flex-wrap items-center gap-3 bg-white border border-slate-100 rounded-2xl p-3",
				children: [
					/* @__PURE__ */ jsxs("button", {
						onClick: handlePrint,
						disabled: printing,
						className: "flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-lime-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed",
						children: [/* @__PURE__ */ jsx(Printer, { size: 16 }), printing ? "Mengirim..." : "Cetak Struk"]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => {
							setPrintEndpointInput(printEndpoint);
							setShowPrintConfig(true);
						},
						className: "flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-xl transition-colors",
						title: "Konfigurasi endpoint printer",
						children: [/* @__PURE__ */ jsx(Settings, { size: 14 }), printEndpoint ? "Ubah Endpoint" : "Atur Endpoint"]
					}),
					printEndpoint && /* @__PURE__ */ jsx("span", {
						className: "text-xs text-slate-400 font-medium break-all max-w-full sm:max-w-xs",
						children: printEndpoint
					}),
					printError && /* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold text-rose-600",
						children: printError
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-6 sm:p-8 border-b border-slate-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-start justify-between gap-4 mb-6",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
								className: "text-2xl font-bold text-slate-900",
								children: "Detail Pesanan"
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-slate-500 text-sm mt-1",
								children: ["ID: ", order.id]
							})] }), /* @__PURE__ */ jsx("div", {
								className: "flex gap-2 flex-wrap",
								children: adminToken ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("select", {
									value: order.status,
									disabled: saving,
									onChange: (e) => handleUpdateOrder({
										status: e.target.value,
										payment_status: order.payment_status
									}),
									className: clsx("px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest outline-none transition-all cursor-pointer disabled:opacity-60", getStatusColorInteractive(order.status)),
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "pending",
											children: "Pending"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "pending payment",
											children: "Pending Payment"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "inprogress",
											children: "Proses"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "complete",
											children: "Selesai"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "cancelled",
											children: "Batal"
										})
									]
								}), /* @__PURE__ */ jsxs("select", {
									value: order.payment_status,
									disabled: saving,
									onChange: (e) => handleUpdateOrder({
										status: order.status,
										payment_status: e.target.value
									}),
									className: clsx("px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest outline-none transition-all cursor-pointer disabled:opacity-60", getPaymentStatusColorInteractive(order.payment_status)),
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "unpaid",
											children: "Belum Bayar"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "confirmation",
											children: "Konfirmasi"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "paid",
											children: "Terbayar"
										})
									]
								})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
									className: clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", getStatusColor(order.status)),
									children: order.status
								}), /* @__PURE__ */ jsx("span", {
									className: clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", getPaymentStatusColor(order.payment_status)),
									children: order.payment_status
								})] })
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-8",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3",
										children: "Informasi Pelanggan"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "font-bold text-slate-900",
										children: order.customer_name
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-slate-500 mt-1",
										children: order.customer_phone
									}),
									(!order.order_type || order.order_type === "delivery") && /* @__PURE__ */ jsx("p", {
										className: "text-slate-500 text-sm mt-2",
										children: order.customer_address
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3",
										children: "Tipe Pesanan"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 text-slate-700",
										children: [/* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", {
											className: "font-medium uppercase",
											children: order.order_type === "pickup" ? "Ambil Sendiri" : "Pesan Antar"
										})]
									}),
									(order.pickup_delivery_date || order.pickup_delivery_time) && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
										className: "text-slate-500 text-sm mt-2",
										children: order.order_type === "pickup" ? "Waktu Ambil:" : "Waktu Kirim:"
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-slate-900 font-medium",
										children: [
											order.pickup_delivery_date,
											" ",
											order.pickup_delivery_time
										]
									})] })
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3",
										children: "Info Pembayaran"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 text-slate-700",
										children: [/* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", {
											className: "font-medium uppercase",
											children: order.payment_method
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-slate-500 text-sm mt-2",
										children: "Dipesan pada:"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-slate-900 font-medium",
										children: (/* @__PURE__ */ new Date(order.created_at.replace(" ", "T") + "Z")).toLocaleString("id-ID")
									})
								] })
							]
						})]
					}),
					order.customer_id && /* @__PURE__ */ jsx("div", {
						className: "px-6 sm:px-8 py-4 bg-lime-50/60 border-b border-lime-100 flex flex-wrap items-center justify-between gap-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-full bg-white flex items-center justify-center text-lime-600 shadow-sm border border-lime-100",
								children: /* @__PURE__ */ jsx(User, { size: 18 })
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-xs font-bold text-lime-700 uppercase tracking-widest",
									children: "Pelanggan Terdaftar"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "font-bold text-slate-900",
									children: order.account_name || order.customer_name
								}),
								order.customer_email && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500",
									children: order.customer_email
								})
							] })]
						})
					}),
					adminToken && isEditable && /* @__PURE__ */ jsxs("div", {
						className: "px-6 sm:px-8 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-3 items-center",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs font-bold text-slate-400 uppercase tracking-widest mr-2",
								children: "Aksi Admin:"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => setEditingFees({
									shipping_fee: order.shipping_fee || 0,
									additional_fee: order.additional_fee || 0
								}),
								disabled: saving,
								className: "text-xs font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors border border-orange-100 disabled:opacity-50",
								children: "Sesuaikan Biaya"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: handleOpenEditItems,
								disabled: saving,
								className: "text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 disabled:opacity-50",
								children: "Edit Item"
							}),
							saving && /* @__PURE__ */ jsx("span", {
								className: "text-xs text-slate-400 font-medium",
								children: "Menyimpan..."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-6 sm:p-8",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4",
								children: "Item Pesanan"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "space-y-4",
								children: items.map((item) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between py-2 border-b border-slate-50 last:border-0",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex gap-4 items-center",
										children: [/* @__PURE__ */ jsxs("div", {
											className: clsx("w-10 h-10 rounded-lg flex items-center justify-center font-bold", item.price === 0 ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"),
											children: [item.quantity, "x"]
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
											className: "font-bold text-slate-900 flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("span", { children: item.product_name }), item.price === 0 && /* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full",
												children: "Bonus"
											})]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-slate-500 text-sm",
											children: item.price === 0 ? "Hadiah Promo" : `Rp ${item.price.toLocaleString("id-ID")}`
										})] })]
									}), /* @__PURE__ */ jsx("p", {
										className: clsx("font-bold text-right", item.price === 0 ? "text-emerald-600 font-black text-xs uppercase" : "text-slate-900"),
										children: item.price === 0 ? "Gratis" : `Rp ${(item.price * item.quantity).toLocaleString("id-ID")}`
									})]
								}, item.id))
							}),
							!adminToken && order.status === "pending" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
								className: "mt-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-100",
								children: /* @__PURE__ */ jsx("div", {
									className: "flex flex-col sm:flex-row items-center justify-between gap-4",
									children: /* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-3",
										children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-slate-900",
											children: "Mohon tunggu konfirmasi ya"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-sm text-slate-500",
											children: "Kami perlu melakukan konfirmasi ketersediaan item dan kalkulasi ongkos kirim sebelum memproses lebih lanjut"
										})] })
									})
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100",
											children: /* @__PURE__ */ jsx(MessageCircle, { size: 20 })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-slate-900",
											children: "Hubungi Admin via Whatsapp"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-sm text-slate-500",
											children: "Untuk mempercepat konfirmasi ketersediaan item"
										})] })]
									}), /* @__PURE__ */ jsxs("a", {
										href: `https://api.whatsapp.com/send/?phone=6285117054626&text=${encodeURIComponent(`Hi, order is created, please proceed ${window.location.href}`)}&type=phone_number&app_absent=0`,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ jsx(MessageCircle, { size: 18 }), "Kirim Pesan WA"]
									})]
								})
							})] }),
							!adminToken && order.status === "pending payment" && order.payment_status !== "paid" && /* @__PURE__ */ jsx("div", {
								className: "mt-8 p-6 bg-red-50 rounded-2xl border border-red-100",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-3",
										children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-slate-900",
											children: "Silahkan lakukan pembayaran dengan QRIS"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-sm text-center text-slate-500 mt-4",
											children: "DAPUR REMPOAH BABAKAN"
										})] })
									}), /* @__PURE__ */ jsx(QRCode, { value: dynamicQris })]
								})
							}),
							!adminToken && order.status !== "pending" && order.payment_status !== "paid" && /* @__PURE__ */ jsx("div", {
								className: "mt-8 p-6 bg-violet-50 rounded-2xl border border-violet-100",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-full bg-white flex items-center justify-center text-violet-600 shadow-sm border border-violet-100",
											children: /* @__PURE__ */ jsx(CreditCard, { size: 20 })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-slate-900",
											children: "Sudah melakukan pembayaran?"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-sm text-slate-500",
											children: "Konfirmasi agar pesanan segera diproses."
										})] })]
									}), /* @__PURE__ */ jsx(Link, {
										to: `/confirm-payment/${hash}`,
										className: "w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-center",
										children: "Konfirmasi Sekarang"
									})]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-8 pt-8 border-t border-slate-100 space-y-3",
								children: [
									(order.voucher_code || order.shipping_fee > 0 || order.additional_fee > 0) && /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-slate-600 font-bold",
										children: [/* @__PURE__ */ jsx("p", { children: "Subtotal Pesanan" }), /* @__PURE__ */ jsxs("p", { children: ["Rp ", itemsSubtotal.toLocaleString("id-ID")] })]
									}),
									order.voucher_code && /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-emerald-600 font-bold",
										children: [/* @__PURE__ */ jsx("p", { children: (order.discount_amount || 0) > 0 ? `Diskon Voucher (${order.voucher_code})` : `Voucher Digunakan (${order.voucher_code})` }), /* @__PURE__ */ jsx("p", { children: (order.discount_amount || 0) > 0 ? `- Rp ${order.discount_amount.toLocaleString("id-ID")}` : "Gratis Item (Bonus)" })]
									}),
									order.shipping_fee > 0 && /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-slate-600 font-bold",
										children: [/* @__PURE__ */ jsx("p", { children: "Ongkos Kirim" }), /* @__PURE__ */ jsxs("p", { children: ["Rp ", order.shipping_fee.toLocaleString("id-ID")] })]
									}),
									order.additional_fee > 0 && /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-slate-600 font-bold",
										children: [/* @__PURE__ */ jsx("p", { children: "Biaya Tambahan" }), /* @__PURE__ */ jsxs("p", { children: ["Rp ", order.additional_fee.toLocaleString("id-ID")] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between pt-2 border-t border-slate-50",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-lg font-bold text-slate-900",
											children: "Total Pembayaran"
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-2xl font-black text-rose-600",
											children: ["Rp ", order.total_amount.toLocaleString("id-ID")]
										})]
									})
								]
							})
						]
					})
				]
			}),
			editingFees && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "text-lg font-black text-slate-900 mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Ticket, {
								className: "text-lime-600",
								size: 20
							}), "Sesuaikan Biaya Pesanan"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold text-slate-500 mb-1",
								children: "Ongkos Kirim"
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("span", {
									className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm",
									children: "Rp"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									value: editingFees.shipping_fee,
									onChange: (e) => setEditingFees({
										...editingFees,
										shipping_fee: e.target.value === "" ? "" : Number(e.target.value)
									}),
									className: "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none font-bold text-slate-700",
									placeholder: "0"
								})]
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold text-slate-500 mb-1",
								children: "Biaya Tambahan"
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("span", {
									className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm",
									children: "Rp"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									value: editingFees.additional_fee,
									onChange: (e) => setEditingFees({
										...editingFees,
										additional_fee: e.target.value === "" ? "" : Number(e.target.value)
									}),
									className: "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none font-bold text-slate-700",
									placeholder: "0"
								})]
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 mt-8",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setEditingFees(null),
								className: "flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors",
								children: "Batal"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => {
									handleUpdateOrder({
										status: order.status,
										payment_status: order.payment_status,
										shipping_fee: Number(editingFees.shipping_fee) || 0,
										additional_fee: Number(editingFees.additional_fee) || 0
									});
									setEditingFees(null);
								},
								className: "flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md",
								children: "Simpan Biaya"
							})]
						})
					]
				})
			}),
			editingItems && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] flex flex-col",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "text-lg font-black text-slate-900 mb-4 flex items-center gap-2 flex-shrink-0",
							children: [
								/* @__PURE__ */ jsx(Package, {
									className: "text-lime-600",
									size: 20
								}),
								"Edit Item Pesanan #",
								order.id
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "overflow-y-auto pr-2 space-y-4 flex-1",
							children: [editingItems.items.map((item, index) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold text-sm text-slate-700 truncate",
										children: item.product_name
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-slate-500",
										children: ["Rp ", (item.price || 0).toLocaleString("id-ID")]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 ml-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "relative w-16",
										children: /* @__PURE__ */ jsx("input", {
											type: "number",
											min: "1",
											className: "w-full pl-2 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-center font-bold text-sm focus:ring-2 focus:ring-lime-500",
											value: item.quantity,
											onChange: (e) => {
												const newItems = [...editingItems.items];
												newItems[index].quantity = e.target.value;
												setEditingItems({
													...editingItems,
													items: newItems
												});
											}
										})
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => {
											const newItems = editingItems.items.filter((_, i) => i !== index);
											setEditingItems({
												...editingItems,
												items: newItems
											});
										},
										className: "text-rose-400 p-1 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors",
										title: "Hapus Item",
										children: /* @__PURE__ */ jsx(XCircle, { size: 20 })
									})]
								})]
							}, index)), /* @__PURE__ */ jsxs("div", {
								className: "mt-6 pt-4 border-t border-slate-100",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-500 mb-2",
									children: "Tambah Item Baru"
								}), /* @__PURE__ */ jsxs("select", {
									className: "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700 text-sm focus:ring-2 focus:ring-lime-500",
									onChange: (e) => {
										const productId = parseInt(e.target.value);
										if (!productId) return;
										const product = availableProducts.find((p) => p.id === productId);
										if (product) setEditingItems({
											...editingItems,
											items: [...editingItems.items, {
												product_id: product.id,
												product_name: product.name,
												price: product.price,
												quantity: 1
											}]
										});
										e.target.value = "";
									},
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "-- Pilih Produk --"
									}), availableProducts.map((p) => /* @__PURE__ */ jsxs("option", {
										value: p.id,
										children: [
											p.name,
											" - Rp ",
											p.price.toLocaleString("id-ID")
										]
									}, p.id))]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 mt-6 pt-6 border-t border-slate-100 flex-shrink-0",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setEditingItems(null),
								className: "flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors",
								children: "Batal"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleSaveItems,
								disabled: editingItems.items.length === 0 || saving,
								className: "flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md disabled:opacity-50",
								children: saving ? "Menyimpan..." : "Simpan Items"
							})]
						})
					]
				})
			}),
			showPrintConfig && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "text-lg font-black text-slate-900 mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Printer, {
								className: "text-lime-600",
								size: 20
							}), "Konfigurasi Endpoint Printer"]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mb-4",
							children: "Struk akan dikirim langsung dari browser ke endpoint REST printer ini. Disimpan di localStorage browser ini."
						}),
						/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-bold text-slate-500 mb-1",
							children: "Endpoint URL"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "url",
							value: printEndpointInput,
							onChange: (e) => setPrintEndpointInput(e.target.value),
							placeholder: "https://example.com/api/print",
							className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none font-bold text-slate-700"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 mt-8",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setShowPrintConfig(false),
								className: "flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors",
								children: "Batal"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleSavePrintEndpoint,
								disabled: !printEndpointInput.trim(),
								className: "flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md disabled:opacity-50",
								children: "Simpan & Cetak"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/pages/OrderHistory.jsx
var ITEMS_PER_PAGE = 10;
var toDate = (value) => {
	if (!value) return null;
	if (typeof value === "string" && value.includes(" ") && !value.endsWith("Z")) return /* @__PURE__ */ new Date(value.replace(" ", "T") + "Z");
	return new Date(value);
};
var normalizeOrder = (o) => ({
	hash: o.hash,
	date: toDate(o.date || o.created_at),
	total: o.total ?? o.total_amount ?? 0
});
function OrderHistory() {
	const { token } = useAuthStore();
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalOrders, setTotalOrders] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const loadHistory = useCallback(async (page) => {
		if (!token) {
			const savedHistory = localStorage.getItem("orderHistory");
			setHistory(savedHistory ? JSON.parse(savedHistory).map(normalizeOrder).sort((a, b) => b.date - a.date) : []);
			setLoading(false);
			return;
		}
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: ITEMS_PER_PAGE.toString()
			});
			const data = await (await fetch(`${apiUrl}/my/orders?${params.toString()}`, { headers: { "Authorization": `Bearer ${token}` } })).json();
			if (data.success) {
				setHistory((data.data || []).map(normalizeOrder).sort((a, b) => b.date - a.date));
				setTotalOrders(data.pagination?.total || 0);
				setTotalPages(data.pagination?.totalPages || 1);
			} else {
				setError(data.message || "Gagal memuat riwayat pesanan");
				setHistory([]);
			}
		} catch {
			setError("Terjadi kesalahan saat menghubungi server");
		} finally {
			setLoading(false);
		}
	}, [token, apiUrl]);
	useEffect(() => {
		setLoading(true);
		setError(null);
		loadHistory(currentPage);
	}, [currentPage, loadHistory]);
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-3xl mx-auto px-4 py-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 mb-8",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-600",
					children: /* @__PURE__ */ jsx(History, { className: "w-6 h-6" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-slate-900",
					children: "Riwayat Pesanan"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 text-sm",
					children: "Pesanan terakhir Anda di Dapur Rempoah"
				})] })]
			}),
			loading ? /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200",
				children: [/* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-lime-200 border-t-lime-600 rounded-full animate-spin mx-auto mb-4" }), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500",
					children: "Memuat riwayat pesanan..."
				})]
			}) : error ? /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400",
						children: /* @__PURE__ */ jsx(ShoppingBag, { className: "w-8 h-8" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-bold text-slate-900 mb-2",
						children: "Gagal memuat riwayat pesanan"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 mb-6",
						children: error
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setCurrentPage(1),
						className: "inline-flex items-center px-6 py-3 rounded-full bg-lime-600 text-white font-bold hover:bg-lime-700 transition-all shadow-lg shadow-lime-200",
						children: "Coba Lagi"
					})
				]
			}) : history.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300",
						children: /* @__PURE__ */ jsx(ShoppingBag, { className: "w-8 h-8" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-bold text-slate-900 mb-2",
						children: "Belum ada pesanan"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 mb-6",
						children: "Anda belum pernah memesan apa pun sebelumnya."
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center px-6 py-3 rounded-full bg-lime-600 text-white font-bold hover:bg-lime-700 transition-all shadow-lg shadow-lime-200",
						children: "Pesan Sekarang"
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: history.map((order, index) => /* @__PURE__ */ jsx(Link, {
					to: `/orders/${order.hash}`,
					className: "block bg-white p-5 rounded-3xl border border-slate-100 hover:border-lime-200 hover:shadow-md transition-all group",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex gap-4 items-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600",
								children: /* @__PURE__ */ jsx(Calendar, { className: "w-6 h-6" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
								className: "font-bold text-slate-900",
								children: ["Pesanan ", order.date.toLocaleDateString("id-ID", {
									day: "numeric",
									month: "long",
									year: "numeric"
								})]
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-slate-500 text-sm",
								children: [
									order.date.toLocaleTimeString("id-ID", {
										hour: "2-digit",
										minute: "2-digit"
									}),
									" • Rp ",
									order.total.toLocaleString("id-ID")
								]
							})] })]
						}), /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 text-slate-300 group-hover:text-lime-500 transition-colors" })]
					})
				}, order.hash || index))
			}),
			token && !loading && totalOrders > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 bg-white rounded-3xl border border-slate-100 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					"Menampilkan ",
					/* @__PURE__ */ jsx("span", {
						className: "font-bold text-slate-700",
						children: Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalOrders)
					}),
					" hingga ",
					/* @__PURE__ */ jsx("span", {
						className: "font-bold text-slate-700",
						children: Math.min(currentPage * ITEMS_PER_PAGE, totalOrders)
					}),
					" dari ",
					/* @__PURE__ */ jsx("span", {
						className: "font-bold text-slate-700",
						children: totalOrders
					}),
					" pesanan"
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ jsxs("button", {
							onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
							disabled: currentPage === 1,
							className: "flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm",
							children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }), " Sebelumnya"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center px-4 font-bold text-slate-700",
							children: [
								"Hal ",
								currentPage,
								" dari ",
								totalPages || 1
							]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
							disabled: currentPage >= totalPages || totalPages === 0,
							className: "flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm",
							children: ["Selanjutnya ", /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/AdminProducts.jsx
function AdminProducts() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [openDropdownId, setOpenDropdownId] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		category: "makanan",
		price: 0,
		description: "",
		image_url: "",
		available: true
	});
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const { adminToken, setShowLogin } = useOutletContext();
	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${apiUrl}/products`, { headers: { "Authorization": `Bearer ${adminToken}` } });
			if (response.status === 401) {
				setShowLogin(true);
				return;
			}
			setProducts(await response.json());
		} catch (err) {
			setError("Gagal memuat produk");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (adminToken) fetchProducts();
	}, [adminToken]);
	useEffect(() => {
		const handleClick = () => setOpenDropdownId(null);
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, []);
	const handleToggleAvailable = async (product) => {
		try {
			if ((await fetch(`${apiUrl}/products/${product.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify({ available: !product.available })
			})).ok) fetchProducts();
		} catch (err) {
			alert("Gagal mengupdate status");
		}
	};
	const handleDelete = async (id) => {
		if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
		try {
			if ((await fetch(`${apiUrl}/products/${id}`, {
				method: "DELETE",
				headers: { "Authorization": `Bearer ${adminToken}` }
			})).ok) fetchProducts();
		} catch (err) {
			alert("Gagal menghapus produk");
		}
	};
	const handleOpenModal = (product = null) => {
		if (product) {
			setEditingProduct(product);
			setFormData({
				name: product.name,
				category: product.category,
				price: product.price,
				description: product.description || "",
				image_url: product.image_url || "",
				available: product.available ? true : false
			});
			setImageFile(null);
		} else {
			setEditingProduct(null);
			setFormData({
				name: "",
				category: "makanan",
				price: 0,
				description: "",
				image_url: "",
				available: true
			});
			setImageFile(null);
		}
		setIsModalOpen(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const method = editingProduct ? "PUT" : "POST";
		const url = editingProduct ? `${apiUrl}/products/${editingProduct.id}` : `${apiUrl}/products`;
		try {
			const payload = new FormData();
			payload.append("name", formData.name);
			payload.append("category", formData.category);
			payload.append("price", formData.price.toString());
			payload.append("description", formData.description);
			payload.append("available", formData.available);
			if (imageFile) payload.append("image", imageFile);
			else if (formData.image_url) payload.append("image_url", formData.image_url);
			const response = await fetch(url, {
				method,
				headers: { "Authorization": `Bearer ${adminToken}` },
				body: payload
			});
			if (response.ok) {
				setIsModalOpen(false);
				fetchProducts();
			} else alert("Gagal menyimpan produk: " + await response.text());
		} catch (err) {
			alert("Gagal menyimpan produk");
		}
	};
	const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()));
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-6xl mx-auto px-4 py-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-4 mb-8",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-3 mb-2",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "text-sm text-slate-500 hover:text-lime-600 flex items-center gap-1",
						children: [/* @__PURE__ */ jsx(ChevronLeft, { size: 16 }), " Kembali"]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white",
						children: /* @__PURE__ */ jsx(Package, { size: 24 })
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-black text-slate-900 tracking-tight",
						children: "Kelola Produk"
					})]
				})] }), /* @__PURE__ */ jsx("div", {
					className: "flex gap-3",
					style: { overflowX: "auto" },
					children: /* @__PURE__ */ jsxs("button", {
						onClick: () => handleOpenModal(),
						className: "bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-lime-200",
						children: [/* @__PURE__ */ jsx(Plus, { size: 20 }), "Tambah Produk"]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "p-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50",
					children: [/* @__PURE__ */ jsx(Search, {
						className: "text-slate-400",
						size: 20
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Cari produk...",
						className: "bg-transparent border-none outline-none w-full font-medium text-slate-600",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value)
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4",
									children: "Produk"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4",
									children: "Kategori"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4",
									children: "Harga"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4 text-right",
									children: "Aksi"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-50",
							children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: "5",
								className: "px-6 py-12 text-center text-slate-400",
								children: "Memuat..."
							}) }) : filteredProducts.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: "5",
								className: "px-6 py-12 text-center text-slate-400",
								children: "Tidak ada produk ditemukan."
							}) }) : filteredProducts.map((product) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50/50 transition-colors",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "px-6 py-4",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ jsx("img", {
												src: product.image_url ? product.image_url.startsWith("http") ? product.image_url : `${apiUrl}${product.image_url}` : "https://via.placeholder.com/100",
												alt: product.name,
												className: "w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm"
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "font-bold text-slate-900",
												children: product.name
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 truncate max-w-[200px]",
												children: product.description
											})] })]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-6 py-4 capitalize text-slate-600 font-medium",
										children: product.category
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "px-6 py-4 font-black text-rose-600",
										children: ["Rp ", product.price.toLocaleString("id-ID")]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-6 py-4",
										children: /* @__PURE__ */ jsxs("button", {
											onClick: () => handleToggleAvailable(product),
											className: clsx("flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", product.available ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200"),
											children: [product.available ? /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }) : /* @__PURE__ */ jsx(XCircle, { size: 12 }), product.available ? "Tersedia" : "Habis"]
										})
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "px-6 py-4 text-right relative",
										children: [/* @__PURE__ */ jsx("button", {
											onClick: (e) => {
												e.stopPropagation();
												setOpenDropdownId(openDropdownId === product.id ? null : product.id);
											},
											className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all",
											children: /* @__PURE__ */ jsx(MoreVertical, { size: 18 })
										}), openDropdownId === product.id && /* @__PURE__ */ jsxs("div", {
											onClick: (e) => e.stopPropagation(),
											className: "absolute right-4 top-12 z-50 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 animate-in fade-in zoom-in duration-150 origin-top-right",
											children: [/* @__PURE__ */ jsxs("button", {
												onClick: () => {
													handleOpenModal(product);
													setOpenDropdownId(null);
												},
												className: "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-left",
												children: [/* @__PURE__ */ jsx(Edit2, { size: 16 }), " Edit"]
											}), /* @__PURE__ */ jsxs("button", {
												onClick: () => {
													handleDelete(product.id);
													setOpenDropdownId(null);
												},
												className: "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all text-left",
												children: [/* @__PURE__ */ jsx(Trash2, { size: 16 }), " Hapus"]
											})]
										})]
									})
								]
							}, product.id))
						})]
					})
				})]
			}),
			isModalOpen && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-[200] flex items-center justify-center p-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm",
					onClick: () => setIsModalOpen(false)
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-8 border-b border-slate-100 bg-slate-50/50",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-black text-slate-900 tracking-tight",
							children: editingProduct ? "Edit Produk" : "Tambah Produk Baru"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-slate-500 text-sm mt-1",
							children: "Lengkapi detail informasi produk di bawah ini."
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "p-8 space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
											children: "Nama Produk"
										}), /* @__PURE__ */ jsx("input", {
											required: true,
											type: "text",
											className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900",
											placeholder: "Contoh: Burger Rempoah",
											value: formData.name,
											onChange: (e) => setFormData({
												...formData,
												name: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
										children: "Kategori"
									}), /* @__PURE__ */ jsxs("select", {
										className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900",
										value: formData.category,
										onChange: (e) => setFormData({
											...formData,
											category: e.target.value
										}),
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "makanan",
												children: "Makanan"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "minuman",
												children: "Minuman"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "camilan",
												children: "Camilan"
											})
										]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
										children: "Harga (Rp)"
									}), /* @__PURE__ */ jsx("input", {
										required: true,
										type: "number",
										className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900",
										value: formData.price,
										onChange: (e) => setFormData({
											...formData,
											price: parseInt(e.target.value)
										})
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
								children: "Deskripsi"
							}), /* @__PURE__ */ jsx("textarea", {
								className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium text-slate-700 resize-none",
								rows: "3",
								placeholder: "Ceritakan sedikit tentang produk ini...",
								value: formData.description,
								onChange: (e) => setFormData({
									...formData,
									description: e.target.value
								})
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
								children: "Gambar Produk"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [editingProduct && formData.image_url && !imageFile && /* @__PURE__ */ jsx("img", {
									src: formData.image_url.startsWith("http") ? formData.image_url : `${apiUrl}${formData.image_url}`,
									alt: "Current",
									className: "w-12 h-12 rounded-xl object-cover border border-slate-200"
								}), /* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/*",
									className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100",
									onChange: (e) => setImageFile(e.target.files[0])
								})]
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 py-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									id: "available",
									className: "w-5 h-5 accent-lime-600 rounded",
									checked: formData.available,
									onChange: (e) => setFormData({
										...formData,
										available: e.target.checked
									})
								}), /* @__PURE__ */ jsx("label", {
									htmlFor: "available",
									className: "text-sm font-bold text-slate-700",
									children: "Tersedia untuk dipesan"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 pt-4",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setIsModalOpen(false),
									className: "flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all",
									children: "Batal"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "flex-[2] px-6 py-4 rounded-2xl font-bold bg-slate-900 text-white hover:bg-lime-600 transition-all shadow-lg shadow-slate-200",
									children: "Simpan Produk"
								})]
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/PaymentConfirmation.jsx
function PaymentConfirmation() {
	const { hash } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		order_reference: hash || "",
		amount_paid: "",
		notes: "",
		payment_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
	});
	const [turnstileToken, setTurnstileToken] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		if (file.size > 1024 * 1024) {
			setError("Ukuran gambar maksimal 1MB");
			e.target.value = null;
			return;
		}
		if (!file.type.startsWith("image/")) {
			setError("File harus berupa gambar");
			e.target.value = null;
			return;
		}
		setError(null);
		setSelectedImage(file);
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(file);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!turnstileToken) {
			setError("Silakan lengkapi verifikasi keamanan (Turnstile)");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const formDataToSend = new FormData();
			formDataToSend.append("order_reference", formData.order_reference);
			formDataToSend.append("amount_paid", formData.amount_paid);
			formDataToSend.append("notes", formData.notes);
			formDataToSend.append("payment_date", formData.payment_date);
			formDataToSend.append("turnstileToken", turnstileToken);
			if (selectedImage) formDataToSend.append("image", selectedImage);
			const data = await (await fetch(`${apiUrl}/payment-confirmations`, {
				method: "POST",
				body: formDataToSend
			})).json();
			if (data.success) {
				setSuccess(true);
				setTimeout(() => {
					navigate(`/orders/${hash || formData.order_reference}`);
				}, 3e3);
			} else setError(data.message || "Gagal mengirim konfirmasi pembayaran");
		} catch (err) {
			setError("Terjadi kesalahan saat menghubungi server");
		} finally {
			setLoading(false);
		}
	};
	if (success) return /* @__PURE__ */ jsxs("div", {
		className: "max-w-md mx-auto px-4 py-20 text-center animate-in fade-in zoom-in duration-500",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6",
				children: /* @__PURE__ */ jsx(CheckCircle2, { size: 40 })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-black text-slate-900 mb-2 tracking-tight",
				children: "Konfirmasi Terkirim!"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-slate-500 mb-8 font-medium",
				children: "Terima kasih. Kami akan segera membagikan status pembayaran Anda setelah diverifikasi."
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-slate-400",
				children: "Pindah ke detail pesanan dalam beberapa detik..."
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-xl mx-auto px-4 py-8",
		children: [/* @__PURE__ */ jsxs(Link, {
			to: hash ? `/orders/${hash}` : "/",
			className: "inline-flex items-center text-slate-500 hover:text-lime-600 transition-colors mb-6 group",
			children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" }), "Kembali"]
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden overflow-hidden animate-in slide-in-from-bottom-4 duration-500",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "p-8 border-b border-slate-100 bg-slate-50/50",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 mb-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 rounded-xl bg-lime-600 flex items-center justify-center text-white",
						children: /* @__PURE__ */ jsx(CreditCard, { size: 20 })
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-black text-slate-900 tracking-tight",
						children: "Konfirmasi Pembayaran"
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 text-sm",
					children: "Silakan isi formulir di bawah ini untuk mengonfirmasi pembayaran Anda."
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "p-8 space-y-6",
				children: [
					error && /* @__PURE__ */ jsxs("div", {
						className: "p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-start gap-3 animate-shake",
						children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold",
							children: error
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
								children: "Referensi Pesanan (ID atau Hash)"
							}), /* @__PURE__ */ jsx("div", {
								className: "relative group",
								children: /* @__PURE__ */ jsx("input", {
									required: true,
									readOnly: !!hash,
									type: "text",
									className: clsx("w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300", hash && "bg-slate-100 cursor-not-allowed opacity-75"),
									placeholder: "Contoh: ord-123-abc",
									value: formData.order_reference,
									onChange: (e) => setFormData({
										...formData,
										order_reference: e.target.value
									})
								})
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-5",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
									children: "Jumlah yang Dibayar (Rp)"
								}), /* @__PURE__ */ jsx("div", {
									className: "relative",
									children: /* @__PURE__ */ jsx("input", {
										required: true,
										type: "number",
										className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900",
										placeholder: "Contoh: 50000",
										value: formData.amount_paid,
										onChange: (e) => setFormData({
											...formData,
											amount_paid: e.target.value
										})
									})
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
									children: "Tanggal Bayar"
								}), /* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx(Calendar, {
										className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400",
										size: 18
									}), /* @__PURE__ */ jsx("input", {
										required: true,
										type: "date",
										className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900",
										value: formData.payment_date,
										onChange: (e) => setFormData({
											...formData,
											payment_date: e.target.value
										})
									})]
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
								children: "Unggah Bukti Pembayaran (Maks 1MB)"
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-4",
								children: /* @__PURE__ */ jsxs("div", {
									className: "relative group",
									children: [/* @__PURE__ */ jsx("input", {
										type: "file",
										accept: "image/*",
										onChange: handleImageChange,
										className: "hidden",
										id: "payment-proof"
									}), /* @__PURE__ */ jsx("label", {
										htmlFor: "payment-proof",
										className: "flex flex-col items-center justify-center w-full min-h-[120px] px-6 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-lime-400 hover:bg-lime-50/30 transition-all group",
										children: imagePreview ? /* @__PURE__ */ jsxs("div", {
											className: "relative w-full aspect-video rounded-xl overflow-hidden shadow-md",
											children: [/* @__PURE__ */ jsx("img", {
												src: imagePreview,
												alt: "Preview",
												className: "w-full h-full object-contain"
											}), /* @__PURE__ */ jsx("div", {
												className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity",
												children: /* @__PURE__ */ jsx("p", {
													className: "text-white text-xs font-bold px-3 py-1.5 bg-lime-600 rounded-lg",
													children: "Ganti Gambar"
												})
											})]
										}) : /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-lime-500 group-hover:scale-110 transition-all mb-3 border border-slate-100",
												children: /* @__PURE__ */ jsx(CreditCard, { size: 24 })
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-sm font-bold text-slate-600",
												children: "Klik untuk pilih gambar"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-400 mt-1",
												children: "PNG, JPG atau JPEG (Maks. 1MB)"
											})
										] })
									})]
								})
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
								children: "Catatan Tambahan (Opsional)"
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(MessageSquare, {
									className: "absolute right-4 top-4 text-slate-400",
									size: 18
								}), /* @__PURE__ */ jsx("textarea", {
									className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium text-slate-700 resize-none min-h-[100px]",
									placeholder: "Misal: Pembayaran via Bank BCA a/n Budi",
									value: formData.notes,
									onChange: (e) => setFormData({
										...formData,
										notes: e.target.value
									})
								})]
							})] })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center gap-6 pt-4",
						children: [/* @__PURE__ */ jsx(Turnstile, {
							siteKey: "0x4AAAAAABpeRsQmBwx6TnBV",
							onSuccess: (token) => setTurnstileToken(token)
						}), /* @__PURE__ */ jsx("button", {
							disabled: loading,
							type: "submit",
							className: clsx("w-full px-8 py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3 shadow-lg", loading ? "bg-slate-400" : "bg-lime-600 hover:bg-lime-700 shadow-lime-200"),
							children: loading ? /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Send, { size: 20 }), "Kirim Konfirmasi"] })
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/pages/AdminPaymentConfirmations.jsx
function AdminPaymentConfirmations() {
	const [confirmations, setConfirmations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const { adminToken, setShowLogin } = useOutletContext();
	const fetchConfirmations = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${apiUrl}/admin/payment-confirmations`, { headers: { "Authorization": `Bearer ${adminToken}` } });
			if (response.status === 401) {
				setShowLogin(true);
				return;
			}
			setConfirmations(await response.json());
		} catch (err) {
			setError("Gagal memuat konfirmasi pembayaran");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (adminToken) fetchConfirmations();
	}, [adminToken]);
	const handleUpdateStatus = async (id, status, validity) => {
		try {
			if ((await fetch(`${apiUrl}/admin/payment-confirmations/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify({
					status,
					validity
				})
			})).ok) fetchConfirmations();
		} catch (err) {
			alert("Gagal mengupdate status");
		}
	};
	const filteredConfirmations = confirmations.filter((c) => c.order_reference.toLowerCase().includes(searchTerm.toLowerCase()) || c.notes.toLowerCase().includes(searchTerm.toLowerCase()));
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-6xl mx-auto px-4 py-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-4 mb-8",
			children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white",
					children: /* @__PURE__ */ jsx(CreditCard, { size: 24 })
				}), /* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 tracking-tight",
					children: "Konfirmasi Pembayaran"
				})]
			}) }), /* @__PURE__ */ jsx("div", {
				className: "flex gap-3",
				style: { overflowX: "auto" }
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "p-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50",
				children: [/* @__PURE__ */ jsx(Search, {
					className: "text-slate-400",
					size: 20
				}), /* @__PURE__ */ jsx("input", {
					type: "text",
					placeholder: "Cari referensi atau catatan...",
					className: "bg-transparent border-none outline-none w-full font-medium text-slate-600",
					value: searchTerm,
					onChange: (e) => setSearchTerm(e.target.value)
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-4",
								children: "Pesanan"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-4",
								children: "Jumlah"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-4",
								children: "Tgl Bayar"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-4",
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-4",
								children: "Validitas"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-4 text-right",
								children: "Aksi"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-slate-50",
						children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: "6",
							className: "px-6 py-12 text-center text-slate-400",
							children: "Memuat..."
						}) }) : filteredConfirmations.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: "6",
							className: "px-6 py-12 text-center text-slate-400",
							children: "Tidak ada konfirmasi ditemukan."
						}) }) : filteredConfirmations.map((conf) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-slate-50/50 transition-colors",
							children: [
								/* @__PURE__ */ jsxs("td", {
									className: "px-6 py-4",
									children: [
										/* @__PURE__ */ jsx("p", {
											className: "font-bold text-slate-900",
											children: conf.order_reference
										}),
										conf.notes && /* @__PURE__ */ jsxs("p", {
											className: "text-xs text-slate-500 flex items-center gap-1 mt-1",
											children: [
												/* @__PURE__ */ jsx(MessageSquare, { size: 10 }),
												" ",
												conf.notes
											]
										}),
										conf.image_url && /* @__PURE__ */ jsxs("a", {
											href: `${apiUrl}${conf.image_url}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "text-xs text-lime-600 flex items-center gap-1 mt-2 font-black hover:text-lime-700 transition-colors bg-lime-50 px-2 py-1 rounded-md w-fit",
											children: [/* @__PURE__ */ jsx(Eye, { size: 12 }), " Lihat Bukti Bayar"]
										})
									]
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-6 py-4 font-black text-rose-600",
									children: ["Rp ", conf.amount_paid.toLocaleString("id-ID")]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4 text-sm text-slate-600",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Calendar, {
											size: 14,
											className: "text-slate-400"
										}), new Date(conf.payment_date).toLocaleDateString("id-ID")]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4",
									children: /* @__PURE__ */ jsxs("button", {
										onClick: () => handleUpdateStatus(conf.id, conf.status === 1 ? 0 : 1, conf.validity),
										className: clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-1.5", conf.status === 1 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"),
										children: [conf.status === 1 ? /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }) : /* @__PURE__ */ jsx(Clock, { size: 12 }), conf.status === 1 ? "Diproses" : "Pending"]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex gap-1.5 flex-wrap",
										children: [/* @__PURE__ */ jsx("button", {
											onClick: () => handleUpdateStatus(conf.id, conf.status, "valid"),
											className: clsx("px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight transition-all", conf.validity === "valid" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"),
											children: "Valid"
										}), /* @__PURE__ */ jsx("button", {
											onClick: () => handleUpdateStatus(conf.id, conf.status, "invalid"),
											className: clsx("px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight transition-all", conf.validity === "invalid" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"),
											children: "Invalid"
										})]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4 text-right",
									children: /* @__PURE__ */ jsxs("p", {
										className: "text-[10px] text-slate-400 font-medium",
										children: ["Masuk: ", (/* @__PURE__ */ new Date(conf.created_at.replace(" ", "T") + "Z")).toLocaleString("id-ID")]
									})
								})
							]
						}, conf.id))
					})]
				})
			})]
		})]
	});
}
//#endregion
//#region src/pages/AdminOrders.jsx
function AdminOrders() {
	const [searchParams, setSearchParams] = useSearchParams();
	const urlCustomerId = searchParams.get("customer_id") || "";
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [filterPayment, setFilterPayment] = useState("all");
	const [filterRegistered, setFilterRegistered] = useState("all");
	const [filterCustomerId, setFilterCustomerId] = useState(urlCustomerId);
	const [filterCustomerName, setFilterCustomerName] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalOrders, setTotalOrders] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const itemsPerPage = 10;
	const [editingFees, setEditingFees] = useState(null);
	const [editingItems, setEditingItems] = useState(null);
	const [availableProducts, setAvailableProducts] = useState([]);
	const [creatingOrder, setCreatingOrder] = useState(false);
	const [newOrderForm, setNewOrderForm] = useState({
		name: "",
		phone: "",
		address: "",
		order_type: "delivery",
		items: [],
		shippingFee: "",
		additionalFee: ""
	});
	const [registeredCustomers, setRegisteredCustomers] = useState([]);
	const [selectedCustomerId, setSelectedCustomerId] = useState("");
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const { adminToken, setShowLogin } = useOutletContext();
	const fetchOrders = async (page = currentPage, search = searchTerm, status = filterStatus, payment = filterPayment, registered = filterRegistered, customerId = filterCustomerId) => {
		try {
			setLoading(true);
			const params = new URLSearchParams({
				page: page.toString(),
				limit: itemsPerPage.toString(),
				search: search.trim(),
				status,
				payment_status: payment,
				registered
			});
			if (customerId) params.set("customer_id", customerId);
			const response = await fetch(`${apiUrl}/admin/orders?${params.toString()}`, { headers: { "Authorization": `Bearer ${adminToken}` } });
			if (response.status === 401) {
				setShowLogin(true);
				return;
			}
			const resData = await response.json();
			if (resData.pagination) {
				setOrders(resData.data || []);
				setTotalOrders(resData.pagination.total);
				setTotalPages(resData.pagination.totalPages || 1);
			} else {
				const dataList = Array.isArray(resData) ? resData : resData.data || [];
				setOrders(dataList);
				setTotalOrders(dataList.length);
				setTotalPages(Math.ceil(dataList.length / itemsPerPage) || 1);
			}
		} catch (err) {
			setError("Gagal memuat pesanan");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (adminToken) fetchOrders(currentPage, searchTerm, filterStatus, filterPayment, filterRegistered, filterCustomerId);
	}, [
		adminToken,
		currentPage,
		searchTerm,
		filterStatus,
		filterPayment,
		filterRegistered,
		filterCustomerId
	]);
	useEffect(() => {
		setFilterCustomerId(urlCustomerId);
		setCurrentPage(1);
	}, [urlCustomerId]);
	useEffect(() => {
		if (!filterCustomerId) {
			setFilterCustomerName("");
			return;
		}
		let cancelled = false;
		fetch(`${apiUrl}/admin/customers?search=${encodeURIComponent(filterCustomerId)}&limit=5`, { headers: { "Authorization": `Bearer ${adminToken}` } }).then((res) => res.json()).then((data) => {
			if (!cancelled) {
				const customer = (data.data || []).find((c) => c.id === filterCustomerId);
				setFilterCustomerName(customer ? customer.name : "");
			}
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [
		filterCustomerId,
		adminToken,
		apiUrl
	]);
	const clearCustomerFilter = () => {
		setSearchParams({});
	};
	const handleUpdateOrder = async (id, status, payment_status, shipping_fee, additional_fee) => {
		try {
			const body = {
				status,
				payment_status
			};
			if (shipping_fee !== void 0) body.shipping_fee = shipping_fee;
			if (additional_fee !== void 0) body.additional_fee = additional_fee;
			if ((await fetch(`${apiUrl}/admin/orders/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify(body)
			})).ok) fetchOrders();
		} catch (err) {
			alert("Gagal mengupdate pesanan");
		}
	};
	const handleOpenEditItems = async (orderId, orderHash) => {
		try {
			setLoading(true);
			const [orderRes, productsRes] = await Promise.all([fetch(`${apiUrl}/orders/${orderHash}`), fetch(`${apiUrl}/products`)]);
			const orderData = await orderRes.json();
			const productsData = await productsRes.json();
			if (orderData.success) {
				setAvailableProducts(productsData.filter((p) => p.available));
				setEditingItems({
					id: orderId,
					hash: orderHash,
					items: orderData.items
				});
			} else alert("Gagal memuat pesanan: " + orderData.message);
		} catch (err) {
			alert("Gagal memuat detail item pesanan");
		} finally {
			setLoading(false);
		}
	};
	const handleSaveItems = async () => {
		try {
			const requestItems = editingItems.items.map((item) => ({
				product_id: item.product_id,
				quantity: parseInt(item.quantity)
			}));
			const response = await fetch(`${apiUrl}/admin/orders/${editingItems.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify({ items: requestItems })
			});
			if (response.ok) {
				setEditingItems(null);
				fetchOrders();
			} else {
				const errData = await response.json();
				alert("Gagal menyimpan item: " + errData.message);
			}
		} catch (err) {
			alert("Gagal menyimpan item pesanan");
		}
	};
	const handleOpenCreateOrder = async () => {
		const tasks = [];
		if (availableProducts.length === 0) tasks.push(fetch(`${apiUrl}/products`).then((res) => res.json()).then((data) => setAvailableProducts(data.filter((p) => p.available))));
		tasks.push(fetch(`${apiUrl}/admin/customers?limit=100`, { headers: { "Authorization": `Bearer ${adminToken}` } }).then((res) => {
			if (res.status === 401) {
				setShowLogin(true);
				return null;
			}
			return res.json();
		}).then((data) => setRegisteredCustomers(data?.data || [])));
		try {
			await Promise.all(tasks);
		} catch (e) {
			console.error("Gagal memuat data", e);
		}
		setSelectedCustomerId("");
		setCreatingOrder(true);
	};
	const handleCreateOrder = async () => {
		if (!newOrderForm.name || !newOrderForm.phone || newOrderForm.items.length === 0) {
			alert("Pastikan nama, HP, dan setidaknya 1 item telah diisi.");
			return;
		}
		try {
			const response = await fetch(`${apiUrl}/admin/orders`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify({
					customer: {
						name: newOrderForm.name,
						phone: newOrderForm.phone,
						address: newOrderForm.address,
						order_type: newOrderForm.order_type
					},
					items: newOrderForm.items,
					shippingFee: Number(newOrderForm.shippingFee) || 0,
					additionalFee: Number(newOrderForm.additionalFee) || 0,
					customer_id: selectedCustomerId || null
				})
			});
			if (response.ok) {
				setCreatingOrder(false);
				setNewOrderForm({
					name: "",
					phone: "",
					address: "",
					order_type: "delivery",
					items: [],
					shippingFee: "",
					additionalFee: ""
				});
				setSelectedCustomerId("");
				fetchOrders();
			} else {
				const errData = await response.json();
				alert("Gagal membuat pesanan: " + errData.message);
			}
		} catch (err) {
			alert("Gagal membuat pesanan");
		}
	};
	useEffect(() => {
		setCurrentPage(1);
	}, [
		searchTerm,
		filterStatus,
		filterPayment,
		filterRegistered
	]);
	const getStatusColor = (status) => {
		switch (status) {
			case "pending": return "bg-amber-100 text-amber-700 hover:bg-amber-200";
			case "pending payment": return "bg-orange-100 text-orange-700 hover:bg-orange-200";
			case "inprogress": return "bg-blue-100 text-blue-700 hover:bg-blue-200";
			case "complete": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
			case "cancelled": return "bg-rose-100 text-rose-700 hover:bg-rose-200";
			default: return "bg-slate-100 text-slate-700 hover:bg-slate-200";
		}
	};
	const getPaymentStatusColor = (status) => {
		switch (status) {
			case "unpaid": return "bg-amber-100 text-amber-700 hover:bg-amber-200";
			case "confirmation": return "bg-lime-100 text-lime-700 hover:bg-lime-200";
			case "paid": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
			default: return "bg-slate-100 text-slate-700 hover:bg-slate-200";
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-7xl mx-auto px-4 py-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-4 mb-8",
				children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white",
						children: /* @__PURE__ */ jsx(ShoppingBag, { size: 24 })
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-black text-slate-900 tracking-tight",
						children: "Kelola Pesanan"
					})]
				}) }), /* @__PURE__ */ jsx("div", {
					className: "flex gap-3",
					style: { overflowX: "auto" },
					children: /* @__PURE__ */ jsxs("button", {
						onClick: handleOpenCreateOrder,
						className: "flex items-center gap-2 bg-lime-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-lime-700 transition-colors shadow-sm whitespace-nowrap",
						children: [/* @__PURE__ */ jsx(Plus, { size: 18 }), " Buat Pesanan"]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 w-full sm:w-auto flex-1",
							children: [/* @__PURE__ */ jsx(Search, {
								className: "text-slate-400",
								size: 20
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "Cari ID, nama pelanggan, atau telepon...",
								className: "bg-transparent border-none outline-none w-full font-medium text-slate-600",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value)
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 w-full sm:w-auto",
							children: [
								/* @__PURE__ */ jsxs("select", {
									value: filterStatus,
									onChange: (e) => setFilterStatus(e.target.value),
									className: "bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "Semua Status"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "pending",
											children: "Pending"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "pending payment",
											children: "Pending Payment"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "inprogress",
											children: "Proses"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "complete",
											children: "Selesai"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "cancelled",
											children: "Batal"
										})
									]
								}),
								/* @__PURE__ */ jsxs("select", {
									value: filterPayment,
									onChange: (e) => setFilterPayment(e.target.value),
									className: "bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "Semua Pembayaran"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "unpaid",
											children: "Belum Bayar"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "confirmation",
											children: "Konfirmasi"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "paid",
											children: "Terbayar"
										})
									]
								}),
								/* @__PURE__ */ jsxs("select", {
									value: filterRegistered,
									onChange: (e) => setFilterRegistered(e.target.value),
									className: "bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "Semua Pelanggan"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "registered",
											children: "Pelanggan Terdaftar"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "guest",
											children: "Tamu"
										})
									]
								})
							]
						})]
					}),
					filterCustomerId && /* @__PURE__ */ jsxs("div", {
						className: "px-4 py-3 bg-lime-50 border-b border-lime-100 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-sm font-bold text-lime-800",
							children: ["Menampilkan pesanan dari pelanggan: ", /* @__PURE__ */ jsx("span", {
								className: "font-black",
								children: filterCustomerName || filterCustomerId
							})]
						}), /* @__PURE__ */ jsx("button", {
							onClick: clearCustomerFilter,
							className: "text-xs font-bold text-lime-700 bg-white border border-lime-200 px-3 py-1.5 rounded-xl hover:bg-lime-100 transition-colors",
							children: "Hapus Filter"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "Pesanan"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "Pelanggan"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "Total"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "Status Pesanan"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "Pembayaran"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4 text-right",
										children: "Aksi"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-50",
								children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: "6",
									className: "px-6 py-12 text-center text-slate-400",
									children: "Memuat..."
								}) }) : orders.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: "6",
									className: "px-6 py-12 text-center text-slate-400",
									children: "Tidak ada pesanan ditemukan."
								}) }) : orders.map((order) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/50 transition-colors",
									children: [
										/* @__PURE__ */ jsxs("td", {
											className: "px-6 py-4",
											children: [/* @__PURE__ */ jsxs("p", {
												className: "font-bold text-slate-900 text-sm",
												children: ["#", order.id]
											}), /* @__PURE__ */ jsxs("p", {
												className: "text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1",
												children: [
													/* @__PURE__ */ jsx(Calendar, { size: 10 }),
													" ",
													(/* @__PURE__ */ new Date(order.created_at.replace(" ", "T") + "Z")).toLocaleString("id-ID")
												]
											})]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex flex-col gap-0.5",
												children: [
													/* @__PURE__ */ jsxs("p", {
														className: "font-bold text-slate-900 text-sm flex items-center gap-1",
														children: [
															/* @__PURE__ */ jsx(User, {
																size: 12,
																className: "text-slate-400"
															}),
															" ",
															order.customer_name,
															order.customer_id && /* @__PURE__ */ jsx("span", {
																className: "text-[9px] font-black uppercase tracking-widest bg-lime-50 text-lime-700 border border-lime-100 px-1.5 py-0.5 rounded-md ml-1",
																children: "Terdaftar"
															})
														]
													}),
													/* @__PURE__ */ jsxs("p", {
														className: "text-xs text-slate-500 flex items-center gap-1",
														children: [
															/* @__PURE__ */ jsx(Phone, {
																size: 10,
																className: "text-slate-400"
															}),
															" ",
															order.customer_phone
														]
													}),
													/* @__PURE__ */ jsxs("p", {
														className: "text-[10px] text-slate-400 truncate max-w-[200px] flex items-center gap-1",
														children: [
															/* @__PURE__ */ jsx(MapPin, {
																size: 10,
																className: "text-slate-400"
															}),
															" ",
															order.customer_address
														]
													})
												]
											})
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "px-6 py-4",
											children: [/* @__PURE__ */ jsxs("p", {
												className: "font-black text-rose-600 text-sm",
												children: ["Rp ", order.total_amount.toLocaleString("id-ID")]
											}), order.voucher_code && /* @__PURE__ */ jsxs("p", {
												className: "text-[10px] text-lime-700 font-bold bg-lime-50 border border-lime-100 px-2 py-0.5 rounded-md inline-block mt-1",
												children: [
													"Voucher: ",
													order.voucher_code,
													" ",
													order.discount_amount === 0 ? "(Bonus)" : ""
												]
											})]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsxs("select", {
												value: order.status,
												onChange: (e) => handleUpdateOrder(order.id, e.target.value, order.payment_status),
												className: clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer", getStatusColor(order.status)),
												children: [
													/* @__PURE__ */ jsx("option", {
														value: "pending",
														children: "Pending"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "pending payment",
														children: "Pending Payment"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "inprogress",
														children: "Proses"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "complete",
														children: "Selesai"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "cancelled",
														children: "Batal"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsxs("select", {
												value: order.payment_status,
												onChange: (e) => handleUpdateOrder(order.id, order.status, e.target.value),
												className: clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer", getPaymentStatusColor(order.payment_status)),
												children: [
													/* @__PURE__ */ jsx("option", {
														value: "unpaid",
														children: "Belum Bayar"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "confirmation",
														children: "Konfirmasi"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "paid",
														children: "Terbayar"
													})
												]
											})
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "px-6 py-4 text-right flex flex-col gap-2 items-end justify-center h-full min-h-[5rem]",
											children: [/* @__PURE__ */ jsx(Link, {
												to: `/orders/${order.hash}`,
												className: "text-xs font-bold text-lime-600 hover:underline",
												children: "Detail"
											}), (order.status === "pending" || order.status === "pending payment") && /* @__PURE__ */ jsxs("div", {
												className: "flex flex-col gap-1 w-full mt-2",
												children: [/* @__PURE__ */ jsx("button", {
													onClick: () => setEditingFees({
														id: order.id,
														shipping_fee: order.shipping_fee || 0,
														additional_fee: order.additional_fee || 0
													}),
													className: "w-full text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1.5 rounded-md hover:bg-orange-100 transition-colors border border-orange-100",
													children: "Sesuaikan Biaya"
												}), /* @__PURE__ */ jsx("button", {
													onClick: () => handleOpenEditItems(order.id, order.hash),
													className: "w-full text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1.5 rounded-md hover:bg-blue-100 transition-colors border border-blue-100",
													children: "Edit Item"
												})]
											})]
										})
									]
								}, order.id))
							})]
						})
					}),
					!loading && totalOrders > 0 && /* @__PURE__ */ jsxs("div", {
						className: "p-4 border-t border-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 bg-slate-50/30",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							"Menampilkan ",
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-slate-700",
								children: Math.min((currentPage - 1) * itemsPerPage + 1, totalOrders)
							}),
							" hingga ",
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-slate-700",
								children: Math.min(currentPage * itemsPerPage, totalOrders)
							}),
							" dari ",
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-slate-700",
								children: totalOrders
							}),
							" pesanan"
						] }), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
									disabled: currentPage === 1,
									className: "px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm",
									children: "Sebelumnya"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center px-4 font-bold text-slate-700",
									children: [
										"Hal ",
										currentPage,
										" dari ",
										totalPages || 1
									]
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
									disabled: currentPage >= totalPages || totalPages === 0,
									className: "px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm",
									children: "Selanjutnya"
								})
							]
						})]
					})
				]
			}),
			editingFees && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "text-lg font-black text-slate-900 mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Ticket, {
								className: "text-lime-600",
								size: 20
							}), "Sesuaikan Biaya Pesanan"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold text-slate-500 mb-1",
								children: "Ongkos Kirim"
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("span", {
									className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm",
									children: "Rp"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									value: editingFees.shipping_fee,
									onChange: (e) => setEditingFees({
										...editingFees,
										shipping_fee: e.target.value === "" ? "" : Number(e.target.value)
									}),
									className: "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none font-bold text-slate-700",
									placeholder: "0"
								})]
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold text-slate-500 mb-1",
								children: "Biaya Tambahan"
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("span", {
									className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm",
									children: "Rp"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									value: editingFees.additional_fee,
									onChange: (e) => setEditingFees({
										...editingFees,
										additional_fee: e.target.value === "" ? "" : Number(e.target.value)
									}),
									className: "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none font-bold text-slate-700",
									placeholder: "0"
								})]
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 mt-8",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setEditingFees(null),
								className: "flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors",
								children: "Batal"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => {
									const order = orders.find((o) => o.id === editingFees.id);
									handleUpdateOrder(editingFees.id, order.status, order.payment_status, Number(editingFees.shipping_fee) || 0, Number(editingFees.additional_fee) || 0);
									setEditingFees(null);
								},
								className: "flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md",
								children: "Simpan Biaya"
							})]
						})
					]
				})
			}),
			editingItems && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] flex flex-col",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "text-lg font-black text-slate-900 mb-4 flex items-center gap-2 flex-shrink-0",
							children: [
								/* @__PURE__ */ jsx(Package, {
									className: "text-lime-600",
									size: 20
								}),
								"Edit Item Pesanan #",
								editingItems.id
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "overflow-y-auto pr-2 space-y-4 flex-1",
							children: [editingItems.items.map((item, index) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold text-sm text-slate-700 truncate",
										children: item.product_name
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-slate-500",
										children: ["Rp ", (item.price || 0).toLocaleString("id-ID")]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 ml-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "relative w-16",
										children: /* @__PURE__ */ jsx("input", {
											type: "number",
											min: "1",
											className: "w-full pl-2 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-center font-bold text-sm focus:ring-2 focus:ring-lime-500",
											value: item.quantity,
											onChange: (e) => {
												const newItems = [...editingItems.items];
												newItems[index].quantity = e.target.value;
												setEditingItems({
													...editingItems,
													items: newItems
												});
											}
										})
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => {
											const newItems = editingItems.items.filter((_, i) => i !== index);
											setEditingItems({
												...editingItems,
												items: newItems
											});
										},
										className: "text-rose-400 p-1 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors",
										title: "Hapus Item",
										children: /* @__PURE__ */ jsx(XCircle, { size: 20 })
									})]
								})]
							}, index)), /* @__PURE__ */ jsxs("div", {
								className: "mt-6 pt-4 border-t border-slate-100",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-500 mb-2",
									children: "Tambah Item Baru"
								}), /* @__PURE__ */ jsxs("select", {
									className: "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700 text-sm focus:ring-2 focus:ring-lime-500",
									onChange: (e) => {
										const productId = parseInt(e.target.value);
										if (!productId) return;
										const product = availableProducts.find((p) => p.id === productId);
										if (product) setEditingItems({
											...editingItems,
											items: [...editingItems.items, {
												product_id: product.id,
												product_name: product.name,
												price: product.price,
												quantity: 1
											}]
										});
										e.target.value = "";
									},
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "-- Pilih Produk --"
									}), availableProducts.map((p) => /* @__PURE__ */ jsxs("option", {
										value: p.id,
										children: [
											p.name,
											" - Rp ",
											p.price.toLocaleString("id-ID")
										]
									}, p.id))]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 mt-6 pt-6 border-t border-slate-100 flex-shrink-0",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setEditingItems(null),
								className: "flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors",
								children: "Batal"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleSaveItems,
								disabled: editingItems.items.length === 0,
								className: "flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md disabled:opacity-50",
								children: "Simpan Items"
							})]
						})
					]
				})
			}),
			creatingOrder && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-3xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "text-xl font-black text-slate-900 mb-6 flex items-center gap-2 flex-shrink-0 border-b border-slate-100 pb-4",
							children: [/* @__PURE__ */ jsx(Plus, {
								className: "text-lime-600",
								size: 24
							}), "Buat Pesanan Baru"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "overflow-y-auto pr-2 flex-1 space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "sm:col-span-2",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-bold text-slate-500 mb-1",
												children: "Pelanggan Terdaftar"
											}),
											/* @__PURE__ */ jsxs("select", {
												value: selectedCustomerId,
												onChange: (e) => {
													const customerId = e.target.value;
													setSelectedCustomerId(customerId);
													const customer = registeredCustomers.find((c) => c.id === customerId);
													setNewOrderForm((prev) => ({
														...prev,
														name: customer ? customer.name : ""
													}));
												},
												className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
												children: [/* @__PURE__ */ jsx("option", {
													value: "",
													children: "-- Pelanggan Biasa (Tanpa Akun) --"
												}), registeredCustomers.map((c) => /* @__PURE__ */ jsxs("option", {
													value: c.id,
													children: [
														c.name,
														" (",
														c.email,
														")"
													]
												}, c.id))]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-[11px] text-slate-400 mt-1",
												children: "Pilih akun Google terdaftar untuk menautkan pesanan ini ke pelanggan tersebut."
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold text-slate-500 mb-1",
										children: "Nama Pelanggan *"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: newOrderForm.name,
										onChange: (e) => setNewOrderForm({
											...newOrderForm,
											name: e.target.value
										}),
										className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
										placeholder: "Nama"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold text-slate-500 mb-1",
										children: "No. HP / WhatsApp *"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: newOrderForm.phone,
										onChange: (e) => setNewOrderForm({
											...newOrderForm,
											phone: e.target.value
										}),
										className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
										placeholder: "08..."
									})] }),
									/* @__PURE__ */ jsxs("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-bold text-slate-500 mb-1",
											children: "Tipe Pesanan"
										}), /* @__PURE__ */ jsxs("select", {
											value: newOrderForm.order_type,
											onChange: (e) => setNewOrderForm({
												...newOrderForm,
												order_type: e.target.value
											}),
											className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
											children: [/* @__PURE__ */ jsx("option", {
												value: "delivery",
												children: "Delivery"
											}), /* @__PURE__ */ jsx("option", {
												value: "pickup",
												children: "Pickup"
											})]
										})]
									}),
									newOrderForm.order_type === "delivery" && /* @__PURE__ */ jsxs("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-bold text-slate-500 mb-1",
											children: "Alamat (Untuk Delivery)"
										}), /* @__PURE__ */ jsx("textarea", {
											rows: "2",
											value: newOrderForm.address,
											onChange: (e) => setNewOrderForm({
												...newOrderForm,
												address: e.target.value
											}),
											className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
											placeholder: "Alamat lengkap..."
										})]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold text-slate-500 mb-1",
										children: "Ongkos Kirim"
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										value: newOrderForm.shippingFee,
										onChange: (e) => setNewOrderForm({
											...newOrderForm,
											shippingFee: e.target.value
										}),
										className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
										placeholder: "0"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold text-slate-500 mb-1",
										children: "Biaya Tambahan"
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										value: newOrderForm.additionalFee,
										onChange: (e) => setNewOrderForm({
											...newOrderForm,
											additionalFee: e.target.value
										}),
										className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 text-sm font-bold text-slate-700",
										placeholder: "0"
									})] })
								]
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h4", {
									className: "font-bold text-slate-800 mb-3 block pb-2 border-b border-slate-100 flex items-center justify-between",
									children: /* @__PURE__ */ jsx("span", { children: "Item Pesanan *" })
								}),
								newOrderForm.items.length === 0 ? /* @__PURE__ */ jsx("div", {
									className: "bg-slate-50 rounded-xl p-4 text-center text-sm text-slate-500 mb-4 border-2 border-dashed border-slate-200",
									children: "Belum ada item ditambahkan."
								}) : /* @__PURE__ */ jsx("div", {
									className: "space-y-3 mb-4",
									children: newOrderForm.items.map((item, index) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ jsx("p", {
												className: "font-bold text-sm text-slate-700 truncate",
												children: item.name
											}), /* @__PURE__ */ jsxs("p", {
												className: "text-xs text-slate-500",
												children: ["Rp ", (item.price || 0).toLocaleString("id-ID")]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 ml-4",
											children: [/* @__PURE__ */ jsx("input", {
												type: "number",
												min: "1",
												className: "w-16 pl-2 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-center font-bold text-sm focus:ring-2 focus:ring-lime-500",
												value: item.quantity,
												onChange: (e) => {
													const newItems = [...newOrderForm.items];
													newItems[index].quantity = parseInt(e.target.value) || 1;
													setNewOrderForm({
														...newOrderForm,
														items: newItems
													});
												}
											}), /* @__PURE__ */ jsx("button", {
												onClick: () => {
													const newItems = newOrderForm.items.filter((_, i) => i !== index);
													setNewOrderForm({
														...newOrderForm,
														items: newItems
													});
												},
												className: "text-rose-400 p-1 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors",
												children: /* @__PURE__ */ jsx(XCircle, { size: 18 })
											})]
										})]
									}, index))
								}),
								/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
									className: "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700 text-sm focus:ring-2 focus:ring-lime-500",
									onChange: (e) => {
										const productId = parseInt(e.target.value);
										if (!productId) return;
										const product = availableProducts.find((p) => p.id === productId);
										if (product) setNewOrderForm({
											...newOrderForm,
											items: [...newOrderForm.items, {
												id: product.id,
												name: product.name,
												price: product.price,
												quantity: 1
											}]
										});
										e.target.value = "";
									},
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "-- Tambah Produk --"
									}), availableProducts.map((p) => /* @__PURE__ */ jsxs("option", {
										value: p.id,
										children: [
											p.name,
											" - Rp ",
											p.price.toLocaleString("id-ID")
										]
									}, p.id))]
								}) })
							] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 mt-6 pt-6 border-t border-slate-100 flex-shrink-0",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setCreatingOrder(false),
								className: "flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors",
								children: "Batal"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleCreateOrder,
								disabled: newOrderForm.items.length === 0 || !newOrderForm.name || !newOrderForm.phone,
								className: "flex-1 px-4 py-3 bg-lime-600 text-white font-bold rounded-xl hover:bg-lime-700 transition-colors shadow-md disabled:opacity-50",
								children: "Buat Pesanan"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/pages/AdminCustomers.jsx
function AdminCustomers() {
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCustomers, setTotalCustomers] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const itemsPerPage = 10;
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const { adminToken, setShowLogin } = useOutletContext();
	const fetchCustomers = async (page = currentPage, search = searchTerm) => {
		try {
			setLoading(true);
			const params = new URLSearchParams({
				page: page.toString(),
				limit: itemsPerPage.toString(),
				search: search.trim()
			});
			const response = await fetch(`${apiUrl}/admin/customers?${params.toString()}`, { headers: { "Authorization": `Bearer ${adminToken}` } });
			if (response.status === 401) {
				setShowLogin(true);
				return;
			}
			const resData = await response.json();
			setCustomers(resData.data || []);
			setTotalCustomers(resData.pagination?.total || 0);
			setTotalPages(resData.pagination?.totalPages || 1);
		} catch (err) {
			setError("Gagal memuat daftar pelanggan");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (adminToken) fetchCustomers(currentPage, searchTerm);
	}, [
		adminToken,
		currentPage,
		searchTerm
	]);
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-7xl mx-auto px-4 py-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap items-center justify-between gap-4 mb-8",
				children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white",
						children: /* @__PURE__ */ jsx(Users, { size: 24 })
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-black text-slate-900 tracking-tight",
						children: "Kelola Pelanggan"
					})]
				}) })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50",
						children: [/* @__PURE__ */ jsx(Search, {
							className: "text-slate-400",
							size: 20
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Cari nama, email, atau ID pelanggan...",
							className: "bg-transparent border-none outline-none w-full font-medium text-slate-600",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value)
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "Pelanggan"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "ID"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "Email"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "Total Pesanan"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4",
										children: "Terdaftar Sejak"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-50",
								children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: "5",
									className: "px-6 py-12 text-center text-slate-400",
									children: "Memuat..."
								}) }) : customers.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: "5",
									className: "px-6 py-12 text-center text-slate-400",
									children: "Tidak ada pelanggan ditemukan."
								}) }) : customers.map((customer) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/50 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx("img", {
													src: customer.picture || "/default-avatar.png",
													alt: customer.name,
													className: "w-10 h-10 rounded-full border border-slate-200 shadow-sm"
												}), /* @__PURE__ */ jsx("p", {
													className: "font-bold text-slate-900 text-sm",
													children: customer.name
												})]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsx("span", {
												className: "inline-block px-3 py-1 bg-slate-100 rounded-lg text-slate-700 font-mono font-bold text-xs border border-slate-200",
												children: customer.id
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsxs("p", {
												className: "text-sm text-slate-600 flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ jsx(Mail, {
														size: 12,
														className: "text-slate-400"
													}),
													" ",
													customer.email
												]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsxs(Link, {
												to: `/admin/orders?customer_id=${encodeURIComponent(customer.id)}`,
												className: "flex items-center gap-1.5 text-sm font-bold text-lime-700 w-fit px-3 py-1 rounded-full bg-lime-50 border border-lime-100 hover:bg-lime-100 hover:border-lime-200 transition-colors",
												title: "Lihat pesanan pelanggan ini",
												children: [
													/* @__PURE__ */ jsx(ShoppingBag, { size: 12 }),
													" ",
													customer.order_count || 0
												]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsxs("p", {
												className: "text-sm text-slate-500 flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Calendar, {
													size: 12,
													className: "text-slate-400"
												}), customer.created_at ? (/* @__PURE__ */ new Date(customer.created_at.replace(" ", "T") + "Z")).toLocaleDateString("id-ID") : "-"]
											})
										})
									]
								}, customer.id))
							})]
						})
					}),
					!loading && totalCustomers > 0 && /* @__PURE__ */ jsxs("div", {
						className: "p-4 border-t border-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 bg-slate-50/30",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							"Menampilkan ",
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-slate-700",
								children: Math.min((currentPage - 1) * itemsPerPage + 1, totalCustomers)
							}),
							" hingga ",
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-slate-700",
								children: Math.min(currentPage * itemsPerPage, totalCustomers)
							}),
							" dari ",
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-slate-700",
								children: totalCustomers
							}),
							" pelanggan"
						] }), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
									disabled: currentPage === 1,
									className: "px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm",
									children: "Sebelumnya"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center px-4 font-bold text-slate-700",
									children: [
										"Hal ",
										currentPage,
										" dari ",
										totalPages || 1
									]
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
									disabled: currentPage >= totalPages || totalPages === 0,
									className: "px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-semibold transition-all shadow-sm",
									children: "Selanjutnya"
								})
							]
						})]
					})
				]
			}),
			error && /* @__PURE__ */ jsx("div", {
				className: "mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm",
				children: error
			})
		]
	});
}
//#endregion
//#region src/pages/AdminVouchers.jsx
function AdminVouchers() {
	const [vouchers, setVouchers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingVoucher, setEditingVoucher] = useState(null);
	const [formData, setFormData] = useState({
		code: "",
		type: "discount",
		amount: 0,
		reward_item_name: "",
		is_active: true,
		is_used: false
	});
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const { adminToken, setShowLogin } = useOutletContext();
	const fetchVouchers = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${apiUrl}/admin/vouchers`, { headers: { "Authorization": `Bearer ${adminToken}` } });
			if (response.status === 401) {
				setShowLogin(true);
				return;
			}
			setVouchers(await response.json() || []);
		} catch (err) {
			setError("Gagal memuat voucher");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (adminToken) fetchVouchers();
	}, [adminToken]);
	const handleToggleActive = async (voucher) => {
		try {
			if ((await fetch(`${apiUrl}/admin/vouchers/${voucher.code}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify({ is_active: !voucher.is_active })
			})).ok) fetchVouchers();
		} catch (err) {
			alert("Gagal mengupdate status");
		}
	};
	const handleDelete = async (code) => {
		if (!confirm("Apakah Anda yakin ingin menghapus voucher ini?")) return;
		try {
			if ((await fetch(`${apiUrl}/admin/vouchers/${code}`, {
				method: "DELETE",
				headers: { "Authorization": `Bearer ${adminToken}` }
			})).ok) fetchVouchers();
		} catch (err) {
			alert("Gagal menghapus voucher");
		}
	};
	const handleOpenModal = (voucher = null) => {
		if (voucher) {
			setEditingVoucher(voucher);
			setFormData({
				code: voucher.code,
				type: voucher.type || (voucher.reward_item_name ? "free_item" : "discount"),
				amount: voucher.amount || 0,
				reward_item_name: voucher.reward_item_name || "",
				is_active: voucher.is_active ? true : false,
				is_used: voucher.is_used ? true : false
			});
		} else {
			setEditingVoucher(null);
			setFormData({
				code: "",
				type: "discount",
				amount: 0,
				reward_item_name: "",
				is_active: true,
				is_used: false
			});
		}
		setIsModalOpen(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.type === "discount" && (!formData.amount || formData.amount <= 0)) {
			alert("Nominal potongan harga harus lebih dari 0");
			return;
		}
		if (formData.type === "free_item" && !formData.reward_item_name.trim()) {
			alert("Nama item gratis wajib diisi");
			return;
		}
		const method = editingVoucher ? "PUT" : "POST";
		const url = editingVoucher ? `${apiUrl}/admin/vouchers/${editingVoucher.code}` : `${apiUrl}/admin/vouchers`;
		try {
			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify({
					...formData,
					amount: formData.type === "free_item" ? 0 : formData.amount,
					reward_item_name: formData.type === "free_item" ? formData.reward_item_name.trim() : null
				})
			});
			if (response.ok) {
				setIsModalOpen(false);
				fetchVouchers();
			} else {
				const data = await response.json();
				alert(data.message || "Gagal menyimpan voucher");
			}
		} catch (err) {
			alert("Gagal menyimpan voucher");
		}
	};
	const filteredVouchers = vouchers.filter((v) => v.code.toLowerCase().includes(searchTerm.toLowerCase()));
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-6xl mx-auto px-4 py-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-4 mb-8",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-3 mb-2",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "text-sm text-slate-500 hover:text-lime-600 flex items-center gap-1",
						children: [/* @__PURE__ */ jsx(ChevronLeft, { size: 16 }), " Kembali"]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white",
						children: /* @__PURE__ */ jsx(Ticket, { size: 24 })
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-black text-slate-900 tracking-tight",
						children: "Kelola Voucher"
					})]
				})] }), /* @__PURE__ */ jsx("div", {
					className: "flex gap-3",
					children: /* @__PURE__ */ jsxs("button", {
						onClick: () => handleOpenModal(),
						className: "bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-lime-200",
						children: [/* @__PURE__ */ jsx(Plus, { size: 20 }), "Tambah Voucher"]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "p-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50",
					children: [/* @__PURE__ */ jsx(Search, {
						className: "text-slate-400",
						size: 20
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Cari kode voucher...",
						className: "bg-transparent border-none outline-none w-full font-medium text-slate-600",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value)
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4",
									children: "Kode Voucher"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4",
									children: "Tipe / Manfaat"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4",
									children: "Digunakan?"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-4 text-right",
									children: "Aksi"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-50",
							children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: "5",
								className: "px-6 py-12 text-center text-slate-400",
								children: "Memuat..."
							}) }) : filteredVouchers.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: "5",
								className: "px-6 py-12 text-center text-slate-400",
								children: "Tidak ada voucher ditemukan."
							}) }) : filteredVouchers.map((v) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50/50 transition-colors group",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "px-6 py-4",
										children: /* @__PURE__ */ jsx("div", {
											className: "inline-block px-3 py-1.5 bg-slate-100 rounded-lg text-slate-900 font-mono font-bold text-sm border border-slate-200",
											children: v.code
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-6 py-4",
										children: v.type === "free_item" || v.reward_item_name ? /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl w-fit text-xs",
											children: [/* @__PURE__ */ jsx(Gift, {
												size: 14,
												className: "text-emerald-500 shrink-0"
											}), /* @__PURE__ */ jsxs("span", { children: ["Gratis: ", v.reward_item_name || "Item"] })]
										}) : /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 font-black text-lime-600 text-sm",
											children: [/* @__PURE__ */ jsx(Percent, {
												size: 14,
												className: "text-lime-500 shrink-0"
											}), /* @__PURE__ */ jsxs("span", { children: ["Rp ", (v.amount || 0).toLocaleString("id-ID")] })]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-6 py-4",
										children: /* @__PURE__ */ jsxs("button", {
											onClick: () => handleToggleActive(v),
											className: clsx("flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all w-fit", v.is_active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"),
											children: [v.is_active ? /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }) : /* @__PURE__ */ jsx(XCircle, { size: 12 }), v.is_active ? "Aktif" : "Nonaktif"]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-6 py-4",
										children: v.is_used ? /* @__PURE__ */ jsx("span", {
											className: "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 w-fit",
											children: "Ya"
										}) : /* @__PURE__ */ jsx("span", {
											className: "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit",
											children: "Belum"
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-6 py-4 text-right",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex justify-end gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
											children: [/* @__PURE__ */ jsx("button", {
												onClick: () => handleOpenModal(v),
												className: "p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all",
												children: /* @__PURE__ */ jsx(Edit2, { size: 18 })
											}), /* @__PURE__ */ jsx("button", {
												onClick: () => handleDelete(v.code),
												className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all",
												children: /* @__PURE__ */ jsx(Trash2, { size: 18 })
											})]
										})
									})
								]
							}, v.code))
						})]
					})
				})]
			}),
			isModalOpen && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-[200] flex items-center justify-center p-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm",
					onClick: () => setIsModalOpen(false)
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300",
					children: [/* @__PURE__ */ jsx("div", {
						className: "p-8 border-b border-slate-100 bg-slate-50/50",
						children: /* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-black text-slate-900 tracking-tight",
							children: editingVoucher ? "Edit Voucher" : "Tambah Voucher"
						})
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "p-8 space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
								children: "Kode Voucher"
							}), /* @__PURE__ */ jsx("input", {
								required: true,
								disabled: editingVoucher !== null,
								type: "text",
								className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900 uppercase font-mono disabled:opacity-50",
								placeholder: "Contoh: DISKON50",
								value: formData.code,
								onChange: (e) => setFormData({
									...formData,
									code: e.target.value.toUpperCase().trim()
								})
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
								children: "Tipe Manfaat"
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setFormData({
										...formData,
										type: "discount"
									}),
									className: clsx("p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer", formData.type === "discount" ? "bg-lime-50 border-lime-500 text-lime-800 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"),
									children: [/* @__PURE__ */ jsx(Percent, { size: 14 }), " Diskon (Rp)"]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setFormData({
										...formData,
										type: "free_item",
										amount: 0
									}),
									className: clsx("p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer", formData.type === "free_item" ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"),
									children: [/* @__PURE__ */ jsx(Gift, { size: 14 }), " Gratis Item"]
								})]
							})] }),
							formData.type === "discount" ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
								children: "Nilai Potongan (Rp)"
							}), /* @__PURE__ */ jsx("input", {
								required: true,
								type: "number",
								min: "1",
								className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900",
								value: formData.amount,
								onChange: (e) => setFormData({
									...formData,
									amount: parseInt(e.target.value) || 0
								})
							})] }) : /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
									children: "Nama Item Gratis"
								}),
								/* @__PURE__ */ jsx("input", {
									required: true,
									type: "text",
									placeholder: "Contoh: Es Jeruk, 1 Porsi Mendoan",
									className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900",
									value: formData.reward_item_name,
									onChange: (e) => setFormData({
										...formData,
										reward_item_name: e.target.value
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1.5 ml-1",
									children: "Item ini akan otomatis masuk ke struk pesanan & dapur sebagai item bonus gratis (Rp 0)."
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 py-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									id: "vp_active",
									className: "w-5 h-5 accent-lime-600 rounded",
									checked: formData.is_active,
									onChange: (e) => setFormData({
										...formData,
										is_active: e.target.checked
									})
								}), /* @__PURE__ */ jsx("label", {
									htmlFor: "vp_active",
									className: "text-sm font-bold text-slate-700",
									children: "Aktif (bisa digunakan)"
								})]
							}),
							editingVoucher && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 py-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									id: "vp_used",
									className: "w-5 h-5 accent-lime-600 rounded",
									checked: formData.is_used,
									onChange: (e) => setFormData({
										...formData,
										is_used: e.target.checked
									})
								}), /* @__PURE__ */ jsx("label", {
									htmlFor: "vp_used",
									className: "text-sm font-bold text-slate-700 line-through decoration-rose-500",
									children: "Sudah Digunakan"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 pt-4",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setIsModalOpen(false),
									className: "flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer",
									children: "Batal"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "flex-[2] px-6 py-4 rounded-2xl font-bold bg-slate-900 text-white hover:bg-lime-600 transition-all shadow-lg shadow-slate-200 cursor-pointer",
									children: "Simpan"
								})]
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/AdminSettings.jsx
function AdminSettings() {
	const [storeStatus, setStoreStatus] = useState("open");
	const [storeMessage, setStoreMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const apiUrl = "https://api-worker-dapur.rempoah.my.id";
	const { adminToken, setShowLogin } = useOutletContext();
	const fetchSettings = async () => {
		try {
			setLoading(true);
			const data = await (await fetch(`${apiUrl}/settings`)).json();
			if (data.store_status) setStoreStatus(data.store_status);
			if (data.store_message) setStoreMessage(data.store_message);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (adminToken) fetchSettings();
	}, [adminToken]);
	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			if ((await fetch(`${apiUrl}/admin/settings`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${adminToken}`
				},
				body: JSON.stringify({
					store_status: storeStatus,
					store_message: storeMessage
				})
			})).ok) alert("Pengaturan berhasil disimpan!");
			else alert("Gagal menyimpan pengaturan.");
		} catch (err) {
			alert("Gagal menyimpan pengaturan.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-6xl mx-auto px-4 py-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-4 mb-8",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-3 mb-2",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "text-sm text-slate-500 hover:text-lime-600 flex items-center gap-1",
					children: [/* @__PURE__ */ jsx(ChevronLeft, { size: 16 }), " Kembali"]
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white",
					children: /* @__PURE__ */ jsx(Settings, { size: 24 })
				}), /* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 tracking-tight",
					children: "Pengaturan Toko"
				})]
			})] }), /* @__PURE__ */ jsx("div", {
				className: "flex gap-3",
				style: { overflowX: "auto" }
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "p-8 border-b border-slate-100 bg-slate-50/50",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-slate-900",
					children: "Status Operasional"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500 mt-1",
					children: "Atur apakah toko menerima pesanan hari ini."
				})]
			}), loading ? /* @__PURE__ */ jsx("div", {
				className: "p-12 text-center text-slate-500",
				children: "Memuat pengaturan..."
			}) : /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSave,
				className: "p-8 space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-bold text-slate-700 mb-3",
						children: "Status Toko"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ jsx("input", {
								type: "radio",
								name: "storeStatus",
								value: "open",
								checked: storeStatus === "open",
								onChange: (e) => setStoreStatus(e.target.value),
								className: "w-4 h-4 accent-lime-600"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-semibold text-slate-900",
								children: "Buka (Terima Pesanan)"
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ jsx("input", {
								type: "radio",
								name: "storeStatus",
								value: "closed",
								checked: storeStatus === "closed",
								onChange: (e) => setStoreStatus(e.target.value),
								className: "w-4 h-4 accent-rose-600"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-semibold text-slate-900",
								children: "Tutup (Libur)"
							})]
						})]
					})] }),
					storeStatus === "closed" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-bold text-slate-700 mb-2",
						children: "Pesan Libur untuk Pelanggan"
					}), /* @__PURE__ */ jsx("textarea", {
						className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium text-slate-800 resize-none h-24",
						placeholder: "Contoh: Maaf, toko sedang libur Idul Fitri hingga tanggal 15 April.",
						value: storeMessage,
						onChange: (e) => setStoreMessage(e.target.value)
					})] }),
					/* @__PURE__ */ jsx("div", {
						className: "pt-4 border-t border-slate-50",
						children: /* @__PURE__ */ jsxs("button", {
							disabled: saving,
							type: "submit",
							className: "w-full bg-lime-600 hover:bg-lime-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50",
							children: [/* @__PURE__ */ jsx(Save, { size: 20 }), saving ? "Menyimpan..." : "Simpan Pengaturan"]
						})
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/components/AdminLayout.jsx
function AdminLayout() {
	const [adminToken, setAdminToken] = useState(localStorage.getItem("admin_token") || "");
	const [showLogin, setShowLogin] = useState(!localStorage.getItem("admin_token"));
	const [password, setPassword] = useState("");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navigate = useNavigate();
	const handleLogin = (e) => {
		e.preventDefault();
		localStorage.setItem("admin_token", password);
		setAdminToken(password);
		setShowLogin(false);
	};
	const handleLogout = () => {
		localStorage.removeItem("admin_token");
		setAdminToken("");
		setShowLogin(true);
		navigate("/");
	};
	if (showLogin) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center bg-slate-50 px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-in fade-in zoom-in duration-300",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8 text-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white mx-auto mb-4 shadow-md",
						children: /* @__PURE__ */ jsx(ShieldCheck, { size: 32 })
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-black text-slate-900 tracking-tight",
						children: "Admin Dapur Rempoah"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 mt-2",
						children: "Silakan masukkan kata sandi admin untuk melanjutkan."
					})
				]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleLogin,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1",
						children: "Kata Sandi"
					}), /* @__PURE__ */ jsx("input", {
						required: true,
						type: "password",
						className: "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-slate-900 text-center tracking-widest",
						value: password,
						onChange: (e) => setPassword(e.target.value)
					})] }),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "w-full bg-lime-600 hover:bg-lime-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-lime-200",
						children: "Masuk"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => navigate("/"),
						className: "w-full block text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-all pt-2",
						children: "Kembali ke Beranda"
					})
				]
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen bg-slate-50 relative",
		children: [
			isMobileMenuOpen && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity",
				onClick: () => setIsMobileMenuOpen(false)
			}),
			/* @__PURE__ */ jsxs("aside", {
				className: `w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 fixed md:sticky top-0 h-screen shadow-sm z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-6 border-b border-slate-100 flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-md",
								children: /* @__PURE__ */ jsx(ShieldCheck, { size: 28 })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-xl font-black text-slate-900 tracking-tight leading-none mb-1",
								children: "Manage"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs font-bold text-slate-400 uppercase tracking-widest",
								children: "Admin Panel"
							})] })]
						}), /* @__PURE__ */ jsx("button", {
							className: "md:hidden text-slate-500 hover:text-slate-900 p-1",
							onClick: () => setIsMobileMenuOpen(false),
							children: /* @__PURE__ */ jsx(X, { size: 24 })
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-4 flex-1 overflow-y-auto",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2",
							children: "Menu Utama"
						}), /* @__PURE__ */ jsx("nav", {
							className: "space-y-1",
							children: [
								{
									name: "Produk",
									path: "/admin",
									icon: /* @__PURE__ */ jsx(Package, { size: 20 })
								},
								{
									name: "Pesanan",
									path: "/admin/orders",
									icon: /* @__PURE__ */ jsx(ShoppingBag, { size: 20 })
								},
								{
									name: "Pelanggan",
									path: "/admin/customers",
									icon: /* @__PURE__ */ jsx(Users, { size: 20 })
								},
								{
									name: "Konfirmasi Pembayaran",
									path: "/admin/payments",
									icon: /* @__PURE__ */ jsx(CreditCard, { size: 20 })
								},
								{
									name: "Voucher",
									path: "/admin/vouchers",
									icon: /* @__PURE__ */ jsx(Ticket, { size: 20 })
								},
								{
									name: "Pengaturan",
									path: "/admin/settings",
									icon: /* @__PURE__ */ jsx(Settings, { size: 20 })
								}
							].map((item) => /* @__PURE__ */ jsxs(NavLink, {
								to: item.path,
								end: item.path === "/admin",
								className: ({ isActive }) => `flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all ${isActive ? "bg-lime-50 text-lime-700 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`,
								onClick: () => setIsMobileMenuOpen(false),
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [item.icon, /* @__PURE__ */ jsx("span", { children: item.name })]
								}), /* @__PURE__ */ jsx("span", {
									className: "hidden group-[.active]:block",
									children: /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
								})]
							}, item.path))
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "p-4 border-t border-slate-100",
						children: /* @__PURE__ */ jsxs("button", {
							onClick: handleLogout,
							className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl font-bold transition-colors",
							children: [/* @__PURE__ */ jsx(LogOut, { size: 20 }), "Keluar"]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 min-w-0 flex flex-col h-screen overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "md:hidden flex items-center p-4 bg-white border-b border-slate-200 gap-4",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setIsMobileMenuOpen(true),
						className: "p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all",
						children: /* @__PURE__ */ jsx(Menu, { size: 24 })
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-1 flex justify-between items-center",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-black text-slate-900",
							children: "Admin Panel"
						}), /* @__PURE__ */ jsx("button", {
							onClick: handleLogout,
							className: "text-sm font-bold text-rose-500 p-2",
							children: "Keluar"
						})]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex-1 overflow-y-auto w-full",
					children: /* @__PURE__ */ jsx(Outlet, { context: {
						adminToken,
						setAdminToken,
						setShowLogin
					} })
				})]
			})
		]
	});
}
//#endregion
//#region src/components/OneSignalSetup.jsx
function OneSignalSetup() {
	useEffect(() => {
		const appId = "294a9153-e595-458c-b86a-8bd7ec10f9af";
		window.OneSignal = window.OneSignal || [];
		window.OneSignal.push(function() {
			window.OneSignal.init({
				appId,
				safari_web_id: "web.onesignal.auto.17b4c7c8-77c5-4d7a-8b4b-9f1bbe5c526b",
				notifyButton: { enable: true },
				allowLocalhostAsSecureOrigin: true
			});
		});
	}, []);
	return null;
}
//#endregion
//#region src/pages/PrivacyPolicy.jsx
function PrivacyPolicy() {
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-4xl mx-auto px-4 py-12",
		children: [/* @__PURE__ */ jsxs(Link, {
			to: "/",
			className: "inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-lime-600 mb-8 transition-colors",
			children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Kembali ke Beranda"]
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4 mb-6",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-12 h-12 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center",
					children: /* @__PURE__ */ jsx(Shield, { size: 26 })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 tracking-tight",
					children: "Kebijakan Privasi"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-400 font-medium",
					children: "Terakhir diperbarui: 16 Agustus 2026"
				})] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed font-medium",
				children: [
					/* @__PURE__ */ jsxs("p", { children: [
						"Selamat datang di ",
						/* @__PURE__ */ jsx("strong", { children: "Dapur Rempoah" }),
						". Kami berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan layanan pemesanan makanan kami."
					] }),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-xl font-bold text-slate-900",
								children: "1. Informasi yang Kami Kumpulkan"
							}),
							/* @__PURE__ */ jsx("p", { children: "Kami mengumpulkan beberapa jenis informasi untuk memberikan dan meningkatkan layanan pemesanan kepada Anda:" }),
							/* @__PURE__ */ jsxs("ul", {
								className: "list-disc pl-6 space-y-2",
								children: [
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Informasi Pemesanan & Kontak:" }), " Nama lengkap, nomor telepon (WhatsApp), dan alamat lengkap pengiriman yang Anda masukkan saat membuat pesanan."] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Informasi Akun (Google Auth):" }), " Jika Anda masuk menggunakan Google Sign-In, kami mengumpulkan nama, alamat email, dan foto profil yang disediakan oleh Google."] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Informasi Lokasi:" }), " Koordinat lokasi (latitude & longitude) yang Anda bagikan secara sukarela untuk menghitung estimasi jarak dan biaya pengiriman."] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Bukti Pembayaran:" }), " Catatan transaksi atau bukti transfer berupa gambar yang Anda unggah pada halaman konfirmasi pembayaran."] })
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-xl font-bold text-slate-900",
								children: "2. Penggunaan Informasi"
							}),
							/* @__PURE__ */ jsx("p", { children: "Informasi yang kami kumpulkan digunakan untuk tujuan berikut:" }),
							/* @__PURE__ */ jsxs("ul", {
								className: "list-disc pl-6 space-y-2",
								children: [
									/* @__PURE__ */ jsx("li", { children: "Memproses, mengonfirmasi, dan mengantarkan pesanan makanan Anda." }),
									/* @__PURE__ */ jsx("li", { children: "Menghitung ongkos kirim secara akurat sesuai lokasi pengiriman." }),
									/* @__PURE__ */ jsx("li", { children: "Mengirimkan notifikasi status pesanan melalui WhatsApp atau pemberitahuan di situs." }),
									/* @__PURE__ */ jsx("li", { children: "Verifikasi pembayaran dan pencegahan transaksi tidak sah atau kecurangan (bot protection)." }),
									/* @__PURE__ */ jsx("li", { children: "Meningkatkan kualitas layanan, pilihan menu, dan pengalaman pengguna di situs kami." })
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-slate-900",
							children: "3. Keamanan Data & Perlindungan Bot"
						}), /* @__PURE__ */ jsxs("p", { children: [
							"Kami mengimplementasikan langkah-langkah keamanan teknis untuk melindungi data pribadi Anda. Layanan kami menggunakan ",
							/* @__PURE__ */ jsx("strong", { children: "Cloudflare Turnstile" }),
							" untuk perlindungan dari akses otomatis (bot) dan spam tanpa mengganggu privasi Anda. Data pembayaran Anda tidak kami simpan dalam bentuk informasi kartu atau kredensial perbankan sensitif."
						] })]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-slate-900",
							children: "4. Pembagian Informasi Kepada Pihak Ketiga"
						}), /* @__PURE__ */ jsx("p", { children: "Kami tidak menjual, menyewakan, atau memperdagangkan informasi pribadi Anda kepada pihak ketiga. Informasi Anda hanya dibagikan kepada penyedia layanan terpercaya sebatas yang diperlukan untuk mengoperasikan layanan kami (seperti kurir pengiriman dan layanan pemberitahuan otomatis)." })]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-xl font-bold text-slate-900",
								children: "5. Hak Anda"
							}),
							/* @__PURE__ */ jsx("p", { children: "Anda berhak untuk:" }),
							/* @__PURE__ */ jsxs("ul", {
								className: "list-disc pl-6 space-y-2",
								children: [
									/* @__PURE__ */ jsx("li", { children: "Memeriksa dan memperbarui informasi profil akun Anda." }),
									/* @__PURE__ */ jsx("li", { children: "Meminta penghapusan data pribadi Anda dari sistem kami dengan menghubungi layanan pelanggan kami." }),
									/* @__PURE__ */ jsx("li", { children: "Menolak atau membatasi izin akses lokasi pada perangkat/peramban Anda." })
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-xl font-bold text-slate-900",
								children: "6. Hubungi Kami"
							}),
							/* @__PURE__ */ jsx("p", { children: "Jika Anda memiliki pertanyaan, saran, atau keluhan terkait Kebijakan Privasi ini, silakan hubungi kami melalui:" }),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-1",
								children: [
									/* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("strong", { children: "Dapur Rempoah" }) }),
									/* @__PURE__ */ jsx("p", { children: "Alamat: Babakan, Purbalingga, Jawa Tengah" }),
									/* @__PURE__ */ jsxs("p", { children: ["WhatsApp: ", /* @__PURE__ */ jsx("a", {
										href: "https://wa.me/6285117054626",
										className: "text-lime-600 underline font-bold",
										children: "+62 851-1705-4626"
									})] })
								]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/pages/TermsAndConditions.jsx
function TermsAndConditions() {
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-4xl mx-auto px-4 py-12",
		children: [/* @__PURE__ */ jsxs(Link, {
			to: "/",
			className: "inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-lime-600 mb-8 transition-colors",
			children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Kembali ke Beranda"]
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4 mb-6",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center",
					children: /* @__PURE__ */ jsx(FileText, { size: 26 })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 tracking-tight",
					children: "Syarat & Ketentuan"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-400 font-medium",
					children: "Terakhir diperbarui: 16 Agustus 2026"
				})] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed font-medium",
				children: [
					/* @__PURE__ */ jsxs("p", { children: [
						"Selamat datang di layanan ",
						/* @__PURE__ */ jsx("strong", { children: "Dapur Rempoah" }),
						". Dengan mengakses, membuat pesanan, atau menggunakan platform kami, Anda menyatakan setuju untuk terikat oleh Syarat & Ketentuan di bawah ini. Harap membaca ketentuan ini secara saksama sebelum bertransaksi."
					] }),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-slate-900",
							children: "1. Ketentuan Pemesanan"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsx("li", { children: "Pesanan dibuat melalui website resmi Dapur Rempoah atau melalui layanan resmi yang terhubung." }),
								/* @__PURE__ */ jsx("li", { children: "Pelanggan wajib memberikan informasi nama, nomor telepon WhatsApp, dan alamat pengiriman yang benar dan akurat." }),
								/* @__PURE__ */ jsx("li", { children: "Pemesanan hanya akan diproses setelah toko berstatus buka dan pesanan telah dikonfirmasi oleh sistem atau admin kami." }),
								/* @__PURE__ */ jsx("li", { children: "Dapur Rempoah berhak menolak atau membatalkan pesanan jika stok menu habis, lokasi pengiriman di luar jangkauan, atau indikasi kecurangan." })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-slate-900",
							children: "2. Layanan Pengiriman & Ambil Sendiri (Pickup)"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Pengiriman (Delivery):" }), " Layanan pengiriman berlaku untuk radius maksimum 10 km dari lokasi toko. Ongkos kirim dihitung berdasarkan jarak aktual."] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Ambil Sendiri (Pickup):" }), " Pelanggan dapat mengambil pesanan secara langsung di toko sesuai dengan waktu dan tanggal yang telah ditentukan saat pemesanan."] }),
								/* @__PURE__ */ jsx("li", { children: "Keterlambatan pengiriman yang disebabkan oleh kondisi cuaca ekstrem, kemacetan lalu lintas berat, atau alamat yang tidak jelas di luar kendali wajar Dapur Rempoah." })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-slate-900",
							children: "3. Pembayaran & Konfirmasi"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsx("li", { children: "Pembayaran dilakukan melalui metode yang tersedia (seperti QRIS atau Transfer Bank)." }),
								/* @__PURE__ */ jsxs("li", { children: [
									"Untuk pembayaran nontunai/transfer, pelanggan dianjurkan mengunggah bukti pembayaran melalui fitur ",
									/* @__PURE__ */ jsx("em", { children: "Konfirmasi Pembayaran" }),
									" agar pesanan segera diproses."
								] }),
								/* @__PURE__ */ jsx("li", { children: "Pesanan yang belum dibayar dalam batas waktu tertentu dapat dibatalkan secara otomatis oleh sistem." })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-slate-900",
							children: "4. Voucher & Diskon"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsx("li", { children: "Voucher promo hanya berlaku untuk 1 (satu) kali penggunaan per transaksi sesuai dengan syarat dan masa berlaku voucher." }),
								/* @__PURE__ */ jsx("li", { children: "Voucher tidak dapat ditukarkan dengan uang tunai atau digabungkan secara tidak sah." }),
								/* @__PURE__ */ jsx("li", { children: "Dapur Rempoah berhak membatalkan diskon jika ditemukan penyalahgunaan kode voucher." })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-slate-900",
							children: "5. Pembatalan & Pengembalian Dana (Refund)"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [/* @__PURE__ */ jsx("li", { children: "Pesanan yang sudah masuk tahap pemrosesan/dapur tidak dapat dibatalkan oleh pelanggan." }), /* @__PURE__ */ jsx("li", { children: "Jika terjadi kesalahan pesanan dari pihak kami atau makanan dalam kondisi tidak layak, silakan hubungi kami segera pada hari yang sama dengan melampirkan foto/video bukti untuk solusi penggantian atau refund." })]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-slate-900",
							children: "6. Perubahan Syarat & Ketentuan"
						}), /* @__PURE__ */ jsx("p", { children: "Dapur Rempoah berhak mengubah atau memperbarui Syarat & Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan akan berlaku efektif setelah diunggah pada halaman ini." })]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-xl font-bold text-slate-900",
								children: "7. Layanan Pelanggan"
							}),
							/* @__PURE__ */ jsx("p", { children: "Apabila terdapat kendala terkait pesanan atau pertanyaan mengenai syarat ketentuan ini, Anda dapat menghubungi kami di:" }),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-1",
								children: [
									/* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("strong", { children: "Dapur Rempoah" }) }),
									/* @__PURE__ */ jsx("p", { children: "Alamat: Babakan, Purbalingga, Jawa Tengah" }),
									/* @__PURE__ */ jsxs("p", { children: ["WhatsApp: ", /* @__PURE__ */ jsx("a", {
										href: "https://wa.me/6285117054626",
										className: "text-lime-600 underline font-bold",
										children: "+62 851-1705-4626"
									})] })
								]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/App.jsx
var CheckoutModal = lazy(() => import("./assets/CheckoutModal-DeEletn5.js").then((m) => ({ default: m.CheckoutModal })));
function App() {
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
	const { menu, loading, error } = useMenu();
	const { fetchSettings } = useSettingsStore();
	const isAdminRoute = useLocation().pathname.startsWith("/admin");
	const mounted = useMounted();
	useEffect(() => {
		fetchSettings();
	}, [fetchSettings]);
	const handleOpenCheckout = () => {
		setIsCartOpen(false);
		setIsCheckoutOpen(true);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50",
		children: [
			/* @__PURE__ */ jsx(OneSignalSetup, {}),
			!isAdminRoute && /* @__PURE__ */ jsx(Navbar, { onCartClick: () => setIsCartOpen(true) }),
			/* @__PURE__ */ jsxs(Routes, { children: [
				/* @__PURE__ */ jsx(Route, {
					path: "/",
					element: /* @__PURE__ */ jsx(Home, {
						menu,
						loading,
						error
					})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/orders/:hash",
					element: /* @__PURE__ */ jsx(OrderDetail, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/confirm-payment/:hash",
					element: /* @__PURE__ */ jsx(PaymentConfirmation, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/confirm-payment",
					element: /* @__PURE__ */ jsx(PaymentConfirmation, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/history",
					element: /* @__PURE__ */ jsx(OrderHistory, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/privacy-policy",
					element: /* @__PURE__ */ jsx(PrivacyPolicy, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/terms-and-conditions",
					element: /* @__PURE__ */ jsx(TermsAndConditions, {})
				}),
				/* @__PURE__ */ jsxs(Route, {
					path: "/admin",
					element: /* @__PURE__ */ jsx(AdminLayout, {}),
					children: [
						/* @__PURE__ */ jsx(Route, {
							index: true,
							element: /* @__PURE__ */ jsx(AdminProducts, {})
						}),
						/* @__PURE__ */ jsx(Route, {
							path: "payments",
							element: /* @__PURE__ */ jsx(AdminPaymentConfirmations, {})
						}),
						/* @__PURE__ */ jsx(Route, {
							path: "orders",
							element: /* @__PURE__ */ jsx(AdminOrders, {})
						}),
						/* @__PURE__ */ jsx(Route, {
							path: "customers",
							element: /* @__PURE__ */ jsx(AdminCustomers, {})
						}),
						/* @__PURE__ */ jsx(Route, {
							path: "vouchers",
							element: /* @__PURE__ */ jsx(AdminVouchers, {})
						}),
						/* @__PURE__ */ jsx(Route, {
							path: "settings",
							element: /* @__PURE__ */ jsx(AdminSettings, {})
						})
					]
				})
			] }),
			!isAdminRoute && /* @__PURE__ */ jsx("footer", {
				className: "bg-white border-t border-slate-200 py-12",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-12",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-xl font-bold text-black mb-4",
								children: "Dapur Rempoah"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-slate-500",
								children: "Masakan Rumahan, obat kangen rumah."
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								className: "font-bold text-slate-900 mb-4",
								children: "Navigasi"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-2 text-slate-500",
								children: [
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "/#menu",
										className: "hover:text-lime-600 transition-colors",
										children: "Menu"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "/privacy-policy",
										className: "hover:text-lime-600 transition-colors",
										children: "Kebijakan Privasi"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "/terms-and-conditions",
										className: "hover:text-lime-600 transition-colors",
										children: "Syarat & Ketentuan"
									}) })
								]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								className: "font-bold text-slate-900 mb-4",
								children: "Kontak"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-2 text-slate-500",
								children: [/* @__PURE__ */ jsx("li", { children: "Babakan, Purbalingga, Jawa Tengah" }), /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: "/assets/wa_icon-qxoxDh1f.png",
											className: "w-6 h-6"
										}),
										" ",
										/* @__PURE__ */ jsx("a", {
											href: "https://wa.me/6285117054626",
											children: "6285117054626"
										})
									]
								}) })]
							})] })
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Dapur Rempoah - Babakan. All rights reserved."
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(CartDrawer, {
				isOpen: isCartOpen,
				onClose: () => setIsCartOpen(false),
				onCheckout: handleOpenCheckout
			}),
			mounted && /* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: /* @__PURE__ */ jsx(CheckoutModal, {
					isOpen: isCheckoutOpen,
					onClose: () => setIsCheckoutOpen(false)
				})
			})
		]
	});
}
//#endregion
//#region src/entry-server.jsx
function render(url) {
	return renderToString(/* @__PURE__ */ jsx(GoogleOAuthProvider, {
		clientId: "558973031561-35gqukek8pkej47fclqfasud9akm8f8j.apps.googleusercontent.com",
		children: /* @__PURE__ */ jsx(MemoryRouter, {
			initialEntries: [url],
			children: /* @__PURE__ */ jsx(App, {})
		})
	}));
}
//#endregion
export { render };
