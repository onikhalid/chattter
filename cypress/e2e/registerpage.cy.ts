describe('Login Flow for Users', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display inputs for email and password and a register button', () => {
    cy.get('[data-testid="email-input"]')
      .type('test@gmail.com')
      .should('have.value', 'test@gmail.com');
    
    cy.get('[data-testid="password-input"]')
      .type('Test@1234')
      .should('have.value', 'Test@1234');

    cy.get('[data-testid="register-button"]')
      .should('be.visible')
      .and('contain.text', 'Sign up');
  });
  it('should display inputs for email and password and a Google and Facebook register button', () => {
    cy.get('[data-testid="google-signup-button"]')
      .should('be.visible')
      .and('contain.text', 'Google');
   
      cy.get('[data-testid="facebook-signup-button"]')
      .should('be.visible')
      .and('contain.text', 'Facebook');
  });

 
});
