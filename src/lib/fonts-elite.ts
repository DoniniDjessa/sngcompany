import { Playfair_Display, Poppins } from "next/font/google"

// Fonts of the SNG Elite Cars look, loaded only by the vehicle rental page
export const eliteSerif = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-elite-serif" })
export const eliteSans = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-elite-sans" })
