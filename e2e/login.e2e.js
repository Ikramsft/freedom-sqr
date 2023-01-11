const signOut = async () => {
  await element(by.id('ProfileLogoutButton')).tap();

  await expect(
    element(by.text('Are you sure you want to logout?')),
  ).toBeVisible();

  await element(by.text('YES')).tap();
};

describe('Login flow', () => {
  it('should load login screen successfully', async () => {
    await waitFor(element(by.id('header-login-button')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.id('header-login-button')).tap();

    const signInButton = element(by.id('sign-in-button'));
    await expect(signInButton).toBeVisible();
  });

  it('should not login successfully with invalid credentials', async () => {
    const emailInput = element(by.id('email'));
    await emailInput.replaceText('janak.nirmal@gmail.com');

    const passwordInput = element(by.id('password'));
    await passwordInput.replaceText('password');

    const signInButton = element(by.id('sign-in-button'));
    await signInButton.tap();
    await expect(signInButton).toBeVisible();
  });

  it('should login successfully with valid credentials', async () => {
    const emailInput = element(by.id('email'));
    await emailInput.replaceText('janak.nirmal@gmail.com');

    const passwordInput = element(by.id('password'));
    await passwordInput.replaceText('Pass@123');

    const signInButton = element(by.id('sign-in-button'));
    await signInButton.tap();

    await expect(element(by.text('Featured Posts'))).toBeVisible();
  });

  it('should logout successfully ', async () => {
    await waitFor(element(by.id('user-avatar')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('user-avatar')).tap();
    await signOut();
  });
});
