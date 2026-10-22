// Line icons (24px grid, 2px stroke), sized with width/height or className.
import type { SVGProps } from "react"

export type IconProps = SVGProps<SVGSVGElement>
export type Icon = (p: IconProps) => React.JSX.Element

const svg = (p: IconProps, children: React.ReactNode) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    {children}
  </svg>
)

export const Dashboard: Icon = (p) => svg(p, <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>)
export const Car: Icon = (p) => svg(p, <><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></>)
export const Key: Icon = (p) => svg(p, <><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></>)
export const Truck: Icon = (p) => svg(p, <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>)
export const Box: Icon = (p) => svg(p, <><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></>)
export const Wrench: Icon = (p) => svg(p, <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />)
export const Zap: Icon = (p) => svg(p, <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />)
export const Hammer: Icon = (p) => svg(p, <><path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" /><path d="m18 15 4-4" /><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" /></>)
export const Tent: Icon = (p) => svg(p, <><path d="M3.5 21 14 3" /><path d="M20.5 21 10 3" /><path d="M15.5 21 12 15l-3.5 6" /><path d="M2 21h20" /></>)
export const Droplets: Icon = (p) => svg(p, <><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></>)
export const Sprout: Icon = (p) => svg(p, <><path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" /></>)
export const Users: Icon = (p) => svg(p, <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>)
export const Inbox: Icon = (p) => svg(p, <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>)
export const FileText: Icon = (p) => svg(p, <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></>)
export const Settings: Icon = (p) => svg(p, <><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></>)
export const Search: Icon = (p) => svg(p, <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>)
export const Plus: Icon = (p) => svg(p, <><path d="M5 12h14" /><path d="M12 5v14" /></>)
export const Bell: Icon = (p) => svg(p, <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>)
export const Menu: Icon = (p) => svg(p, <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>)
export const ChevronLeft: Icon = (p) => svg(p, <path d="m15 18-6-6 6-6" />)
export const ChevronRight: Icon = (p) => svg(p, <path d="m9 18 6-6-6-6" />)
export const ChevronDown: Icon = (p) => svg(p, <path d="m6 9 6 6 6-6" />)
export const X: Icon = (p) => svg(p, <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>)
export const LogOut: Icon = (p) => svg(p, <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>)
export const Phone: Icon = (p) => svg(p, <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />)
export const Mail: Icon = (p) => svg(p, <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>)
export const MapPin: Icon = (p) => svg(p, <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>)
export const Calendar: Icon = (p) => svg(p, <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></>)
export const Pencil: Icon = (p) => svg(p, <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />)
export const Trash: Icon = (p) => svg(p, <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>)
export const Eye: Icon = (p) => svg(p, <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>)
export const Sun: Icon = (p) => svg(p, <><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>)
export const Moon: Icon = (p) => svg(p, <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />)
export const Check: Icon = (p) => svg(p, <path d="M20 6 9 17l-5-5" />)
export const ArrowRight: Icon = (p) => svg(p, <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>)
export const Clock: Icon = (p) => svg(p, <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>)
export const Shield: Icon = (p) => svg(p, <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></>)
export const Star: Icon = (p) => svg(p, <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />)
export const Download: Icon = (p) => svg(p, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>)
export const Wallet: Icon = (p) => svg(p, <><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></>)
export const Globe: Icon = (p) => svg(p, <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>)
export const External: Icon = (p) => svg(p, <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>)
export const TrendingUp: Icon = (p) => svg(p, <><path d="M22 7 13.5 15.5 8.5 10.5 2 17" /><path d="M16 7h6v6" /></>)
export const Chat: Icon = (p) => svg(p, <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />)
export const Building: Icon = (p) => svg(p, <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></>)
export const Lock: Icon = (p) => svg(p, <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>)
export const Filter: Icon = (p) => svg(p, <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />)



/** Filled coupé in profile, facing right; `beam` adds the headlight cone in front */
export const CarSide = ({ beam = false, ...p }: IconProps & { beam?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox={beam ? "0 0 64 20" : "0 0 48 20"} width="2.4em" height="1em" fill="currentColor" aria-hidden="true" {...p}>
    {beam && <path d="M46.5 10.2 64 5v12.6l-17.5-5.4z" opacity="0.22" />}
    <path
      fillRule="evenodd"
      d="M3 13.6c0-1.7 1.1-2.8 2.9-3.2L12 9.2l5.3-4.5a5.6 5.6 0 0 1 3.7-1.3h8.6c1.5 0 2.9.6 3.9 1.6l4 4 5.6 1c1.8.3 3 1.6 3 3.4V15c0 .6-.4 1-1 1h-3.3a4.6 4.6 0 0 0-9 0H16.3a4.6 4.6 0 0 0-9 0H4c-.6 0-1-.4-1-1zM18.8 9l3-3.2c.4-.4.9-.6 1.4-.6h2.5V9zm8.6 0V5.2h2.4c.7 0 1.3.3 1.8.8l3 3z"
    />
    <path fillRule="evenodd" d="M11.8 12.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8m0 2.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4m25.4-2.2a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8m0 2.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4" />
    <rect x="43.6" y="10.9" width="2.6" height="1.5" rx="0.75" opacity="0.55" />
  </svg>
)

/** Filled car seen from above, nose pointing down (vertical roads) */
export const CarTopFill = (p: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 36" width="0.56em" height="1em" fill="currentColor" aria-hidden="true" {...p}>
    <path
      fillRule="evenodd"
      d="M8 1h4c3.3 0 6 2.7 6 6v22c0 3.3-2.7 6-6 6H8c-3.3 0-6-2.7-6-6V7c0-3.3 2.7-6 6-6M5.2 9.2h9.6l-1.2 3H6.4zm-.6 14.8h10.8l-1.6-4.2H6.2zM5 26.2h10v1.4H5z"
    />
    <rect x="0" y="19.4" width="2.4" height="1.6" rx="0.8" />
    <rect x="17.6" y="19.4" width="2.4" height="1.6" rx="0.8" />
    <rect x="4" y="33" width="3" height="1" rx="0.5" opacity="0.5" />
    <rect x="13" y="33" width="3" height="1" rx="0.5" opacity="0.5" />
  </svg>
)
