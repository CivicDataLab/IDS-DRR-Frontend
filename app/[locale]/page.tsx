import { IntroSection, OutroSection } from '@/config/branding';
import {
  features,
  heroBackground,
  heroForeground,
  states,
  stories,
} from '@/config/site';
import { HeroSection, QuickLinks, Stories } from './components';
import { DatasetCatalog } from './components/dataset-catalog';
import Resources from './components/resources';

export default function Home() {
  return (
    <div className="bg-baseGreenSolid5 ">
      <div className="inline-flex w-full flex-col items-center ">
        {IntroSection
          ? <IntroSection />
          : (heroBackground || heroForeground) && <HeroSection />}
        {states.length > 0 && <QuickLinks />}
        {features.datasets && <DatasetCatalog />}
        {features.datasets && <Resources />}
        {stories.length > 0 && <Stories />}
        {OutroSection && <OutroSection />}
      </div>
    </div>
  );
}
