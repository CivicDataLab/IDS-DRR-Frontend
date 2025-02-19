const platformName = 'Intelligent Data Solution';

//General
const RiskColorMap: {
  [key: number]: {
    backgroundColor: string;
    indicatorColor: string;
  };
} = {
  5: {
    backgroundColor: '#d416057a',
    indicatorColor: '#D41505',
  },
  4: {
    backgroundColor: '#fb8b357a',
    indicatorColor: '#FB8C35',
  },
  3: {
    backgroundColor: '#ffee6e82',
    indicatorColor: '#FFED6E',
  },
  2: {
    backgroundColor: '#65a4bd77',
    indicatorColor: '#65A4BD',
  },
  1: {
    backgroundColor: '#4575b480',
    indicatorColor: '#4575B4',
  },
};

const Factors = [
  'risk-score',
  'flood-hazard',
  'vulnerability',
  'government-response',
  'exposure',
];

const RiskText: {
  [key: number]: {
    indicatorText: string;
  };
} = {
  5: {
    indicatorText: 'Very High Risk',
  },
  4: {
    indicatorText: 'High Risk',
  },
  3: {
    indicatorText: 'Medium  Risk',
  },
  2: {
    indicatorText: 'Low Risk',
  },
  1: {
    indicatorText: 'Very Low Risk',
  },
};

// Datasets page
const DatasetSource = 'Source';
const LastUpdated = 'Last Updated';
const UpdateFreq = 'Update Frequency';
const datasetsPageHeader = 'Assam DRR : Datasets';
const datasetsExplorerPageHeader = 'Assam DRR : Datasets';
const DatasetsURL = `/datasets?size=5&page=1&sort=recent`;
const GithubRepoLink = `https://github.com/CivicDataLab/flood-data-ecosystem-Assam/tree/main/Sources`;

//analytics page
const AnalyticsURL = `/analytics/?indicator=risk-score&time-period=${process.env.TIME_PERIOD || process.env.NEXT_PUBLIC_TIME_PERIOD}&view=map`;
const learnMoreLink = `https://drive.google.com/file/d/1TerjJtQrWxziKJ1E5BvfvRELtWJWRw2M/view?usp=drive_link`;

//home page
const AboutText = 'About IDS-DRR';
const AboutUsURL = '/about-us';
const AboutTextContentOne =
  'CivicDataLab along with Open Contracting Partnership, supported by The Rockefeller Foundation and the Patrick J McGovern Foundation, has developed a data driven framework - Intelligent Data Solution for Disaster Risk Reduction (IDS-DRR).  ';

const AboutTextContentTwo =
  'It is a data analytics and risk mapping platform to help make informed and impactful decisions, prioritise resource allocation, plan and manage funds intended for disaster risk reduction and climate mitigation. The platform enables effective solutions and sustainable action for  vulnerable geographies.';

const AboutTextContentThree = 'We have a 3-pronged approach: ';

const HeroSectionText =
  'Discover insights, assess risks and build disaster resilience for data-driven disaster risk reduction';

const AnalyticsQuickLinksText =
  'Gain insights from the IDS-DRR data model to understand the flood-risk profiles of districts and sub-district regions in various states across India';

const DatasetCatalogText = 'Explore and use high-value datasets';

const ResourcesSectionText = 'Browse through the featured datasets';

const DataStoriesText =
  'Read about the impact, methods, and successes in using data for DRR';

const YouTubeLink = 'https://www.youtube.com/watch?v=gTqcyUQ7esg';

//about us page

const aboutUsText = 'Get to know IDS-DRR and the team behind it';

const IntroTextContentOne =
  'Intelligent Data Solution for Disaster Risk Reduction (IDS-DRR) is an open-source platform that helps state-level and district-level Disaster Management Authorities to make timely data-driven decisions, prioritise expenditure of public funds and conduct public procurement in a manner that strengthens long-term disaster risk reduction and protects the most vulnerable people from the adverse effects of extreme weather events and climate change. ';
const IntroTextContentTwo =
  'In this platform, we bring together diverse high-value datasets from satellite, environmental, social, economic, demographic, infrastructure, loss & damages to data regarding government response to derive timely insights. ';

const IntroTextContentThree =
  'This 4-year project led by CivicDataLab & Open Contracting Partnership is planned to improve disaster risk reduction processes & practices in the state of Assam. It is supported by The Rockefeller Foundation.';

const CollaboratingPartnerTextOne =
  'The Assam State Disaster Management Authority was notified in the year 2007 with the adoption of the Disaster Management Act in the year 2006. Honourable Chief Minister, Assam is its Chairperson and Honorable Minister Revenue and Disaster Management is its Vice Chairperson. To execute the mandate of the Authority the State Executive Committee with the Chief Secretary, Assam as its Chairperson has also been notified as per provision of the Disaster Management Act. The ASDMA Secretariat with officers, consultants and employees, for carrying out the functions of the State Authority, became fully functional in the year 2010. ';

const CollaboratingPartnerTextTwo =
  'ASDMA has also notified the District Disaster Management Authority in all the 33 districts of Assam and placed officers for carrying out disaster management activities at the district.';

const CollaboratingPartnerHPText =
  'The HP SDMA has been constituted under the chairmanship of Chief  Minister of Himachal Pradesh. Revenue Minister has been nominated as  member. Chief Secretary is the Chief Executive Officer of the SDMA. ACS  cum FC (Revenue), Principal Secretary (Home), Principal Secretary (PWD/I  & PH), Principal Secretary (Health) and Director General of Police  have also been notified as member. Additional Chief Secretary (Revenue)  is the Member Secretary of the Authority.';

const TheRockefellerFoundationTextOne =
  'The Rockefeller Foundation is a pioneering philanthropy built on collaborative partnerships at the frontiers of science, technology, and innovation that enable individuals, families, and communities to flourish. We make big bets to promote the well-being of humanity. Today, we are focused on advancing human opportunity and reversing the climate crisis by transforming systems in food, health, energy, and finance. ';
const TheRockefellerFoundationTextTwo =
  'For more information, sign up for their newsletter at rockefellerfoundation.org and follow them on X @RockefellerFdn.';
const OpenContractingPartnershipTextOne =
  'Open Contracting Partnership is an independent non-profit working in over 50 countries. OCP is a silo-busting collaboration across governments, businesses, civil society, and technologists to improve public procurement by designing goal-driven reforms, building coalitions of change and co-creating digital solutions, powered by open data. ';

const OpenContractingPartnershipTextTwo =
  'OCP is unique in bringing these three approaches together and at scale. OCP makes sure public money is spent openly, fairly and effectively on public contracts, delivering fundamentally better public spending outcomes that benefit people and protect the planet.';

const PJMcPartnershipText =
  'The Patrick J. McGovern Foundation (PJMF) is a philanthropic organization dedicated to advancing artificial intelligence and data science solutions to create a thriving, equitable, and sustainable future for all. PJMF works in partnership with public, private, and social institutions to drive progress on our most pressing challenges, including digital health, climate change, broad digital access, and data maturity in the social sector.';

const CDLPartnershipTextOne =
  'We are a research lab working at the  intersection of data, tech, design and social science to strengthen the  course of civic engagements in India.';
const CDLPartnershipTextTwo =
  'We work to harness the potential of open knowledge movements and better enable citizens to engage in matters of public reform.';
const CDLPartnershipTextThree =
  'We aim to grow data and tech literacy of governments, non-profits,  think-tanks, media houses, universities, and more to enable data-driven  decision making at scale.';

export {
  platformName,
  DatasetSource,
  LastUpdated,
  UpdateFreq,
  datasetsPageHeader,
  datasetsExplorerPageHeader,
  AnalyticsURL,
  DatasetsURL,
  AboutText,
  AboutTextContentOne,
  AboutTextContentTwo,
  AboutTextContentThree,
  HeroSectionText,
  RiskColorMap,
  RiskText,
  Factors,
  AnalyticsQuickLinksText,
  AboutUsURL,
  YouTubeLink,
  GithubRepoLink,
  IntroTextContentOne,
  IntroTextContentTwo,
  IntroTextContentThree,
  aboutUsText,
  CollaboratingPartnerTextOne,
  CollaboratingPartnerTextTwo,
  OpenContractingPartnershipTextOne,
  OpenContractingPartnershipTextTwo,
  TheRockefellerFoundationTextOne,
  TheRockefellerFoundationTextTwo,
  learnMoreLink,
  DatasetCatalogText,
  ResourcesSectionText,
  DataStoriesText,
  CollaboratingPartnerHPText,
  PJMcPartnershipText,
  CDLPartnershipTextOne,
  CDLPartnershipTextTwo,
  CDLPartnershipTextThree,
};
