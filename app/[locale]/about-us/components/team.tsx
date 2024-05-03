import React from 'react';
import Image from 'next/image';
import { Text } from 'opub-ui';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

const teamMembers: TeamMember[] = [
  { name: 'name', role: 'Developer', imageUrl: '/logo/ASDMA.png' },
  { name: 'name', role: 'Developer', imageUrl: '/logo/ASDMA.png' },
  { name: 'name', role: 'Developer', imageUrl: '/logo/ASDMA.png' },
  { name: 'name', role: 'Developer', imageUrl: '/logo/ASDMA.png' },
  { name: 'name', role: 'Developer', imageUrl: '/logo/ASDMA.png' },
  { name: 'name', role: 'Developer', imageUrl: '/logo/ASDMA.png' },
  { name: 'name', role: 'Developer', imageUrl: '/logo/ASDMA.png' },
  { name: 'name', role: 'Developer', imageUrl: '/logo/ASDMA.png' },
];

export function TheTeam() {
  return (
    <section className="flex flex-col flex-wrap py-14 ">
      <div className="container mb-2 flex flex-col gap-8 ">
        <Text variant="heading2xl" fontWeight="bold" color="default">
          The Team
        </Text>

        <div
          className="grid w-full gap-16"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(315px, 100%), 1fr))',
          }}
        >
          {/* <div className="flex w-full flex-wrap justify-between gap-6"> */}
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="shadow-md self-center bg-baseIndigoSolid1 p-4"
            >
              <Image
                src={member.imageUrl}
                alt={member.name}
                height={196}
                width={251}
                className="w-full object-contain "
              />
              <div className="flex w-full flex-col gap-4 text-left   ">
                <Text variant="bodyMd" fontWeight="bold" color="default">
                  {member.name}{' '}
                </Text>
                <Text variant="bodySm" fontWeight="regular" color="subdued">
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
