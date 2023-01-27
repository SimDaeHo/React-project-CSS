import MyBookmark from '../../components/MyPage/MyBookmark/MyBookmark';
import MyComments from '../../components/MyPage/MyComments/MyComments';
import EditModal from '../../components/MyPage/EditModal/EditModal';
import { Fragment, useEffect } from 'react';
import { db, authService } from '../../common/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';

import {
  MyPageContainer,
  MyInfoContainer,
  MyPageTagTitle,
  MyInfoInput,
  MyInfoEditButton,
  NickNameContainer,
  GithubContainer,
  MyPageTabsContainer,
  InputCheckContainer,
  TabItem,
  TabsPanel,
  TabContents,
  TabsList,
} from './style.js';

const MyPage = () => {
  const [github, setGithub] = useState('');

  // True: 닉네임 수정, False: Github 수정
  const [contentInfo, setContentInfo] = useState('');

  // 모달창 노출 여부 state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  // 현재 유저
  // const currentUser = authService.currentUser;
  // 유저 닉네임
  // const userNickname = currentUser.displayName;

  // 닉네임 수정
  const [userName, setUserName] = useState('');

  // 닉네임 수정 모달 창 열림
  const openUserNameModal = () => {
    setModalOpen(true);
    setContentInfo(true);
    document.body.style.overflow = 'hidden';
  };

  // 깃허브 수정 모달 창 열림
  const openGithubModal = () => {
    setModalOpen(true);
    setContentInfo(false);
    document.body.style.overflow = 'hidden';
  };

  // 닉네임 입력
  const updateNickname = (item) => {
    setUserName(item);
  };

  // 깃허브 링크 입력
  const updateGithub = (item) => {
    console.log('item', item);
    setGithub(item);
  };

  // 유저 정보 가져오기
  const getUserInfo = async () => {
    // console.log('currentUser***', currentUser);
    const docRef = doc(db, 'users', currentUser);
    const docSnap = await getDoc(docRef);
    console.log('docSnap', docSnap);
    if (docSnap.exists()) {
      setGithub(docSnap.data().github);
    }
    // console.log(docSnap.data().github);
    // setUserName(userName);
  };

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setCurrentUser(authService.currentUser.uid);
        setUserName(authService.currentUser.displayName);
        console.log('Mypage', authService.currentUser);
        getUserInfo();
        console.log('로그인 되어있음');
      } else if (!user) {
        console.log('로그인 안됨');
      }
    });
    if (!currentUser) return;
    // if (!currentUser.displayName) return;
  }, []);

  return (
    <Fragment>
      <MyPageContainer>
        {/* 닉네임, 깃허브 링크 수정 */}
        <MyInfoContainer>
          <NickNameContainer>
            <MyPageTagTitle>닉네임</MyPageTagTitle>
            <InputCheckContainer>
              <MyInfoInput>{userName}</MyInfoInput>
              <MyInfoEditButton onClick={openUserNameModal}>
                수정
              </MyInfoEditButton>
              {modalOpen && (
                <EditModal
                  setModalOpen={setModalOpen}
                  setContentInfo={contentInfo}
                  setUserName={userName}
                  setGithub={github}
                  updateNickname={updateNickname}
                  updateGithub={updateGithub}
                  currentUser={currentUser}
                />
              )}
            </InputCheckContainer>
          </NickNameContainer>
          <GithubContainer>
            <MyPageTagTitle>GitHub</MyPageTagTitle>
            <InputCheckContainer>
              <MyInfoInput>{github}</MyInfoInput>
              <MyInfoEditButton onClick={openGithubModal}>
                수정
              </MyInfoEditButton>
              {modalOpen && (
                <EditModal
                  setModalOpen={setModalOpen}
                  setContentInfo={contentInfo}
                  setUserName={userName}
                  setGithub={github}
                  updateNickname={updateNickname}
                  updateGithub={updateGithub}
                  currentUser={currentUser}
                />
              )}
            </InputCheckContainer>
          </GithubContainer>
        </MyInfoContainer>
        {/* 북마크, 내가 쓴 댓글 보기 */}
        <MyPageTabsContainer
          selectedTabClassName="is-selected"
          selectedTabPanelClassName="is-selected"
        >
          <TabsList>
            <TabItem>북마크</TabItem>
            <TabItem>내가 쓴 댓글</TabItem>
          </TabsList>
          <TabContents>
            <TabsPanel active-content id="BookMarkContent">
              <MyBookmark />
            </TabsPanel>
            <TabsPanel id="CommentContent">
              <MyComments />
            </TabsPanel>
          </TabContents>
        </MyPageTabsContainer>
      </MyPageContainer>
    </Fragment>
  );
};

export default MyPage;
