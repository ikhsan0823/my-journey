import React from 'react'
import type { Metadata } from 'next'
import Hero from './components/Hero';

export const metadata: Metadata = {
  title: 'ToDo List',
};

export default function TodoListPage() {
  return (
    <Hero />
  );
}
