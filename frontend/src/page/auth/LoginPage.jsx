import React from "react";
import { Form, Button, message, Input } from "antd";
import { request } from "../../util/helper";
import {
  setAcccessToken,
  setPermission,
  setProfile,
} from "../../store/profile.store";
import { useNavigate } from "react-router-dom";
import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import "./LoginPage.css";

function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onLogin = async (item) => {
    var param = {
      username: item.username, 
      password: item.password,
    };
    const res = await request("auth/login", "post", param);
    if (res && !res.error) {
      setAcccessToken(res.access_token);
      setProfile(JSON.stringify(res.profile));
      setPermission(JSON.stringify(res.permision));
      message.success("Login Success!");
      navigate("/");
    } else {
      message.error(res.message || "Login failed. Please check your credentials.");
    }
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome</h2>
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username" }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.7)' }} />} 
              placeholder="Username Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.7)' }} />} 
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <div className="login-options">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a className="forgot-link" href="#">Forgot password?</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" size="large">
              <LoginOutlined/>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
