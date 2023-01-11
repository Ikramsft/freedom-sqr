describe('Signup flow', () => {
  it('should load signup screen successfully', async () => {
    await waitFor(element(by.id('header-signup-button')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.id('header-signup-button')).tap();

    const signupButton = element(by.id('sign-up-button'));
    await expect(signupButton).toBeVisible();
  });

  it('should not register successfully with invalid credentials', async () => {
    const emailInput = element(by.id('email'));
    await emailInput.replaceText('janak.nirmal@gmail.com');

    const usernameInput = element(by.id('username'));
    await usernameInput.replaceText('janakn');

    const passwordInput = element(by.id('password'));
    await passwordInput.replaceText('Pass@123');

    const confirmPasswordInput = element(by.id('confirm-password'));
    await confirmPasswordInput.replaceText('Pass@123');

    const signupButton = element(by.id('sign-up-button'));
    await signupButton.tap();

    await expect(signupButton).toBeVisible();
  });

  it('should register successfully with valid credentials', async () => {
    const emailInput = element(by.id('email'));
    await emailInput.replaceText('janak.nirmal+17@gmail.com');

    const usernameInput = element(by.id('username'));
    await usernameInput.replaceText('janakn17');

    const passwordInput = element(by.id('password'));
    await passwordInput.replaceText('Pass@123');

    const confirmPasswordInput = element(by.id('confirm-password'));
    await confirmPasswordInput.replaceText('Pass@123');

    const signupButton = element(by.id('sign-up-button'));
    await signupButton.tap();

    await waitFor(element(by.text('Check your email')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
