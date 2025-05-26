import dynamic from 'next/dynamic';

const Intro = dynamic(() => import('./components/Intro'), {
  ssr: false
});

export default function Home() {
  return <Intro />;
} 