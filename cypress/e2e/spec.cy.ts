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
    
  const allYears: number[] = [];
  const decades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let count = [0]

  it('it should display user dates of birth to decades count', ()=>{
    
    cy.get('.count-label')

    collectYearsFromPage();
    cy.then(()=>{
      for(let i=0; i<decades.length; i++){
          const usersForEachDecade = allYears.filter(year => {
          const n1 = year%1000
          
          const n2 = Math.floor(n1%100/10)
          return n2 === decades[i]
        }
      )
      count = [...count, usersForEachDecade.length]
    }
    const expectedCounts = count.filter(c => c !== 0);
     cy.get('.counter')
     .then($labels => {
        const actualCounts = [...$labels]
          .map(el => Number(el.innerText.trim()))
          .filter(n => n !== 0);

        expect(actualCounts.sort()).to.deep.equal(expectedCounts.sort());
    });
  })

  function collectYearsFromPage() {
    cy.get('[data-cy="birth-date"]') .then(
      $cells => {
       const years = [...$cells].map(cell => cell.innerText.trim().slice(0, 4) );
        allYears.push(...years);
        console.log(allYears) 
      })
      .then(() => {
        cy.get('.ant-pagination-next > .ant-pagination-item-link').then($btn => {
          const isDisabled =
            $btn.prop('disabled') || $btn.hasClass('ant-pagination-disabled');

          if (!isDisabled) {
            cy.wrap($btn).click();
            
            collectYearsFromPage();
          }
        });
      });
  }
})
})