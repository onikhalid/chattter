describe('Logout Flow for Users', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
   
    it('should navigate to the homepage when login button is clicked', () => {
  
      cy.get('[data-testid="email-input"]').type('test@gmail.com');
      cy.get('[data-testid="password-input"]').type('Test@1234');
      cy.wait(1000);
      cy.get('[data-testid="login-button"]').click();
  
      cy.wait(100000);
  
      cy.url().should('include', '/');
    });

    it('should open menu and navigate to back to login when logout button is clicked', () => {
  
      cy.get('[data-testid="email-input"]').type('test@gmail.com');
      cy.get('[data-testid="password-input"]').type('Test@1234');
      cy.get('[data-testid="login-button"]').click();
  
      cy.wait(10000);

      cy.get('[data-testid="menu-button-desktop"]').click();
      cy.get('[data-testid="logout-button"]').click();
  
      cy.wait(10000);
  
      cy.url().should('include', '/login');
    });
  });
  