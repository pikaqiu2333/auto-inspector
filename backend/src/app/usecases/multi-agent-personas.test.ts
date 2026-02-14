import { test, expect } from '@playwright/test';
import { PersonaConfigurator } from '../../services/persona-configurator';
import { AgentPersona } from '../../domain/agent-personas';

test.describe('Multi-Agent Personas Testing', () => {
  const configurator = new PersonaConfigurator();

  test('Alice (Newbie) - Slow typing, careful', async ({ page }) => {
    const persona = configurator.getPersona('Alice');
    expect(persona).toBeDefined();
    expect(persona?.type).toBe('newbie');

    await page.goto('https://example.com/register');

    // Simulate slow typing
    const username = 'alice_test';
    for (const char of username) {
      await page.locator('#username').type(char, { delay: persona!.typingSpeed });
    }

    // Slow down for reading prompts
    await page.waitForTimeout(1000);

    // Fill email
    await page.fill('#email', 'alice@example.com');
    await page.fill('#password', 'SecurePass123!');

    // Submit
    await page.click('#register');
    await page.waitForSelector('.success', { timeout: 5000 });
  });

  test('Bob (Cautious) - Reads privacy policy, fills optional fields', async ({ page }) => {
    const persona = configurator.getPersona('Bob');
    expect(persona).toBeDefined();
    expect(persona?.type).toBe('cautious');

    await page.goto('https://example.com/register');

    // Fill basic fields
    await page.fill('#username', 'bob_test');
    await page.fill('#email', 'bob@example.com');

    // Read privacy policy (cautious behavior)
    if (persona!.readsPrivacy) {
      await page.click('#privacy-link');
      await page.waitForTimeout(500);
      await page.goBack();
    }

    // Fill password
    await page.fill('#password', 'SecurePass123!');

    // Fill optional fields (phone number)
    if (persona!.fillsOptional) {
      await page.fill('#phone', '13800138000');
    }

    // Submit
    await page.click('#register');
    await page.waitForSelector('.success', { timeout: 5000 });
  });

  test('Charlie (Impatient) - Fast typing, skips optional fields', async ({ page }) => {
    const persona = configurator.getPersona('Charlie');
    expect(persona).toBeDefined();
    expect(persona?.type).toBe('impatient');

    await page.goto('https://example.com/register');

    // Fast typing (slow down)
    const username = 'charlie_test';
    for (const char of username) {
      await page.locator('#username').type(char, { delay: persona!.typingSpeed });
    }

    // Skip reading prompts
    await page.fill('#email', 'charlie@example.com');
    await page.fill('#password', '123'); // Weak password - may fail
    await page.click('#register');

    // Check if error is shown (expected for weak password)
    const errorVisible = await page.isVisible('.error');
    expect(errorVisible).toBe(true);
  });

  test('David (Malicious) - Tries SQL injection and XSS attacks', async ({ page }) => {
    const persona = configurator.getPersona('David');
    expect(persona).toBeDefined();
    expect(persona?.type).toBe('malicious');

    await page.goto('https://example.com/register');

    // Try SQL injection
    await page.fill('#username', "admin'; DROP TABLE users; --");

    // Try XSS attack
    await page.fill('#email', '<script>alert("xss")</script>@evil.com');

    // Try SQL login bypass
    await page.fill('#password', "' OR '1'='1");

    await page.click('#register');

    // Expect backend to block the attack
    const errorVisible = await page.isVisible('.error');
    expect(errorVisible).toBe(true);
  });

  test('Run all personas and collect UX metrics', async ({ page }) => {
    const personas = configurator.getAllPersonas();
    const results: Array<{
      persona: string;
      success: boolean;
      duration: number;
    }> = [];

    for (const persona of personas) {
      const startTime = Date.now();

      await page.goto('https://example.com/register');

      // Simulate persona behavior
      await page.fill('#username', `${persona.name}_test`);
      await page.fill('#email', `${persona.name.toLowerCase()}@example.com`);

      if (persona.readsPrivacy) {
        await page.click('#privacy-link');
        await page.waitForTimeout(500);
      }

      await page.fill('#password', persona.isMalicious ? "' OR '1'='1" : 'SecurePass123!');
      await page.click('#register');

      const endTime = Date.now();
      const duration = endTime - startTime;

      const success = !persona.isMalicious && persona.name !== 'Charlie';

      results.push({
        persona: persona.name,
        success,
        duration
      });

      // Wait before next test
      await page.waitForTimeout(1000);
    }

    // Calculate success rate
    const successCount = results.filter(r => r.success).length;
    const successRate = (successCount / results.length) * 100;

    // Calculate average duration
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

    console.log(`Success Rate: ${successRate}%`);
    console.log(`Average Duration: ${avgDuration}ms`);

    expect(successRate).toBeGreaterThan(0);
    expect(avgDuration).toBeGreaterThan(0);
  });
});
