import { About, HeroSection, QuickLinks } from './components';
import DataStories from './components/data-stories';
import { DatasetCatalog } from './components/dataset-catalog';
import Partners from './components/partners';
import Resources from './components/resources';

export default function Home() {
  return (
    <main className="bg-baseGreenSolid5 ">
      <div className="inline-flex w-full flex-col items-center ">
        <HeroSection />
        <QuickLinks />
        <DatasetCatalog />
        <Resources />
        <DataStories />
        <About />
        <Partners />
      </div>
    </main>
  );
}
