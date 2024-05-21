import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777']

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length]
}
