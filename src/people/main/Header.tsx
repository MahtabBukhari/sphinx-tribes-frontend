import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { EuiHeader, EuiHeaderSection } from '@elastic/eui';
import { Link, useHistory, useLocation } from 'react-router-dom';
import MaterialIcon from '@material/react-material-icon';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../store';
import { useIsMobile } from '../../hooks';
import { Modal, Button } from '../../components/common';
import SignIn from '../../components/auth/SignIn';
import api from '../../api';
import TorSaveQR from '../utils/TorSaveQR';
import IconButton from '../../components/common/IconButton2';
import { PostModal } from '../widgetViews/postBounty/PostModal';
import StartUpModal from '../utils/StartUpModal';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const Corner = styled.div`
  display: flex;
  align-items: center;
`;
const T = styled.div`
  display: flex;
  font-size: 26px;
  line-height: 19px;
`;

interface ImageProps {
  readonly src: string;
}
const Img = styled.div<ImageProps>`
  background-image: url('${(p: any) => p.src}');
  background-position: center;
  background-size: cover;
  height: 37px;
  width: 232px;

  position: relative;
`;

const Name = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  line-height: 19px;
  /* or 73% */

  /* Text 2 */

  color: #292c33;
`;
const Welcome = styled.div`
  font-size: 15px;
  line-height: 24px;
  margin: 20px 0 50px;
  text-align: center;

  /* Text 2 */

  color: #3c3f41;
`;

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 25px;
`;
const Imgg = styled.div<ImageProps>`
  background-image: url('${(p: any) => p.src}');
  background-position: center;
  background-size: cover;
  width: 90px;
  height: 90px;
  border-radius: 50%;
`;

const Tabs = styled.div`
  display: flex;
  margin-left: 20px;
  justify-content: space-around;
  height: 100%;
  gap: 50px;

  @media screen and (max-width: 990px) {
    gap: 25px;
  }
`;

const MTabs = styled.div`
  display: flex;
  margin: 0 20px;
  justify-content: space-around;
`;
interface TagProps {
  selected: boolean;
}
const Tab = styled(Link)<TagProps>`
  display: flex;
  padding: 0 8px;
  color: ${(p: any) => (p.selected ? '#fff' : '#6B7A8D')};
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  line-height: 19px;
  height: 100%;
  align-items: center;
  border-bottom: ${(p: any) => (p.selected ? '6px solid #618AFF' : '6px solid transparent')};
  text-decoration: none !important;

  &:hover {
    color: #909baa;
  }

  &:active {
    color: #fff;
    border-color: transparent;
  }
`;

const MTab = styled(Link)<TagProps>`
  display: flex;
  margin: 25px 5px 0;
  color: ${(p: any) => (p.selected ? '#fff' : '#6B7A8D')};
  cursor: pointer;
  height: 30px;
  min-width: 65px;
  font-weight: 500;
  font-size: 15px;
  line-height: 19px;
  justify-content: center;
  border-bottom: ${(p: any) => (p.selected ? '3px solid #618AFF' : 'none')};
  text-decoration: none !important;

  &:hover {
    color: '#6B7A8D';
  }
`;

const LoggedInBtn = styled.button`
  all: unset;
  max-width: 130px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.07);
  white-space: nowrap;
  padding: 0 24px 0 50px;
  display: flex;
  align-items: center;
  position: relative;

  ${Imgg} {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background: rgba(255, 255, 255, 0.13);
    ${Imgg} {
      height: 34px;
      width: 34px;
      left: 3px;
    }
  }
`;

const GetSphinxsBtn = styled.button`
  display: flex;
  flex: 1 0 auto;
  background: #618aff;
  padding: 0 28px;
  height: 40px;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  border-radius: 32px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #ffffff;
  font-family: 'Barlow';

  &:hover {
    background: #5881f8;
    text-decoration: none;
    color: inherit;
  }

  &:active {
    background: #5078f2;
    box-shadow: none;
  }
`;

const LoginBtn = styled.button`
  display: flex;
  flex-wrap: nowrap;
  width: 120px;
  align-items: center;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  cursor: pointer;
  margin-left: 18px;
  background: transparent;
  border: none;
  span {
    margin-right: 8px;
  }

  &:hover {
    color: #a3c1ff;
  }

  &:active {
    color: #82b4ff;
  }
`;

const Alias = styled.span`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function Header() {
  const { main, ui } = useStores();
  const location = useLocation();
  const history = useHistory();
  const isMobile = useIsMobile();
  const [isOpenPostModal, setIsOpenPostModal] = useState(false);
  const [isOpenStartUpModel, setIsOpenStartupModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isEnabled: isSkillsEnabled } = useFeatureFlag('skills');

  const tabs = [
    {
      label: 'People',
      name: 'people',
      path: '/p'
    },
    {
      label: 'Bounties',
      name: 'bounties',
      path: '/bounties'
    }
  ];

  const resolveTabsToBounties = ['b', 't'];

  const getUserWorkspaces = useCallback(async () => {
    const id = ui._meInfo?.id || 0;
    if (id != 0) {
      await main.getUserWorkspaces(id);
    }
  }, [main, ui.selectedPerson]);

  useEffect(() => {
    getUserWorkspaces();
  }, [getUserWorkspaces]);

  const workspaceLength = main.workspaces ? main.workspaces.length : 0;

  if (isAdmin) {
    tabs.unshift({
      label: 'Admin',
      name: 'admin',
      path: '/admin'
    });
  }

  if (isAdmin && workspaceLength > 0) {
    const space = main.workspaces[0];

    tabs.push({
      label: 'Hive',
      name: 'hive',
      path: `/workspace/${space.uuid}/activities`
    });
  }

  if (isSkillsEnabled) {
    tabs.push({
      label: 'Skills',
      name: 'skills',
      path: '/skills'
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const isAdminResponse = await main.getIsAdmin();
        setIsAdmin(isAdminResponse);
      } catch (e: any) {
        console.log('e', e);
      }
    })();
  }, [ui.meInfo, main]);

  const [showWelcome, setShowWelcome] = useState(false);

  async function testChallenge(chal: string) {
    try {
      const me: any = await api.get(`poll/${chal}`);
      if (me && me.pubkey) {
        ui.setMeInfo(me);
        ui.setShowSignIn(false);
        setShowWelcome(true);
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  const showSignIn = () => {
    setIsOpenStartupModal(true);
  };

  const clickHandler = () => {
    showSignIn();
  };

  useEffect(() => {
    const path = location.pathname;
    if (!path.includes('/p') && (ui.selectedPerson || ui.selectingPerson)) {
      ui.setSelectedPerson(0);
      ui.setSelectingPerson(0);
    }
  }, [location.pathname, ui]);

  useEffect(() => {
    (async () => {
      try {
        const urlObject = new URL(window.location.href);
        let path = location.pathname;
        const params = urlObject.searchParams;
        const chal = params.get('challenge');

        if (chal) {
          // fix url path if "/p" is not included, add challenge to proper url path
          if (!path.includes('/p')) {
            path = `/p?challenge=${chal}`;
            history.push(path);
          }
          await testChallenge(chal);
        } else {
          // update self on reload
          await main.getSelf(null);
        }
      } catch (e: any) {
        console.log('e', e);
      }
    })();
  }, []);

  function goToEditSelf() {
    if (ui.meInfo?.id && !location.pathname.includes(`/p/${ui.meInfo.uuid}`)) {
      history.push(`/p/${ui.meInfo.uuid}/workspaces`);
      ui.setSelectedPerson(ui.meInfo.id);
      ui.setSelectingPerson(ui.meInfo.id);
    }
  }

  const headerBackground = '#1A242E';

  function renderHeader() {
    if (isMobile) {
      return (
        <EuiHeader
          id="header"
          style={{
            color: '#fff',
            background: headerBackground,
            paddingBottom: 0
          }}
        >
          <div className="container">
            <Row style={{ justifyContent: 'space-between' }}>
              <EuiHeaderSection grow={false}>
                <Img
                  src="/static/people_logo.svg"
                  style={{ width: 190 }}
                  role="img"
                  aria-label="Sphinx Community"
                />
              </EuiHeaderSection>

              <Corner>
                {!ui.meInfo && (
                  <Button
                    text={'Get Sphinx'}
                    color="transparent"
                    onClick={(e: any) => {
                      e.preventDefault();
                      clickHandler();
                    }}
                    style={{ marginRight: 14, width: 98 }}
                  />
                )}

                {ui.meInfo ? (
                  <Imgg
                    style={{
                      height: 30,
                      width: 30,
                      marginRight: 10,
                      border: '1px solid #ffffff55'
                    }}
                    src={ui.meInfo?.img || '/static/person_placeholder.png'}
                    onClick={() => {
                      goToEditSelf();
                    }}
                    role="button"
                    tabIndex={0}
                  />
                ) : (
                  <Button
                    icon={'account_circle'}
                    style={{ minWidth: 38, width: 38, marginRight: 10, height: 37 }}
                    color="primary"
                    onClick={() => ui.setShowSignIn(true)}
                  />
                )}
              </Corner>
            </Row>

            <MTabs>
              {tabs &&
                tabs.map((t: any, i: number) => {
                  const { label } = t;
                  const locationPath = location.pathname.split('/')[1];
                  let selected = resolveTabsToBounties.includes(locationPath)
                    ? false
                    : locationPath === t.path.split('/')[1];

                  if (resolveTabsToBounties.includes(locationPath) && label === 'Bounties') {
                    selected = true;
                  }

                  return (
                    <MTab
                      key={i}
                      to={t.path}
                      selected={selected}
                      onClick={() => {
                        ui.searchText && ui.setSearchText('');
                        history.push(t.path);
                      }}
                    >
                      {label}
                    </MTab>
                  );
                })}
            </MTabs>
          </div>
          {isOpenStartUpModel && (
            <StartUpModal
              closeModal={() => setIsOpenStartupModal(false)}
              dataObject={'createWork'}
              buttonColor={'success'}
            />
          )}
        </EuiHeader>
      );
    }

    // desktop version
    return (
      <EuiHeader
        style={{
          color: '#fff',
          width: '100%',
          height: 64,
          padding: '0 20px',
          background: headerBackground,
          zIndex: 1001
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Row style={{ height: '100%', marginBottom: '-2px', flex: 2 }}>
            <EuiHeaderSection grow={false}>
              <Img src="/static/people_logo.svg" role="img" aria-label="Sphinx Community" />
            </EuiHeaderSection>

            <Tabs>
              {tabs &&
                tabs.map((t: any, i: number) => {
                  const { label } = t;
                  const locationPath = location.pathname.split('/')[1];
                  let selected = resolveTabsToBounties.includes(locationPath)
                    ? false
                    : locationPath === t.path.split('/')[1];

                  if (resolveTabsToBounties.includes(locationPath) && label === 'Bounties') {
                    selected = true;
                  }

                  return (
                    <Tab
                      key={i}
                      to={t.path}
                      selected={selected}
                      onClick={(e: any) => {
                        e.preventDefault();
                        ui.setSearchText('');
                        if (t.name === 'people') {
                          main.getPeople({ resetPage: true });
                        }
                        history.push(t.path);
                        localStorage.setItem('key', t.path);
                      }}
                    >
                      {label}
                    </Tab>
                  );
                })}
            </Tabs>
          </Row>

          <Corner>
            {!ui.meInfo && (
              <GetSphinxsBtn
                onClick={(e: any) => {
                  e.preventDefault();
                  clickHandler();
                }}
              >
                Get Sphinx
              </GetSphinxsBtn>
            )}

            <PostModal
              isOpen={isOpenPostModal}
              onClose={() => setIsOpenPostModal(false)}
              widget={'bounties'}
              onSucces={() => {
                history.goBack();
                window.location.reload();
              }}
              onGoBack={() => {
                history.goBack();
              }}
            />
            {isOpenStartUpModel && (
              <StartUpModal
                closeModal={() => setIsOpenStartupModal(false)}
                dataObject={'createWork'}
                buttonColor={'success'}
              />
            )}
            {ui.meInfo ? (
              <LoggedInBtn
                data-testid="loggedInUser"
                onClick={() => {
                  goToEditSelf();
                }}
              >
                <Imgg
                  data-testid="userImg"
                  src={ui.meInfo?.img || '/static/person_placeholder.png'}
                />
                <Alias data-testid="alias"> {ui.meInfo?.owner_alias}</Alias>
              </LoggedInBtn>
            ) : (
              <LoginBtn onClick={() => ui.setShowSignIn(true)}>
                <span>Sign in</span>
                <MaterialIcon
                  icon={'login'}
                  style={{ fontSize: 18 }}
                  role="img"
                  aria-hidden="true"
                />
              </LoginBtn>
            )}
          </Corner>
        </div>
      </EuiHeader>
    );
  }

  return (
    <>
      {renderHeader()}

      {/* you wanna login modal  */}
      <Modal
        visible={ui.showSignIn}
        close={() => ui.setShowSignIn(false)}
        overlayClick={() => ui.setShowSignIn(false)}
      >
        <SignIn
          onSuccess={() => {
            ui.setShowSignIn(false);
            setShowWelcome(true);
            goToEditSelf();
          }}
        />
      </Modal>

      {/* you logged in modal  */}
      <Modal visible={ui.meInfo && showWelcome ? true : false}>
        <div>
          <Column>
            <Imgg
              style={{ height: 128, width: 128, marginBottom: 40 }}
              src={ui.meInfo?.img || '/static/person_placeholder.png'}
            />
            <div
              style={{
                position: 'absolute',
                top: '110px',
                right: '85px'
              }}
            >
              <img height={'32px'} width={'32px'} src="/static/badges/verfied_mark.png" alt="" />
            </div>

            <T>
              <div style={{ lineHeight: '26px' }}>
                Welcome <Name>{ui.meInfo?.owner_alias}</Name>
              </div>
            </T>

            <Welcome>
              Your profile is now public. Connect with other people, join tribes and listen your
              favorite podcast!
            </Welcome>

            <IconButton
              text={'Continue'}
              endingIcon={'arrow_forward'}
              height={48}
              width={'100%'}
              color={'primary'}
              onClick={() => {
                // switch from welcome modal to edit modal
                setShowWelcome(false);
              }}
              hovercolor={'#5881F8'}
              activecolor={'#5078F2'}
              shadowcolor={'rgba(97, 138, 255, 0.5)'}
            />
          </Column>
        </div>
      </Modal>

      <Modal
        visible={ui?.torFormBodyQR}
        close={() => {
          ui.setTorFormBodyQR('');
        }}
      >
        <TorSaveQR
          url={ui?.torFormBodyQR}
          goBack={() => {
            ui.setTorFormBodyQR('');
          }}
        />
      </Modal>
    </>
  );
}

export default observer(Header);
