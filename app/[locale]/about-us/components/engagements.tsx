import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Text,
} from 'opub-ui';

interface EngagementsArr {
  description: string;

  imageUrl: string;
}

const engagements: EngagementsArr[] = [
  { description: 'Caption Text', imageUrl: '/logo/ourEngagements1.png' },
  { description: 'Caption Text', imageUrl: '/logo/ourEngagements1.png' },
  { description: 'Caption Text', imageUrl: '/logo/ourEngagements1.png' },
  { description: 'Caption Text', imageUrl: '/logo/ourEngagements1.png' },
  { description: 'Caption Text', imageUrl: '/logo/ourEngagements1.png' },
  { description: 'Caption Text', imageUrl: '/logo/ourEngagements1.png' },
];

export function Engagements() {
  return (
    <section className="flex flex-col py-14">
      <div className="flex w-[1440px] flex-col gap-8">
        <Text variant="heading2xl" fontWeight="bold" color="default">
          Our engagements
        </Text>
        <div className="overflow-x-auto">
          <Carousel className="w-full">
            <CarouselContent className="flex">
              {engagements.map((engagement, index) => (
                <CarouselItem key={index} className="flex-none p-4">
                  <div className="flex flex-col items-center">
                    <Image
                      src={engagement.imageUrl}
                      alt={engagement.description}
                      height={196}
                      width={251}
                      className="w-full"
                    />
                    <Text
                      variant="bodyMd"
                      fontWeight="bold"
                      color="default"
                      className="mt-2"
                    >
                      {engagement.description}
                    </Text>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="z-10" />
            <CarouselNext className="z-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
