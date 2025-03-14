
/// <reference types="cypress" />

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Login as specific user role
Cypress.Commands.add('loginAsSuperAdmin', () => {
  cy.login('superadmin@infoline.az', 'password');
});

Cypress.Commands.add('loginAsRegionAdmin', () => {
  cy.login('regionadmin@infoline.az', 'password');
});

Cypress.Commands.add('loginAsSectorAdmin', () => {
  cy.login('sectoradmin@infoline.az', 'password');
});

Cypress.Commands.add('loginAsSchoolAdmin', () => {
  cy.login('schooladmin@infoline.az', 'password');
});

// Create a new region
Cypress.Commands.add('createRegion', (name: string, description: string) => {
  cy.visit('/regions');
  cy.contains('Yeni Region Əlavə Et').click();
  cy.get('input[name="name"]').clear().type(name);
  cy.get('textarea[name="description"]').clear().type(description);
  cy.contains('button', 'Yadda Saxla').click();
  cy.contains(name).should('be.visible');
});

// Create a new sector
Cypress.Commands.add('createSector', (name: string, regionId: string, description: string) => {
  cy.visit('/sectors');
  cy.contains('Yeni Sektor Əlavə Et').click();
  cy.get('input[name="name"]').clear().type(name);
  cy.get('select[name="region_id"]').select(regionId);
  cy.get('textarea[name="description"]').clear().type(description);
  cy.contains('button', 'Yadda Saxla').click();
  cy.contains(name).should('be.visible');
});

// Create a new school
Cypress.Commands.add('createSchool', (name: string, sectorId: string, address: string) => {
  cy.visit('/schools');
  cy.contains('Yeni Məktəb Əlavə Et').click();
  cy.get('input[name="name"]').clear().type(name);
  cy.get('select[name="sector_id"]').select(sectorId);
  cy.get('input[name="address"]').clear().type(address);
  cy.contains('button', 'Yadda Saxla').click();
  cy.contains(name).should('be.visible');
});

// Create a new category
Cypress.Commands.add('createCategory', (name: string, description: string) => {
  cy.visit('/categories');
  cy.contains('Yeni Kateqoriya Əlavə Et').click();
  cy.get('input[name="name"]').clear().type(name);
  cy.get('textarea[name="description"]').clear().type(description);
  cy.contains('button', 'Yadda Saxla').click();
  cy.contains(name).should('be.visible');
});

// Clear the database between tests
Cypress.Commands.add('resetDatabase', () => {
  // This would normally connect to a specific API endpoint to reset the test database
  // For now, we'll just use localStorage to simulate a reset
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

// Accessibility testing
Cypress.Commands.add('checkA11y', (context = null, options = {}) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

// -- This is a dual command --
// Cypress.Commands.add('testId', (testId: string) => {
//   return cy.get(`[data-testid=${testId}]`);
// });

// -- This is an overwrite --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
//   return originalFn(url, options);
// });

// TypeScript type definitions
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<Element>;
      loginAsSuperAdmin(): Chainable<Element>;
      loginAsRegionAdmin(): Chainable<Element>;
      loginAsSectorAdmin(): Chainable<Element>;
      loginAsSchoolAdmin(): Chainable<Element>;
      createRegion(name: string, description: string): Chainable<Element>;
      createSector(name: string, regionId: string, description: string): Chainable<Element>;
      createSchool(name: string, sectorId: string, address: string): Chainable<Element>;
      createCategory(name: string, description: string): Chainable<Element>;
      resetDatabase(): Chainable<Element>;
      checkA11y(context?: string, options?: object): Chainable<Element>;
      // testId(testId: string): Chainable<Element>;
    }
  }
}

export {};
