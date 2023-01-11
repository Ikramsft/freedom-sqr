describe('Forgot password flow', () => {
  it('should forgot password screen successfully', async () => {
    await waitFor(element(by.id('header-login-button')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.id('header-login-button')).tap();

    await element(by.id('forgot-password-button')).tap();

    const resetPasswordButton = element(by.id('reset-password'));
    await expect(resetPasswordButton).toBeVisible();
  });

  it('should fail successfully with invalid email', async () => {
    const emailInput = element(by.id('forgot-email'));
    await emailInput.replaceText('abcxyz@gmail.com');

    const resetPasswordButton = element(by.id('reset-password'));
    await resetPasswordButton.tap();
    await expect(resetPasswordButton).toBeVisible();
  });

  it('should forgot successfully with valid email', async () => {
    const emailInput = element(by.id('forgot-email'));
    await emailInput.replaceText('janak.nirmal+1@gmail.com');

    const resetPasswordButton = element(by.id('reset-password'));
    await resetPasswordButton.tap();

    await waitFor(element(by.text('Check Your Email')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
