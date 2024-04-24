import Link from 'next/link';
import { Button, Icon, IconButton, Menu, Text } from 'opub-ui';

import { DatasetSource, DatasetsURL, GithubRepoLink } from '@/config/consts';
import { copyCurrentURL, handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';

const currentURL = typeof window !== 'undefined' ? window.location.href : '';

export const DatasetInfoCard = ({
  title,
  description,
  source,
  homepage,
}: {
  title: string;
  description: string;
  source: string;
  homepage: string;
}) => {
  return (
    <div
      id="dataset-info"
      className="flex items-center gap-0 self-stretch bg-surfaceDefault p-0 shadow-basicSm"
    >
      <div className="pb-36 pl-5 pt-4">
        <Link href={DatasetsURL}>
          <IconButton color="subdued" icon={Icons.left} size="large">
            Left
          </IconButton>
        </Link>
      </div>
      <div className="shadow-card flex grow border-r-1 border-solid border-borderDisabled py-6 pl-5 pr-14">
        <div className="flex grow flex-col gap-2">
          <Text variant="headingLg" fontWeight="semibold">
            {title}
          </Text>
          <Text
            variant="headingMd"
            fontWeight="medium"
            className="text-textSubdued"
          >
            {DatasetSource} : {source}
          </Text>

          <Text className="mb-3 mt-3" variant="bodyMd" fontWeight="regular">
            {description}
          </Text>
          <div className="flex items-center gap-6">
            <Button
              monochrome={true}
              kind="tertiary"
              onClick={(event) => handleRedirect(event, homepage)}
            >
              <div className="flex items-center gap-1">
                <Text color="interactive" variant="bodyMd">
                  Visit source website
                </Text>
                <Icon source={Icons.externalLink} color="interactive" />
              </div>
            </Button>

            <Button
              monochrome={true}
              kind="tertiary"
              onClick={(event) => handleRedirect(event, GithubRepoLink)}
            >
              <div className="flex items-center gap-1">
                <Text color="interactive" variant="bodyMd">
                  Go to Github Repo
                </Text>
                <Icon source={Icons.externalLink} color="interactive" />
              </div>
            </Button>

            <div className="flex items-center gap-1">
              <Menu
                trigger={
                  <Button monochrome={true} kind="tertiary">
                    <div className="flex items-center gap-1">
                      <Text color="interactive" variant="bodyMd">
                        Share dataset
                      </Text>
                      <Icon source={Icons.share} color="interactive" />
                    </div>
                  </Button>
                }
                items={[
                  {
                    content: 'Facebook',
                    icon: Icons.IconBrandFacebook,
                    onAction: () =>
                      window.open(
                        `https://www.facebook.com/sharer.php?u=${currentURL}/`
                      ),
                  },
                  {
                    content: 'LinkedIn',
                    icon: Icons.IconBrandLinkedin,
                    onAction: () =>
                      window.open(
                        `https://www.linkedin.com/shareArticle?url=${currentURL}/`
                      ),
                  },
                  {
                    content: 'Twitter',
                    icon: Icons.IconBrandX,
                    onAction: () =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${currentURL}/`
                      ),
                  },
                  {
                    content: 'Copy Link',
                    icon: Icons.link,
                    onAction: () => copyCurrentURL(),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
