// Indian Rupee & Fintech formatters
import { RiskLevel } from '../types';

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  
  // Custom Indian format (lakhs & crores standard)
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const parts = absAmount.toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  const decimalPart = parts.length > 1 ? '.' + parts[1].substring(0, 2) : '';
  
  return (isNegative ? '-₹' : '₹') + res + decimalPart;
}

export function formatINRCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return formatINR(amount);
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
}

export function getRiskBadgeClasses(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  glow: string;
} {
  switch (level) {
    case 'Critical':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-300',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        glow: 'shadow-rose-100'
      };
    case 'High':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-300',
        badge: 'bg-red-100 text-red-800 border-red-300',
        glow: 'shadow-red-100'
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-300',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        glow: 'shadow-amber-100'
      };
    case 'Low':
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-300',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        glow: 'shadow-emerald-100'
      };
  }
}

export function getRiskScoreColor(score: number): string {
  if (score >= 80) return 'text-rose-600';
  if (score >= 60) return 'text-orange-500';
  if (score >= 35) return 'text-amber-500';
  return 'text-emerald-600';
}
