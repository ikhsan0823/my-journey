import React from 'react'
import type { Metadata } from 'next'

import { GoalsHeroPage } from './components/GoalsHeroPage';

export const metadata: Metadata = {
  title: 'Goals',
};

export default function GoalsPage() {
  return (
    <GoalsHeroPage />
  );
}
