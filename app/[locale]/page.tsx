import { DataStories, HomeAbout, HomePartners } from 'ids-drr-branding';

import { states } from '@/config/site';
import { HeroSection, QuickLinks } from './components';
import { DatasetCatalog } from './components/dataset-catalog';
import Resources from './components/resources';

export default function Home() {
  return (
    <main className="bg-baseGreenSolid5 ">
      <div className="inline-flex w-full flex-col items-center ">
        <HeroSection />
        {states.length > 0 && <QuickLinks />}
        {process.env.NEXT_PUBLIC_BACKEND_URL && <DatasetCatalog />}
        {process.env.NEXT_PUBLIC_BACKEND_URL && <Resources />}
        {DataStories && <DataStories />}
        {HomeAbout && <HomeAbout />}
        {HomePartners && <HomePartners />}
      </div>
    </main>
  );
}
