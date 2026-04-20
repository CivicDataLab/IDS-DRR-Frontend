import { HeroSection, QuickLinks } from './components';
import { DatasetCatalog } from './components/dataset-catalog';
import Resources from './components/resources';

export default async function Home() {
  const { DataStories, HomeAbout, HomePartners } = await import('ids-drr-branding');

  return (
    <main className="bg-baseGreenSolid5 ">
      <div className="inline-flex w-full flex-col items-center ">
        <HeroSection />
        <QuickLinks />
        {process.env.NEXT_PUBLIC_BACKEND_URL && <DatasetCatalog />}
        {process.env.NEXT_PUBLIC_BACKEND_URL && <Resources />}
        {DataStories && <DataStories />}
        {HomeAbout && <HomeAbout />}
        {HomePartners && <HomePartners />}
      </div>
    </main>
  );
}
