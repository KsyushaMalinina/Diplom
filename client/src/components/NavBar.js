import React, { useContext, useState } from 'react';
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    INVENTORY_CONTROL_ROUTE,
    LOGIN_ROUTE,
    ORDER_ROUTE,
    SHOP_ROUTE
} from "../utils/consts";
import { Button, Container, Modal } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import Auth from "../pages/Auth";

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const history = useNavigate();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Состояние для определения текущей формы (true - авторизация, false - регистрация)

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
    };

    const handleAuthModalClose = () => {
        setShowAuthModal(false);
    };

    const handleAuthModalOpen = () => {
        setShowAuthModal(true);
    };

    const toggleAuthForm = () => {
        setIsLogin(!isLogin);
    };

    const navbarStyle = {
        background: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(10px)",
    };

    return (
        <>
            <Navbar bg="dark" variant="gradient" style={{ backgroundImage: "linear-gradient(to right, #8294C4, #ACB1D6,#DBDFEA, #FFEAD2)" }}>
                <Container>
                    <NavLink style={{ color: 'white', textDecoration: 'none' }} to={SHOP_ROUTE}>SahharRoom</NavLink>
                    {user.isAuth ?
                        <Nav className="ms-auto" style={{ color: 'white' }}>
                            {user.isRole === 'MANAGER' && <Button
                                variant={"outline-light"}
                                onClick={() => history(ORDER_ROUTE)}
                            >
                                Заказы
                            </Button>}
                            {user.isRole === 'ADMIN' && <Button
                                variant={"outline-light"}
                                onClick={() => history(INVENTORY_CONTROL_ROUTE)}
                            >
                                Складской учет
                            </Button>}
                            {user.isRole === 'ADMIN' ? <Button
                                    variant={"outline-light"}
                                    onClick={() => history(ADMIN_ROUTE)}
                                    className="ms-3"
                                >
                                    Админ панель
                                </Button> :
                                <Nav.Link onClick={() => history(BASKET_ROUTE)}>
                                    <FaShoppingCart size={20} style={{ marginRight: 5 }} />
                                </Nav.Link>}
                            <Button
                                variant={"outline-light"}
                                onClick={() => logOut()}
                                className="ms-3"
                            >
                                Выйти
                            </Button>
                        </Nav>
                        :
                        <Nav  style={{ color: 'white', marginLeft: 'auto' }}>
                            <Button
                                variant={"outline-light"}
                                onClick={handleAuthModalOpen}
                                className="ms-3"
                            >
                                Авторизация
                            </Button>
                        </Nav>
                        }
                </Container>
            </Navbar>

            <Auth
                show={showAuthModal}
                onHide={handleAuthModalClose}
                isLogin={isLogin}
                toggleAuthForm={toggleAuthForm}
            />
        </>
    );
});

export default NavBar;
