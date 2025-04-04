import React, { useState } from 'react';
import ConnectCard from 'people/utils/ConnectCard';
import { useBrowserTabTitle } from 'hooks';
import { TicketModalPage } from './TicketModalPage';
import Tickets from './Tickets';

export const TicketsPage = () => {
  const [connectPerson, setConnectPerson] = useState<any>(null);
  useBrowserTabTitle('Bounties');
  return (
    <>
      <Tickets />
      <TicketModalPage setConnectPerson={setConnectPerson} />
      {connectPerson && (
        <ConnectCard
          dismiss={() => setConnectPerson(null)}
          modalStyle={{
            top: '-64px',
            height: 'calc(100% + 64px)'
          }}
          person={connectPerson}
          visible={true}
        />
      )}
    </>
  );
};
