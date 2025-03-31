import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button, Text } from 'opub-ui';

import {
  CDLPartnershipTextOne,
  CDLPartnershipTextThree,
  CDLPartnershipTextTwo,
  OpenContractingPartnershipTextOne,
} from '@/config/consts';
import { handleRedirect } from '@/lib/utils';
import styles from './styles.module.scss';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Gaurav',
    role: 'Founder',
    imageUrl: '/teams/gaurav.jpg',
  },
  { name: 'Kabeer', role: 'Initiative Lead', imageUrl: '/teams/kabeer.jpg' },
  { name: 'Nupura', role: 'Design Lead', imageUrl: '/teams/nupura.jpeg' },

  {
    name: 'Rakhi',
    role: 'Associate Initiative Lead',
    imageUrl: '/teams/rakhi.jpg',
  },
  { name: 'Deepthi Chand', role: 'Founder', imageUrl: '/teams/dc.jpg' },
  {
    name: 'Aparna',
    role: 'Associate Product Designer',
    imageUrl: '/teams/aparna.jpg',
  },
  {
    name: 'Bhavabhuthi',
    role: 'Senior Frontend Engineer',
    imageUrl: '/teams/bhavabhuthi.jpg',
  },
  {
    name: 'Saqib',
    role: 'Quality Assurance Engineer',
    imageUrl: '/teams/saqib.jpg',
  },

  { name: 'Swati', role: 'Frontend Engineer', imageUrl: '/teams/swati1.jpg' },

  {
    name: 'Sanjay',
    role: 'Frontend Engineer',
    imageUrl: '/teams/sanjay.jpg',
  },

  {
    name: 'Abhinandita',
    role: 'Senior Product Designer',
    imageUrl: '/teams/abhinandita.jpg',
  },
  {
    name: 'Ruthvik',
    role: 'Associate Lead Engineer',
    imageUrl: '/teams/ruthvik.jpg',
  },
  {
    name: 'Sumit',
    role: 'Senior Design Researcher',
    imageUrl: '/teams/sumit.jpg',
  },
  {
    name: 'Kakoli',
    role: 'Partnership & Outreach Manager',
    imageUrl: '/teams/kakoli.jpg',
  },
  { name: 'Archit', role: 'Backend Engineer', imageUrl: '/teams/archit1.jpg' },
  {
    name: 'Sai Krishna',
    role: 'Senior Data Engineer',
    imageUrl: '/teams/sai.png',
  },
  { name: 'Jeeno', role: 'Senior Researcher', imageUrl: '/teams/jeeno.jpg' },
  { name: 'Aashim', role: 'Frontend Engineer', imageUrl: '/teams/aashim.jpg' },
];

export function TheTeam() {
  const [showMore, setShowMore] = useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);

  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const toggleShowMore = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent link navigation
    event.stopPropagation(); // Stop event from propagating to the card's link
    setShowMore((prevState) => !prevState);
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const isLong =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setIsDescriptionLong(isLong);
    }
  }, []);
  return (
    <section
      className=" py-14 "
      aria-label="The team behind the IDS-DRR project"
    >
      {/* DESKTOP  */}
      <div className="container mb-2 flex flex-col gap-8 ">
        <Text variant="heading2xl" fontWeight="bold" color="default" as="h2">
          Co-created by
        </Text>

        <div className="flex flex-wrap items-center justify-center gap-10 rounded-2 bg-baseIndigoSolid1 p-9 lg:flex-nowrap ">
          <div className="flex flex-col items-center gap-4 text-surfaceDefault">
            <Image
              src="/logo/OpenContracting.png"
              height={190}
              width={230}
              alt="Open Contracting Partnership Logo"
              className=" object-contain "
            />
            <div className="flex flex-row items-center justify-between self-stretch">
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://www.open-contracting.org/')
                }
              >
                <img src="/web.svg" alt="OCP website link" />
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(
                    event,
                    'https://www.linkedin.com/company/opencontractingpartnership'
                  )
                }
              >
                <img src="/linkedin.svg" alt="OCP link to LinkedIn" />{' '}
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://twitter.com/opencontracting')
                }
              >
                <img src="/x.svg" alt="OCP link to Twitter/X" />{' '}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Text
              variant="headingXl"
              fontWeight="medium"
              color="default"
              as="h3"
            >
              Open Contracting Partnership
            </Text>
            <div className="flex flex-col gap-5">
              <div>
                <div
                  ref={descriptionRef}
                  className={!showMore ? ' line-clamp-2 lg:line-clamp-5' : ''}
                >
                  <Text variant="bodyLg" fontWeight="regular" color="default">
                    {OpenContractingPartnershipTextOne}
                  </Text>
                </div>

                {/* Only show the "Show more" button on medium and small screens */}
                {isDescriptionLong && (
                  <div className="block md:hidden">
                    <Button
                      className="self-start p-2"
                      onClick={toggleShowMore}
                      variant="interactive"
                      size="slim"
                      kind="tertiary"
                    >
                      {showMore ? 'Show less' : 'Show more'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 rounded-2 bg-baseIndigoSolid1 p-9 lg:flex-nowrap ">
          <div className="flex flex-col items-center gap-4 text-surfaceDefault">
            <Image
              src="/logo/cdl_logo.svg"
              height={120}
              width={230}
              alt="Civic Data Lab Logo"
              className=" object-contain "
            />
            <div className="flex flex-row items-center justify-between self-stretch">
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://civicdatalab.in/')
                }
              >
                <img src="/web.svg" alt="CDL website link" />
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(
                    event,
                    'https://www.linkedin.com/company/civicdatalab/mycompany/verification/'
                  )
                }
              >
                <img src="/linkedin.svg" alt="CDL link to LinkedIn" />{' '}
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://x.com/CivicDataLab')
                }
              >
                <img src="/x.svg" alt="CDL link to Twitter/X" />{' '}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Text
              variant="headingXl"
              fontWeight="medium"
              color="default"
              as="h3"
            >
              CivicDataLab{' '}
            </Text>
            <div className="flex flex-col gap-5">
              <Text variant="bodyLg" fontWeight="regular" color="default">
                {CDLPartnershipTextOne}
              </Text>
              {/* --------------  */}

              <div>
                <div
                  ref={descriptionRef}
                  className={!showMore ? ' line-clamp-2 lg:line-clamp-5' : ''}
                >
                  <Text variant="bodyLg" fontWeight="regular" color="default">
                    {CDLPartnershipTextTwo} {CDLPartnershipTextThree}
                  </Text>
                </div>

                {/* Only show the "Show more" button on medium and small screens */}
                {isDescriptionLong && (
                  <div className="block md:hidden">
                    <Button
                      className="self-start p-2"
                      onClick={toggleShowMore}
                      variant="interactive"
                      size="slim"
                      kind="tertiary"
                    >
                      {showMore ? 'Show less' : 'Show more'}
                    </Button>
                  </div>
                )}
              </div>
              {/* --------------  */}
            </div>
          </div>
        </div>
        {/* <div className="mt-6 grid grid-cols-1 gap-10 rounded-2 md:grid-cols-2 lg:grid-cols-3 "> */}
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.card}>
              <Image
                src={member.imageUrl}
                alt={`${member.name}'s picture`}
                height={100}
                width={200}
                className="object-contain pt-4 "
              />
              <div className="flex w-full flex-col gap-2 pl-8 pt-4 ">
                <Text variant="headingLg" fontWeight="semibold" color="default">
                  {member.name}
                </Text>
                <Text variant="headingMd" fontWeight="regular" color="subdued">
                  {member.role}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
