
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.contains('h1', 'İnfoLine').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Email tələb olunur').should('be.visible');
    cy.contains('Şifrə tələb olunur').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Email və ya şifrə yanlışdır').should('be.visible');
  });

  it('should redirect to dashboard after successful login', () => {
    // This test assumes that the login endpoint is mocked in Cypress
    cy.intercept('POST', '**/auth/v1/token*', {
      statusCode: 200,
      body: {
        access_token: 'fake-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: {
          id: 'test-user-id',
          email: 'test@infoline.az',
          role: 'super_admin'
        }
      }
    }).as('loginRequest');
    
    cy.get('input[name="email"]').type('test@infoline.az');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginRequest');
    cy.url().should('include', '/');
    cy.contains('İdarəetmə Paneli').should('be.visible');
  });

  it('should have a link to reset password', () => {
    cy.contains('Şifrəni unutmusunuz?').should('be.visible').click();
    cy.url().should('include', '/reset-password');
  });

  it('passes accessibility tests', () => {
    cy.injectAxe();
    cy.checkA11y();
  });
});
