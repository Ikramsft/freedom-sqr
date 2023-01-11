const testIf = (condition, ...args) =>
  condition ? test(...args) : test.skip(...args);

describe('Following E2E', () => {
  it('user should be logged in', async () => {
    try {
      await expect(element(by.id('user-avatar'))).toExist();
    } catch (e) {
      await waitFor(element(by.id('header-login-button')))
        .toBeVisible()
        .withTimeout(2000);

      await element(by.id('header-login-button')).tap();

      const signInButton = element(by.id('sign-in-button'));
      await expect(signInButton).toBeVisible();

      const emailInput = element(by.id('email'));
      await emailInput.replaceText('janak.nirmal@gmail.com');

      const passwordInput = element(by.id('password'));
      await passwordInput.replaceText('Pass@123');

      const signInButton1 = element(by.id('sign-in-button'));
      await signInButton1.tap();

      await expect(element(by.text('Featured Posts'))).toBeVisible();
    }
  });

  it('should go to following screen', async () => {
    const DrawerIcon = element(by.id('DrawerIcon'));
    await DrawerIcon.tap();
    const drawerItemFollowing = element(by.id('drawer-item-following'));
    await drawerItemFollowing.tap();
    await expect(element(by.id('title-following'))).toBeVisible();
    await expect(element(by.id('following-items-list'))).toBeVisible();
  });

  it('should open preferences modal', async () => {
    const preferencesButton = element(by.id('preferences-button'));
    await preferencesButton.tap();
    await expect(element(by.id('preferences-modal'))).toBeVisible();
    await expect(element(by.id('preferences-section-header-0'))).toBeVisible();
    await expect(
      element(by.id('preferences-section-header-chevron-down-0')),
    ).toBeVisible();
  });

  it('should check uncheck checkboxes', async () => {
    // test check / unchecking of checkbox
    try {
      const firstCheckboxItem = element(
        by.id(`preferences-item-0-checked`),
      ).atIndex(0);
      await firstCheckboxItem.tap();
      await expect(
        element(by.id('preferences-item-0-unchecked')).atIndex(0),
      ).toBeVisible();
    } catch (error) {
      const firstCheckboxItem = element(
        by.id(`preferences-item-0-unchecked`),
      ).atIndex(0);
      await firstCheckboxItem.tap();
      await expect(
        element(by.id('preferences-item-0-checked')).atIndex(0),
      ).toBeVisible();
    }
  });

  it('should submit and save data and come back to folowing screen', async () => {
    const confirmButton = element(by.id('preferences-confirm-button'));
    await confirmButton.tap();
    await expect(element(by.id('title-following'))).toBeVisible();
    await expect(element(by.id('following-items-list'))).toBeVisible();
  });
});
