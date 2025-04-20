import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const login = "Login";
const register = "Register";

function LoginTabs(): JSX.Element {
  const [isLogin, setIsLogin] = useState<string>(login);
  const selectLoginType = (loginTypeSelect: string | null) => {
    if (loginTypeSelect !== null) {
      setIsLogin(loginTypeSelect);
    }
  };

  return (
    <Tabs activeKey={isLogin} onSelect={selectLoginType} fill>
      <Tab eventKey={login} title={login}>
        <LoginForm />
      </Tab>
      <Tab eventKey={register} title={register}>
        <RegisterForm />
      </Tab>
    </Tabs>
  );
}

export default LoginTabs;
