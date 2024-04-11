import {
  About,
  CollaboratingPartner,
  DataStories,
  Engagements,
  Introduction,
  SupportedBy,
  TheTeam,
} from './components';

export default function aboutUs() {
  return (
    <main>
      <div className="flex-grow-1 flex h-full w-full flex-col items-center gap-1  bg-baseGreenSolid5">
        <About />
        <Introduction />
        <CollaboratingPartner />
        <SupportedBy />
        <TheTeam />
        <Engagements />
        <DataStories />
      </div>
    </main>
  );
}
