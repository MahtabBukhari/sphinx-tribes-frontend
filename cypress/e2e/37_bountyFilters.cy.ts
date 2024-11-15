describe('Alice tries to create 6 bounties and then assert filtered bounties', () => {
  it('Create 6 bounties and assert filtered bounties', () => {
    let activeUser = 'bob';
    cy.login(activeUser);
    cy.wait(2000);

    const assignees = ['carol', 'carol', 'carol', 'carol', '', ''];
    const languages = ['Typescript', 'Lightning', 'PHP', 'Typescript', 'PHP', 'Typescript'];

    cy.intercept({
      method: 'GET',
      url: 'http://localhost:13000/gobounties/all*'
    }).as('bountyFilter');

    for (let i = 0; i < 6; i++) {
      cy.create_bounty({
        title: `Filter Bounty Title ${i}`,
        workspace: 'workspace6',
        category: 'Web development',
        coding_language: [languages[i]],
        description: 'Lorem Ipsum Dolor',
        amount: '10000',
        assign: assignees[i],
        deliverables: 'We are good to go man',
        tribe: '',
        estimate_session_length: 'Less than 3 hour',
        estimate_completion_date: '09/09/2024'
      });
      cy.wait(1000);

      if (i > 2) {
        if (i === 3) {
          // Unchecked the Open Filter and Checked the Assigned Filter
          cy.contains('Filter').click();
          cy.contains('label', 'Open').click();
          cy.contains('label', 'Assigned').click();
          cy.wait(1000);

          cy.contains(`Filter Bounty Title ${i}`).click();
          cy.wait(1000);

          cy.contains('Mark as Paid').click();
          cy.wait(1000);

          cy.contains('Next').click();
          cy.wait(1000);

          cy.contains('Skip and Mark Paid').click();
          cy.wait(1000);

          cy.get('body').click(0, 0);
        }
      }
    }

    cy.logout(activeUser);
    cy.wait(1000);

    // check open filter
    cy.contains('Filter').click();
    cy.contains('label', 'Assigned').click();
    cy.contains('label', 'Open').click();
    cy.wait(1000);
    // close filter
    cy.get('body').click(0, 0);

    cy.wait('@bountyFilter');

    // assigned bounties should not exists
    cy.contains(`Filter Bounty Title 0`).should('not.exist');
    cy.contains(`Filter Bounty Title 1`).should('not.exist');

    cy.wait(1000);

    cy.contains('Filter').click();
    cy.contains('label', 'Typescript').click();
    cy.contains('Filter').click();

    // close filter
    cy.get('body').click(0, 0);
    cy.wait('@bountyFilter');

    cy.contains(`Filter Bounty Title 5`).should('exist');
    cy.wait(1000);

    cy.contains('Filter').click();
    // uncheck
    cy.contains('label', 'Open').click();
    cy.contains('label', 'Typescript').click();
    cy.wait(1000);

    // check
    cy.contains('label', 'Assigned').click();
    cy.contains('label', 'Lightning').click();
    cy.wait('@bountyFilter');

    cy.contains(`Filter Bounty Title 1`).should('exist');
  });
});
