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
    <main className=" bg-baseGreenSolid5">
      <About />
      <Introduction />
      <CollaboratingPartner />
      <SupportedBy />
      <TheTeam />
      {/* <Engagements /> */}
      {/* <DataStories /> */}
    </main>
  );
}
