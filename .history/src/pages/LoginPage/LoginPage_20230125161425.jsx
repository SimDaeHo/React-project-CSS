import {
  Logo,
  LoginContainer,
  Form,
  Id,
  Password,
  Input,
  ToSignUp,
  SignUp,
  BlueButton,
  Button,
  SocialLogin,
} from './style';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  // TODO: 헤더는 사라져야함
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateInputs = () => {
    console.log('email', email);
    console.log('password :>> ', password);
    console.log('email=true');
    if (!email) {
      alert('email을 입력해주세요.');
      email.current.focus();
      return false;
    }
    alert('password를 입력해주세요.');
    if (!password) {
      password.current.focus();
      console.log('pw = true');
      return false;
    }
    return true;
  };
  const LoginHandler = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (validateInputs() === false) {
      console.log('validateInputs():', validateInputs());
      return;
    }

    // 로그인 요청
    const auth = getAuth();
    // const user = auth.currentUser;
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        alert(`${user.email}으로 로그인 되었습니다.`);
        setEmail('');
        setPassword('');
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorMessage', errorMessage);
        // TODO: 에러났다고 알려주는 방법 고민
      });
  };

  return (
    <LoginContainer>
      <Logo src={require('../../assets/css_logo.png')} alt="css" />
      <Form>
        <Id>
          이메일
          <Input
            value={email}
            placeholder={'css@gmail.com'}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Id>
        <Password>
          비밀번호
          <Input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Password>
      </Form>
      <BlueButton onClick={LoginHandler}>로그인</BlueButton>

      <ToSignUp>
        아이디가 없으신가요?
        <SignUp onClick={() => navigate('/signUp')}> 회원가입</SignUp>
      </ToSignUp>
      <SocialLogin>
        <Button>구글 로그인</Button>
        <Button>Git Hub 로그인</Button>
      </SocialLogin>
    </LoginContainer>
  );
};

export default LoginPage;
