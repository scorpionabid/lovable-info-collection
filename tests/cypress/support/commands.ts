// cypress/support/commands.ts
declare namespace Cypress {
  interface LoginData {
    email: string;
    password: string;
  }

  interface Chainable {
    login(loginData: LoginData): Chainable<void>;
  }
}

Cypress.Commands.add('login', (loginData: Cypress.LoginData) => {
  if (!loginData.email || !loginData.password) {
    throw new Error('Email and password are required');
  }

  cy.visit('/login');
  cy.get('input[name="email"]').type(loginData.email);
  cy.get('input[name="password"]').type(loginData.password);
  cy.get('button[type="submit"]').click();
});