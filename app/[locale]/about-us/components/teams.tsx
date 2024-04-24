import React from 'react';
import Image from 'next/image';
import { Text } from 'opub-ui';

import styles from './styles.module.scss';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Aashim', role: 'Frontend Engineer', imageUrl: '/teams/aashim.jpg' },
  { name: 'Archit', role: 'Backend Engineer', imageUrl: '/teams/archit.jpg' },
  { name: 'Deepthi', role: 'Founder', imageUrl: '/teams/dc.jpg' },
  { name: 'Jeeno', role: 'Senior Researcher', imageUrl: '/teams/Jeeno.jpg' },
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
    name: 'Saqib',
    role: 'Quality Assurance Engineer',
    imageUrl: '/teams/saqib.jpg',
  },
  {
    name: 'Sumit',
    role: 'Senior Design Researcher',
    imageUrl: '/teams/sumit.jpg',
  },
  { name: 'Swati', role: 'Frontend Engineer', imageUrl: '/teams/swati.jpg' },
];

export function TheTeam() {
  return (
    <section className="flex flex-col flex-wrap py-14 ">
      <div className="mb-2 flex w-[1440px] flex-col gap-8 ">
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
              />
              <div className="flex w-full flex-col gap-4 p-4">
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
