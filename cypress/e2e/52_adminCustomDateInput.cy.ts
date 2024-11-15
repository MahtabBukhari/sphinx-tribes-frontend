describe('Admin Custom Date Input', () => {
  const activeUser = 'alice';

  const bounty: Cypress.Bounty = {
    title: 'Admin',
    workspace: 'workspace6',
    category: 'Web development',
    description: 'This is available',
    amount: '123',
    assign: 'carol',
    deliverables: 'We are good to go man'
  };

  const today = new Date();
  const startDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today
    .getDate()
    .toString()
    .padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;

  const endDate = new Date(today.getTime());
  endDate.setDate(today.getDate() + 1);

  const endDateFormatted = `${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate
    .getDate()
    .toString()
    .padStart(2, '0')}/${endDate.getFullYear()}`;

  beforeEach(() => {
    cy.login(activeUser);
    cy.wait(1000);
  });

  it('should create 22 bounties, navigate to admin page, and assert custom date input functionality', () => {
    for (let i = 1; i <= 22; i++) {
      const updatedBounty = { ...bounty, title: `Admin${i}` };
      cy.create_bounty(updatedBounty);
      cy.wait(1000);
    }

    cy.visit('http://localhost:3007/admin');
    cy.wait(3000);

    cy.contains('22');
    cy.contains('Bounties');

    cy.contains('Last 7 Days').click();
    cy.contains('Custom').click();

    cy.get('input[placeholder="MM/DD/YY"]').eq(0).clear().type(startDate);

    cy.get('input[placeholder="MM/DD/YY"]').eq(1).clear().type(endDateFormatted);

    cy.contains('Save').click();
    cy.wait(2000);

    cy.contains('22');
    cy.contains('Bounties');

    const [startMonth, startDay, startYear] = startDate.split('/').map(Number);
    const [endMonth, endDay, endYear] = endDateFormatted.split('/').map(Number);

    const date = new Date(startYear, startMonth - 1, startDay);
    const date2 = new Date(endYear, endMonth - 1, endDay);

    const formattedDate = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    const formattedDate2 = date2.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const finalDate = formatSeptemberMonth(formattedDate);
    const finalDate2 = formatSeptemberMonth(formattedDate2);

    cy.get('[data-testid="month"]').contains(`${finalDate} - ${finalDate2}`);

    for (let i = 1; i <= 22; i++) {
      cy.contains(`Admin${i}`);
    }

    cy.logout(activeUser);
  });
});

const formatSeptemberMonth = (date: string): string => {
  let newDate = '';
  if (date.includes('Sept')) {
    newDate = date.replace('Sept', 'Sep');
  }

  return newDate;
};
