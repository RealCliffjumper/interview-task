describe('template spec', () => {
  beforeEach(() =>{
    cy.visit('http://localhost:4200/')
  })

  it('it should load users', () => {
    

    cy.intercept('GET', '/users').as('getUsers')

    cy.wait('@getUsers').its('response.statusCode').should('eq',200);
  })

  it('it should filter users by keywords', ()=> {
    cy.get('.keyword-input').type('810')
    cy.get('.ant-spin-container').contains('810')

    cy.get('.keyword-input').clear()


    cy.get('.keyword-input').type('di')
    
    const re = /^di/i;
    cy.get('.ant-table-tbody tr').each($row => {
    cy.wrap($row)
      .invoke('text')
      .then(text => {
        expect(text.trim()).to.match(re);
      });
    });

    cy.get('.keyword-input').clear()

    cy.get('.keyword-input').type('dave')
    cy.get('.nz-disable-td')
  })
})