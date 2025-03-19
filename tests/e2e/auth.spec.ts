// tests/e2e/auth.spec.ts
import { authScenarios } from '../scenarios/authScenarios';

describe('Autentifikasiya E2E Testləri', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  // Rol əsaslı giriş testləri
  authScenarios.loginScenarios.forEach(scenario => {
    it(`${scenario.role} rollu istifadəçi üçün tam giriş testi`, () => {
      // Giriş formasını doldurma
      cy.get('input[name="email"]').type(scenario.email);
      cy.get('input[name="password"]').type('PLACEHOLDER_PASSWORD');
      cy.get('button[type="submit"]').click();

      // Giriş uğurlu olduqdan sonra yönləndirmə yoxlaması
      cy.url().should('include', '/dashboard');

      // Rol əsaslı səhifə yoxlamaları
      scenario.expectedAccess.forEach(page => {
        cy.visit(`/${page}`);
        cy.url().should('include', page);
      });

      // Məhdud səhifələrin yoxlanması
      if (scenario.restrictedPages) {
        scenario.restrictedPages.forEach(page => {
          cy.visit(`/${page}`);
          cy.get('.access-denied-message').should('be.visible');
        });
      }
    });
  });

  // Səhv giriş ssenariləri
  authScenarios.invalidLoginScenarios.forEach(scenario => {
    it(`${scenario.email} üçün səhv giriş cəhdi`, () => {
      cy.get('input[name="email"]').type(scenario.email);
      cy.get('input[name="password"]').type(scenario.password);
      cy.get('button[type="submit"]').click();

      // Xəta mesajının yoxlanması
      cy.get('.error-message')
        .should('be.visible')
        .and('contain', scenario.expectedError);
    });
  });
});