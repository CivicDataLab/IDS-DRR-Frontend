import Image from 'next/image';
import { Text } from 'opub-ui';

const Partners = () => {
  return (
    <>
      <section
        className="flex h-full w-full bg-baseGreenSolid5  px-5 py-6 lg:px-6  lg:py-20"
        aria-labelledby="partners section"
      >
        <div className="container flex w-full  flex-wrap gap-8 lg:gap-24">
          <div className="flex flex-col  gap-9">
            <Text className=" text-basePureBlack" variant="headingXl">
              Supported by
            </Text>
            <div className="flex flex-row items-center gap-12">
              <div className="flex flex-col gap-4 text-center">
                <div className="flex h-40 flex-col items-start justify-center self-stretch rounded-2 bg-surfaceDefault p-4">
                  <Image
                    src="/logo/Rockefeller.png"
                    width={193}
                    height={66}
                    alt="Rockefeller Logo"
                    className="h-auto w-full object-contain"
                    style={{
                      width: '193',
                      height: '66',
                    }}
                  />
                </div>

                <div className="mx-auto w-full max-w-[183px]">
                  <Text variant="bodyMd" fontWeight="bold" as="h3">
                    The Rockefeller Foundation
                  </Text>
                </div>
              </div>
              <div className=" flex flex-col gap-4 text-center">
                <div className="flex h-40 flex-col items-start justify-center self-stretch rounded-2 bg-surfaceDefault p-4">
                  <Image
                    src="/logo/PJMc.png"
                    width={194}
                    height={72}
                    alt="OCP Logo"
                    className="h-auto w-full object-contain"
                    style={{
                      width: '194',
                      height: '72',
                    }}
                  />
                </div>
                <div className="mx-auto w-full max-w-[183px]">
                  <Text variant="bodyMd" fontWeight="bold" as="h3">
                    Patrick J McGovern Foundation
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-9">
            <Text className=" text-basePureBlack" variant="headingXl">
              In Collaboration with{' '}
            </Text>
            <div className="flex flex-row items-center gap-12 ">
              <div className="flex flex-col gap-4 text-center">
                <div className="flex h-40 flex-col items-center justify-center self-stretch rounded-2 bg-surfaceDefault p-4">
                  <Image
                    src="/logo/ASDMA3.svg"
                    width={192}
                    height={72}
                    alt="ASDMA Logo"
                    className="h-auto w-full object-contain"
                    style={{
                      width: '192',
                      height: '72',
                    }}
                  />
                </div>

                <div className="mx-auto w-full max-w-[183px]">
                  <Text variant="bodyMd" fontWeight="bold" as="h3">
                    Assam State Disaster Management Authority
                  </Text>
                </div>
              </div>

              <div className=" flex flex-col gap-4 text-center">
                <div className="flex h-40 flex-col items-center justify-center self-stretch rounded-2 bg-surfaceDefault p-4">
                  <Image
                    src="/logo/hp.png"
                    width={192}
                    height={72}
                    alt="HPSDMA Logo"
                    className="h-auto w-full object-contain"
                    style={{
                      width: '80%',
                      height: 'auto',
                    }}
                    // style={{
                    //   width: '192',
                    //   height: '72',
                    // }}
                  />
                </div>
                <div className="mx-auto w-full max-w-[221px]">
                  <Text variant="bodyMd" fontWeight="bold" as="h3">
                    Himachal Pradesh State Disaster Management Authority
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;
