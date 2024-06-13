import React from 'react';
import Image from 'next/image';
import { Text } from 'opub-ui';

import { MediaRendering } from '@/components/media-rendering';
import styles from './styles.module.scss';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Aashim', role: 'Frontend Engineer', imageUrl: '/teams/aashim.jpg' },
  {
    name: 'Abhinandita',
    role: 'Senior Product Designer',
    imageUrl: '/teams/abhinandita.jpg',
  },
  {
    name: 'Aparna',
    role: 'Associate Product Designer',
    imageUrl: '/teams/aparna.jpg',
  },
  { name: 'Archit', role: 'Backend Engineer', imageUrl: '/teams/archit1.jpg' },
  { name: 'Deepthi', role: 'Founder', imageUrl: '/teams/dc.jpg' },
  { name: 'Jeeno', role: 'Senior Researcher', imageUrl: '/teams/jeeno.jpg' },
  { name: 'Kabeer', role: 'Initiative Lead', imageUrl: '/teams/kabeer.jpg' },
  {
    name: 'Kakoli',
    role: 'Partnership & Outreach Manager',
    imageUrl: '/teams/kakoli.jpg',
  },
  { name: 'Nupura', role: 'Design Lead', imageUrl: '/teams/nupura.jpeg' },
  {
    name: 'Rakhi',
    role: 'Associate Initiative Lead',
    imageUrl: '/teams/rakhi.jpg',
  },
  {
    name: 'Ruthvik',
    role: 'Associate Lead Engineer',
    imageUrl: '/teams/ruthvik.jpg',
  },
  {
    name: 'Sai',
    role: 'Senior Data Engineer',
    imageUrl: '/teams/sai.png',
  },
  {
    name: 'Saqib',
    role: 'Quality Assurance Engineer',
    imageUrl: '/teams/saqib.jpg',
  },
  {
    name: 'Sumit',
    role: 'Senior Design Researcher',
    imageUrl: '/teams/sumit.jpg',
  },
  { name: 'Swati', role: 'Frontend Engineer', imageUrl: '/teams/swati1.jpg' },
];

export function TheTeam() {
  return (
    <section className="flex flex-col flex-wrap py-14 ">
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* DESKTOP  */}
        <div className="container mb-2 flex flex-col gap-8 ">
          <Text variant="heading2xl" fontWeight="bold" color="default">
            The Team
          </Text>
          <div className={styles.grid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.card}>
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  height={100}
                  width={200}
                  className="object-contain pt-4 "
                />
                <div className="flex w-full flex-col gap-2 pl-8 pt-4 ">
                  <Text
                    variant="headingLg"
                    fontWeight="semibold"
                    color="default"
                  >
                    {member.name}
                  </Text>
                  <Text
                    variant="headingMd"
                    fontWeight="regular"
                    color="subdued"
                  >
                    {member.role}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* mobile */}
        <div className="container mb-2 flex flex-col gap-8 ">
          <Text variant="heading2xl" fontWeight="bold" color="default">
            The Team
          </Text>
          <div className={styles.grid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.card}>
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  height={100}
                  width={200}
                  className="object-contain pt-4 "
                />
                <div className="flex w-full flex-col gap-2 pl-8 pt-4 ">
                  <Text
                    variant="headingLg"
                    fontWeight="semibold"
                    color="default"
                  >
                    {member.name}
                  </Text>
                  <Text
                    variant="headingMd"
                    fontWeight="regular"
                    color="subdued"
                  >
                    {member.role}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MediaRendering>
    </section>
  );
}
