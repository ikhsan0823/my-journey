import React from 'react'
import type { Metadata } from 'next'
import { SweetMemory } from './components/SweetMemory';

export const metadata: Metadata = {
  title: 'Sweet Memory',
};
export default function SweetMemoryPage() {
  return (
    <SweetMemory />
  );
}
