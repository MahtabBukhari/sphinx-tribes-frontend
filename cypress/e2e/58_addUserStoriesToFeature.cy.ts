describe('Add user stories to features', () => {
  it('Add user stories to features', () => {
    cy.login('carol');
    cy.wait(1000);

    const WorkSpaceName = 'user story';

    const workspace = {
      loggedInAs: 'carol',
      name: WorkSpaceName,
      description: 'We are testing out our workspace feature',
      website: 'https://community.sphinx.chat',
      github: 'https://github.com/stakwork/sphinx-tribes-frontend'
    };

    cy.create_workspace(workspace);
    cy.wait(1000);

    cy.contains(workspace.name).contains('Manage').click();
    cy.wait(1000);

    cy.get('[data-testid="mission-link"]')
      .invoke('show')
      .then(($link: JQuery<HTMLElement>) => {
        const modifiedHref = $link.attr('href');
        cy.wrap($link).invoke('removeAttr', 'target');
        cy.wrap($link).click();
        cy.url().should('include', modifiedHref);
      });
    cy.wait(1000);

    cy.contains('No mission yet');
    cy.contains('No tactics yet');

    cy.get('[data-testid="new-feature-btn"]').click();
    cy.wait(1000);

    cy.contains('Add New Feature');

    const newFeature = 'A new Feature';
    cy.get('[data-testid="feature-input"]').type(newFeature);
    cy.get('[data-testid="add-feature-btn"]').click();
    cy.wait(1000);

    cy.contains(newFeature).should('exist', { timeout: 3000 });
    cy.wait(1000);

    const userStory = 'this is the story of a user';
    cy.get('[data-testid="story-input"]').type(userStory);
    cy.get('[data-testid="story-input-update-btn"]').click();
    cy.wait(1000);

    cy.contains(userStory).should('exist', { timeout: 1000 });
    cy.wait(5000);
    cy.logout('carol');
  });
});
