// tests/e2e/login.spec.ts
describe('Login Page', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/login');
  });

  it('should display login form', () => {
    // Check if form elements exist
    cy.contains('InfoLine').should('be.visible');
    cy.contains('Məlumat İdarəetmə Sistemi').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.contains('button', 'Giriş').should('be.visible');
    cy.contains('Şifrəni unutmusunuz?').should('be.visible');
    cy.contains('Demo giriş məlumatları:').should('be.visible');
  });

  it('should show validation errors', () => {
    // Submit empty form
    cy.contains('button', 'Giriş').click();
    cy.contains('Email düzgün formatda deyil').should('be.visible');
    cy.contains('Şifrə minimum 8 simvol olmalıdır').should('be.visible');
    
    // Type invalid email
    cy.get('input[name="email"]').type('invalid-email');
    cy.contains('button', 'Giriş').click();
    cy.contains('Email düzgün formatda deyil').should('be.visible');
    
    // Type valid email but short password
    cy.get('input[name="email"]').clear().type('valid@example.com');
    cy.get('input[name="password"]').type('123');
    cy.contains('button', 'Giriş').click();
    cy.contains('Şifrə minimum 8 simvol olmalıdır').should('be.visible');
  });

  it('should fill credentials from demo buttons', () => {
    // Click on super admin demo button
    cy.contains('Super Admin:').click();
    cy.get('input[name="email"]').should('have.value', 'superadmin@edu.az');
    cy.get('input[name="password"]').should('have.value', 'Admin123!');
    
    // Click on another role button
    cy.contains('Region Admin:').click();
    cy.get('input[name="email"]').should('have.value', 'region@infoline.az');
    cy.get('input[name="password"]').should('have.value', 'infoline123');
  });

  // This test requires mocking authentication API
  it('should login successfully with correct credentials', () => {
    // Setup API intercept for successful login
    cy.intercept('POST', '**/auth/sign-in-with-password', {
      statusCode: 200,
      body: {
        data: {
          session: {
            access_token: 'mock-token'
          }
        },
        error: null
      }
    }).as('loginRequest');
    
    // Setup user data intercept
    cy.intercept('GET', '**/users*', {
      statusCode: 200,
      body: {
        data: {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          email: 'superadmin@edu.az',
          first_name: 'Super',
          last_name: 'Admin',
          role_id: '11111111-1111-1111-1111-111111111111',
          roles: {
            name: 'SuperAdmin',
            permissions: ['read:all', 'write:all']
          }
        },
        error: null
      }
    }).as('getUserRequest');
    
    // Fill and submit login form
    cy.get('input[name="email"]').type('superadmin@edu.az');
    cy.get('input[name="password"]').type('Admin123!');
    cy.contains('button', 'Giriş').click();
    
    // Wait for API requests to complete
    cy.wait('@loginRequest');
    cy.wait('@getUserRequest');
    
    // Should be redirected to dashboard
    cy.url().should('include', '/');
  });

  it('should show error message on login failure', () => {
    // Setup API intercept for failed login
    cy.intercept('POST', '**/auth/sign-in-with-password', {
      statusCode: 400,
      body: {
        data: null,
        error: {
          message: 'Invalid login credentials'
        }
      }
    }).as('loginRequest');
    
    // Fill and submit login form
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.contains('button', 'Giriş').click();
    
    // Wait for API request to complete
    cy.wait('@loginRequest');
    
    // Should show error message
    cy.contains('Daxil etdiyiniz məlumatlar yanlışdır').should('be.visible');
    cy.url().should('include', '/login'); // Still on login page
  });

  it('should navigate to password reset page', () => {
    cy.contains('Şifrəni unutmusunuz?').click();
    cy.url().should('include', '/password-reset');
  });
});