import * as branding from '@/config/branding';

describe('branding config', () => {
  it('re-exports branding components from the deployment package', () => {
    expect(branding).toBeDefined();
    // Stub package may export undefined slots; importing still validates the contract.
    expect('AboutPage' in branding).toBe(true);
    expect('Footer' in branding).toBe(true);
  });
});
