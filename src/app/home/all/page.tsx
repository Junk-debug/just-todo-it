'use client';

import { useEffect, useState } from 'react';

const GyroscopeCard: React.FC = () => {
  const [transformZ, setTransformZ] = useState<number>(0);

  useEffect(() => {
    const handleMotionEvent = (event: DeviceMotionEvent) => {
      const alpha = event.rotationRate?.alpha;
      if (alpha != null) {
        // Ограничиваем значение alpha
        const clampedZ = Math.min(Math.max(alpha, -50), 50);
        setTransformZ(clampedZ);
      }
    };

    window.addEventListener('devicemotion', handleMotionEvent);

    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
    };
  }, []);

  return (
    <div
      className="w-48 h-48 bg-green-500 text-white rounded-lg shadow-md flex items-center justify-center"
      style={{
        transform: `perspective(500px) translateZ(${transformZ}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      Card
    </div>
  );
};

export default function AllPage() {
  return (
    <main className="p-8 flex items-center justify-center min-h-dvh">
      <div className="min-w-64 w-72 flex flex-col space-y-4">
        <h1 className="text-center tracking-tight text-3xl font-semibold">
          All tasks
        </h1>
        <GyroscopeCard />
      </div>
    </main>
  );
}
