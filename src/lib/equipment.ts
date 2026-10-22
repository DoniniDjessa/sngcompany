import { Hammer, Tent, Wrench, Zap, type Icon } from "@/components/icons"

// Categories of the equipment catalogue (values stored in "sng-equipements".category)
export const EQUIPMENT_CATEGORIES: Record<string, { label: string; icon: Icon }> = {
  energie: { label: "Énergie", icon: Zap },
  btp: { label: "BTP", icon: Hammer },
  evenementiel: { label: "Événementiel", icon: Tent },
}

export const categoryLabel = (c: string | null) => EQUIPMENT_CATEGORIES[c ?? ""]?.label ?? c ?? ""
export const categoryIcon = (c: string | null) => EQUIPMENT_CATEGORIES[c ?? ""]?.icon ?? Wrench
