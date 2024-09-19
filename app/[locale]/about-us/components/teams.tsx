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
    name: 'Ruthvik',
    role: 'Associate Lead Engineer',
    imageUrl: '/teams/ruthvik.jpg',
  },
  {
    name: 'Aparna',
    role: 'Associate Product Designer',
    imageUrl: '/teams/aparna.jpg',
  },
  {
    name: 'Sanjay',
    role: 'Frontend Engineer',
    imageUrl: '/teams/sanjay.jpg',
  },
  {
    name: 'Sumit',
    role: 'Senior Design Researcher',
    imageUrl: '/teams/sumit.jpg',
  },
  { name: 'Swati', role: 'Frontend Engineer', imageUrl: '/teams/swati1.jpg' },
  {
    name: 'Saqib',
    role: 'Quality Assurance Engineer',
    imageUrl: '/teams/saqib.jpg',
  },
  {
    name: 'Abhinandita',
    role: 'Senior Product Designer',
    imageUrl: '/teams/abhinandita.jpg',
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
  return (
    <section className=" py-14 ">
      {/* DESKTOP  */}
      <div className="container ">
        <Text variant="heading2xl" fontWeight="bold" color="default">
          The Team
        </Text>
        <div className="mt-2 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 ">
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
