import { About, HeroSection, QuickLinks, Video } from './components';
import { DatasetCatalog } from './components/dataset-catalog';
import Resources from './components/resources';

export default function Home() {
  return (
    <main className="bg-baseGreenSolid5 pb-0.5">
      <div className="inline-flex w-full flex-col items-center gap-1">
        <HeroSection />
        <QuickLinks />
        <DatasetCatalog />
        <Resources />
        <About />
        <Video />
      </div>
    </main>
  );
}
