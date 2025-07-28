describe('Home Page', () => {
  it('Visit home page and should click the Login button and navigate to login page', () => {
    cy.visit('/');
    cy.contains('Login').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('nav').should('exist');
    cy.get('nav').should('contain', 'My navbar logged out');
  });
});
