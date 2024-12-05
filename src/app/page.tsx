'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <main className="w-full h-dvh flex items-center justify-center bg-gradient-to-b from-card to-rose-100  dark:to-rose-950">
      <div className="absolute inset-0 bg-grid" />
      <div className="z-50 container px-6 md:px-8 py-16 space-y-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-primary text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Just todo it
          </h1>
        </motion.div>
        <motion.p
          className="mx-auto max-w-[700px] md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your todo list is a mess, we know. That&apos;s why we&apos;re here to
          help you tame the beast and get your life back on track. Or at least,
          you know, make you feel better about procrastinating.
        </motion.p>
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link className={cn(buttonVariants({ size: 'lg' }))} href="/home">
            Get your life together
          </Link>
          <span className="text-xs text-muted-foreground">
            (or at least pretend to)
          </span>
        </motion.div>
      </div>
    </main>
  );
}
