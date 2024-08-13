import React from 'react'
import type { Metadata } from 'next'
import { Hero } from './components/Hero';

export const metadata: Metadata = {
  title: 'Monthly Plan',
};

export default function MonthlyPlanPage() {
  return (
    <Hero />
  );
}
