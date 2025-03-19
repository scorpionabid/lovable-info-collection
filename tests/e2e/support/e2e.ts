// tests/e2e/support/e2e.ts
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(loginData: { email: string; password: string }): Chainable<void>;
    }
  }
}