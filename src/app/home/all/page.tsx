'use client';

import { useEffect, useState } from 'react';

const GyroscopeCard: React.FC = () => {
  const [acceleration, setAcceleration] = useState<{
    x: number | null;
    y: number | null;
    z: number | null;
  } | null>(null);
  const [rotationRate, setRotationRate] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  } | null>(null);
  const [int, setInt] = useState(0);

  useEffect(() => {
    const handleMotionEvent = (event: DeviceMotionEvent) => {
      setAcceleration(event.acceleration);
      setRotationRate(event.rotationRate);
      setInt(event.interval);
    };

    if (
      'requestPermission' in DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      DeviceMotionEvent.requestPermission()
        .then((permissionState: 'granted' | unknown) => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotionEvent);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('devicemotion', handleMotionEvent);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
    };
  }, []);

  return (
    <div className="w-48 h-48 [perspective:1000px]">
      <div className="w-full h-full bg-green-500 text-white rounded-lg shadow-md flex items-center justify-center [transform-style:preserve-3d] [transform:rotateY(45deg)]">
        Card
        <br />
        acceleration: {acceleration?.x} {acceleration?.y} {acceleration?.z}
        <br />
        interval: {int}
        <br />
        rotationRate: {rotationRate?.alpha} {rotationRate?.beta}{' '}
        {rotationRate?.gamma}
      </div>
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
