import React from 'react';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  IconButton,
  Text,
} from 'opub-ui';

import Icons from './icons';

type FilterButtonOption = {
  title: string;
  value: string;
  options?: { label: string; value: string }[] | string[];
  type: string;
}[];

export const MobileFilterBox = ({
  open,
  children,
  filterOptions,
  onSelectedOption,
  handleApplyFilters,
  handleClearFilters,
  toggleDrawerCallback,
}: {
  open: boolean;
  children: React.ReactNode;
  filterOptions: FilterButtonOption;
  onSelectedOption: (val: string) => void;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  toggleDrawerCallback: () => void;
}) => {
  const toggleDrawer = () => {
    toggleDrawerCallback();
  };

  return (
    <Drawer open={open}>
      <DrawerContent>
        <DrawerHeader className=" h-[56px] border-b-1 border-solid border-[#C9CCCF]">
          <DrawerTitle className="flex justify-between ">
            <Text variant="headingMd">Options</Text>
            <IconButton
              icon={Icons.cross}
              onClick={toggleDrawer}
              color="default"
            >
              Close
            </IconButton>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="flex h-[276px]">
          <div className="flex basis-auto flex-col items-start gap-3 border-x-1 border-solid border-borderSubdued p-4">
            {filterOptions.map(
              (item: { value: string; title: string }, index: number) => (
                <div key={`${item.value}-${index}`}>
                  <Button
                    className={'min-w-[80px]  text-textDefault'}
                    size="slim"
                    fullWidth
                    kind="tertiary"
                    // onClick={() => boundarySelection()}
                    onClick={() => {
                      onSelectedOption(item?.value);
                    }}
                  >
                    <Text className="text-left">{item.title}</Text>
                  </Button>
                </div>
              )
            )}
          </div>
          <MobileFilterContent>
            <div className="flex max-h-[270px] w-full flex-col overflow-y-auto p-4">
              {children}
            </div>
          </MobileFilterContent>
        </DrawerDescription>
        <DrawerFooter className="flex flex-row border-t-1 border-solid border-[#BDBDBD]">
          <Button
            onClick={handleClearFilters}
            className=" basis-1/2 border-1 border-[#71E57D] bg-[#ffffff]"
            size="large"
          >
            <Text variant="bodyLg" fontWeight="bold" color="default">
              Clear All
            </Text>
          </Button>
          <DrawerClose onClick={toggleDrawer} asChild>
            <Button
              onClick={handleApplyFilters}
              className="basis-1/2 bg-[#71E57D]"
              size="large"
            >
              <Text variant="bodyLg" fontWeight="bold" color="default">
                Apply
              </Text>
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const MobileFilterContent = ({ children }: any) => <>{children}</>;
