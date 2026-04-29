import {
  About,
  DataStories,
  features,
  Partners,
  states,
} from '@/config/site';
import { HeroSection, QuickLinks } from './components';
import { DatasetCatalog } from './components/dataset-catalog';
import Resources from './components/resources';

export default function Home() {
  return (
    <main className="bg-baseGreenSolid5 ">
      <div className="inline-flex w-full flex-col items-center ">
        <HeroSection />
        {states.length > 0 && <QuickLinks />}
        {features.datasets && <DatasetCatalog />}
        {features.datasets && <Resources />}
        {DataStories && <DataStories />}
        {About && <About />}
        {Partners && <Partners />}
      </div>
    </main>
  );
}
