import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Auth = observer(({ show, onHide, isLogin, toggleAuthForm }) => {
    const { user } = useContext(Context);
    const location = useLocation();
    const history = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const click = async (e) => {
        e.preventDefault(); // Предотвращаем переход на новую страницу по клику
        e.stopPropagation(); // Останавливаем событие клика

        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password);
            }
            user.setUser(data.role);
            user.setIsUser(data.id);
            user.setIsAuth(true);
            window.location.reload();
        } catch (e) {
            console.log(e);
            alert(e.response.data.message);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header style={{backgroundColor: '#DBDFEA'}} closeButton>
                <Modal.Title >{isLogin ? 'Авторизация' : 'Регистрация'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        className="mt-2"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-2"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    />

                    <Form className="d-flex justify-content-between mt-3 pr-3">
                        {isLogin ? (
                            <div>
                                Нет аккаунта?{' '}
                                <NavLink to={REGISTRATION_ROUTE} onClick={(e) => { e.preventDefault(); toggleAuthForm(); }}>
                                    Зарегистрируйся!
                                </NavLink>
                            </div>
                        ) : (
                            <div>
                                Есть аккаунт?{' '}
                                <NavLink to={LOGIN_ROUTE}
                                         onClick={(e) => { e.preventDefault(); toggleAuthForm(); }}>
                                    Войти
                                </NavLink>
                            </div>
                        )}
                        <Button variant="outline-success" onClick={click}>
                            {isLogin ? 'Войти' : 'Регистрация'}
                        </Button>
                    </Form>
                </Form>
            </Modal.Body>
        </Modal>
    );
});

export default Auth;
