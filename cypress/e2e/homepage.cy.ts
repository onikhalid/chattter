describe('Homepage for Unauthenticated User', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should display a hero text and auth buttons for unauthenticated user', () => {
      cy.get('[data-testid="hero-text"]').should('be.visible');
  
      cy.get('[data-testid="signup-button"]')
        .should('be.visible')
        .and('contain.text', 'Get Started');
  
      cy.get('[data-testid="login-button-link"]')
        .should('be.visible')
        .and('contain.text', 'Login');
    });
  
    it('should navigate to sign up page when sign up button is clicked', () => {
      cy.get('[data-testid="signup-button"]').click();
      cy.wait(1500);
      cy.url().should('include', '/register');
    });
  
    it('should navigate to login page when login button is clicked', () => {
      cy.get('[data-testid="login-button-link"]').click();
      cy.url().should('include', '/login');
    });
  });