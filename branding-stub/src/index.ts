import type { ComponentType } from 'react';
import type { DeploymentConfig } from 'ids-drr-branding-types';

// Optional React components that the frontend renders if provided.
export const AboutPage: ComponentType | undefined = undefined;
export const HomeAbout: ComponentType | undefined = undefined;
export const HomePartners: ComponentType | undefined = undefined;
export const DataStories: ComponentType | undefined = undefined;
export const Footer: ComponentType | undefined = undefined;
export const Credits: ComponentType | undefined = undefined;
export const PartnerLogos: ComponentType | undefined = undefined;

// Empty default deployment config. See branding-types/src/index.ts.
export const config: DeploymentConfig = {};
