"use client"
import { useState } from "react"
import { ArrowRight, MapPin } from "@/components/icons"
import styles from "./ServedZones.module.css"

// Stylised map of Abidjan (not to scale): the Ébrié lagoon, the communes as glowing points and a
// delivery truck driving its round along a dashed route. Hovering a commune in the list lights it on the map.

/** Approximate places of the communes on the 640 × 460 canvas (north up) */
const PLACES: Record<string, [number, number]> = {
  abobo: [330, 58],
  anyama: [270, 40],
  adjame: [312, 140],
  yopougon: [160, 168],
  attecoube: [236, 196],
  cocody: [440, 160],
  bingerville: [578, 182],
  plateau: [330, 214],
  treichville: [330, 290],
  marcory: [414, 296],
  koumassi: [492, 300],
  "port-bouet": [430, 392],
  songon: [60, 210],
}
/** Delivery round drawn on the map, in order */
const ROUND = ["yopougon", "adjame", "plateau", "treichville", "marcory", "koumassi", "cocody", "bingerville"]

const key = (name: string) => name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim().replace(/\s+/g, "-")

// smooth curve through the points (Catmull-Rom → cubic Bézier)
function curve(points: [number, number][]) {
  if (points.length < 2) return ""
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [points[i - 1] ?? points[i], points[i], points[i + 1], points[i + 2] ?? points[i + 1]]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`
  }
  return d
}

export default function ServedZones({ eyebrow, title, text, abidjan, interior }: {
  eyebrow: string
  title: string
  text: string
  abidjan: string[]
  interior: string[]
}) {
  const [hover, setHover] = useState<string | null>(null)
  const placed = abidjan.map((name) => ({ name, k: key(name), at: PLACES[key(name)] })).filter((z) => z.at)
  const round = ROUND.map((k) => PLACES[k]).filter((p, i) => abidjan.some((n) => key(n) === ROUND[i]) && p)
  const route = curve(round)

  return (
    <div className={styles.wrap}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{text}</p>

        <h3 className={styles.listTitle}>Grand Abidjan</h3>
        <ul className={styles.chips}>
          {abidjan.map((z) => (
            <li key={z} onPointerEnter={() => setHover(key(z))} onPointerLeave={() => setHover(null)} className={hover === key(z) ? styles.chipOn : ""}>
              <MapPin /> {z}
            </li>
          ))}
        </ul>

        {interior.length > 0 && (
          <>
            <h3 className={styles.listTitle}>Intérieur du pays</h3>
            <ul className={styles.cities}>
              {interior.map((c) => <li key={c}><ArrowRight /> {c}</li>)}
            </ul>
          </>
        )}
      </div>

      <div className={styles.mapBox}>
        <svg viewBox="0 0 640 460" className={styles.map} role="img" aria-label={`Carte des zones desservies : ${abidjan.join(", ")}`}>
          <defs>
            <pattern id="zone-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" className={styles.gridDot} />
            </pattern>
            <path id="zone-route" d={route} />
          </defs>
          <rect width="640" height="460" fill="url(#zone-grid)" />

          {/* Ébrié lagoon and the ocean */}
          <path className={styles.lagoon} d="M-10,250 C60,226 120,262 190,236 C250,214 280,256 352,252 C420,248 470,226 540,240 C590,250 620,236 650,230 L650,268 C600,280 560,266 510,276 C450,288 400,270 352,282 C280,300 230,262 180,280 C120,300 60,268 -10,290 Z" />
          <path className={styles.ocean} d="M-10,430 C120,418 240,436 360,424 C480,412 560,430 650,418 L650,470 L-10,470 Z" />
          <text x="560" y="455" className={styles.seaLabel}>Océan Atlantique</text>
          <text x="40" y="300" className={styles.seaLabel}>Lagune Ébrié</text>

          {/* route to the interior */}
          <path className={styles.exit} d="M330,58 C340,20 380,8 430,-10" />
          <text x="440" y="26" className={styles.exitLabel}>Vers l&apos;intérieur ↗</text>

          {/* delivery round */}
          {route && (
            <>
              <path d={route} className={styles.routeBase} />
              <path d={route} className={styles.routeDraw} pathLength={1} />
            </>
          )}

          {placed.map((z) => (
            <g key={z.k} transform={`translate(${z.at[0]} ${z.at[1]})`} className={`${styles.node} ${hover === z.k ? styles.nodeOn : ""}`}>
              <circle r="16" className={styles.pulse} />
              <circle r="5" className={styles.dot} />
              <text y="-14" className={styles.label}>{z.name}</text>
            </g>
          ))}

          {/* the truck follows the round */}
          {route && (
            <g className={styles.truck}>
              <g transform="translate(-12 -12)">
                <rect x="-2" y="-2" width="28" height="28" rx="14" className={styles.truckBg} />
                <g className={styles.truckIcon}>
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                  <circle cx="17" cy="18" r="2" />
                  <circle cx="7" cy="18" r="2" />
                </g>
              </g>
              <animateMotion dur="14s" repeatCount="indefinite" rotate="0" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear">
                <mpath href="#zone-route" />
              </animateMotion>
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
