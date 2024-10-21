import Image from 'next/image';
import { Text } from 'opub-ui';

const Partners = () => {
  return (
    <>
      <section className="flex h-full w-full bg-surfaceDefault px-5 py-6 lg:px-6 lg:py-20">
        <div className="container flex w-full  flex-wrap gap-8  lg:gap-24">
          <div className="flex flex-col  gap-9">
            <Text className=" text-basePureBlack" variant="headingXl">
              Supported by
            </Text>
            <div className="flex flex-wrap items-center gap-12">
              <Image
                src="/logo/Rockefeller.png"
                width={193}
                height={66}
                alt="Rockefeller Logo"
                className="object-contain"
                style={{
                  width: '193',
                  height: '66',
                }}
              />
              <Image
                src="/logo/PJMc.png"
                width={194}
                height={72}
                alt="OCP Logo"
                className="object-contain"
                style={{
                  width: '194',
                  height: '72',
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-9">
            <Text className=" text-basePureBlack" variant="headingXl">
              In Collaboration with{' '}
            </Text>
            <div className="flex flex-wrap items-center gap-12 ">
              <Image
                src="/logo/ASDMA3.svg"
                width={92}
                height={72}
                alt="ASDMA Logo"
                className="object-contain"
                style={{
                  width: '92',
                  height: '72',
                }}
              />
              <Image
                src="/logo/hp.png"
                width={92}
                height={72}
                alt="ASDMA Logo"
                className="object-contain"
                style={{
                  width: '92',
                  height: '72',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;
