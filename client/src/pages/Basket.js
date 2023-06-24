import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { Context } from '../';
import {addToBasket, deleteFromBasket, getBasket, getUserOrder, getUserOrderList} from '../http/productAPI';
import {Button, Card, Col, Container, Row} from 'react-bootstrap'
import { observer } from 'mobx-react-lite';
import CreateOrder from "../components/modals/CreateOrder";
import Image from "react-bootstrap/Image";
import {SHOP_ROUTE} from "../utils/consts";
import {Link} from "react-router-dom";
import {FaShoppingCart, FaTrash} from "react-icons/fa";

const Basket = observer(() => {
    const {product,  user, a} = useContext(Context)
    const [orderVisible, setOrderVisible] = useState(false)

    useEffect(() => {
        getBasket().then(data => {
            product.setBaskets(data);

        });
        getUserOrder(user.isUser).then(data => product.setOrders(data))
        getUserOrderList(product._selectedOrder).then(data => product.setOrdersList(data))
    }, [product,product._selectedOrder, a])

    const refreshPage = ()=>{
        window.location.reload();
    }
    const _delete = (id) => {
        deleteFromBasket(id).then(response => alert(`Товар удален из корзины`)).then(response => refreshPage())

    }


    let prices = 0;
    {product.basket.map(price =>
        prices += price.product.price
    )}
    let prices2 = 0;
    {product._orders_lists.map(price =>
        prices2 += price.product.price
    )}
    return (
        <Container
            className="d-flex flex-sm-column justify-content-center align-items-center mt-3"
        >
            {product.basket.length === 0 ? (
                <div>
                    <h1 className="pb-2" style={{ color: '#54576c' }}>Корзина</h1>
                    <p>Ваша корзина пуста. Перейдите к покупкам.</p>
                    <Link to={SHOP_ROUTE}>Перейти к покупкам</Link>
                </div>
            ) : (
            <Row>

            <h1 className="pb-2" style={{ color: '#54576c', textAlign: 'center' }}>Корзина</h1>
                    <Col md={8}>
            {/* ------- Считаем общую сумму ------- */}


            {product.basket.map(device =>
                <Card className="d-flex w-100 p-2 justify-content-center mb-2"  key={device.id}>

                    <Row>
                        <Col md="2" className="d-inline-flex flex-row">
                            <div className="flex-row" >
                                <img src={process.env.REACT_APP_API_URL + device.product.img} alt="img not found" height={100}  />
                            </div>
                        </Col>
                        <Col  className="d-flex flex-row">
                            <div className="flex-row">
                                <h1 className="ms-3" style={{ fontSize: '24px' }}>{device.product.name}</h1>
                            </div>
                        </Col>
                        <Col  className="d-flex flex-row justify-content-end">
                            <div className="flex-row">
                                <h2 className="font-weight-light" style={{ fontSize: '24px' }}>{device.product.price} руб. </h2>
                            </div>
                        </Col>
                        <Col>
                        {device.sizeName && (
                            <div className="flex-row">
                                <h2 className="font-weight-light" style={{ fontSize: '24px' }}>{device.sizeName} </h2>
                            </div>
                        )}
                        </Col>
                        <Col  className="d-flex flex-row justify-content-end">
                            <div className="flex-row">
                                <Button variant={"light"} onClick={() => _delete(device.id)}> <FaTrash size={20} style={{ marginRight: 5 }} /> </Button>
                            </div>
                        </Col>

                    </Row>
                </Card>
            )}
                </Col>
                    <Col md={4}>
                    <Card className="d-flex flex-row  p-2 justify-content-between align-items-center mb-2">
                        <h1 className="mb-0" style={{ fontSize: '24px' }} >Всего:</h1>
                        <h3  className="ms-3 mb-0" >{prices}<span className="font-weight-light pl-2"> руб. </span></h3>
                    </Card>
            <Row>
                <Button variant={"light"}
                        className=" p-2"
                        style={{ backgroundColor: '#8294C4' }} onClick={() => setOrderVisible(true)} >Оформить заказ</Button>
            </Row>
                    </Col>
            </Row>
                )}
            <h1 className="pt-5 pb-2" style={{ color: '#54576c' }}>Оформленные заказы</h1>


            {product.order.map(device =>


                <Card className="d-flex w-100 pb-3  m-3">
                    <Row className=" d-flex m-3">
                        <Row className=" w-100 row pb-1">

                            <Col className={"mt-3"}>ФИО</Col>
                            <Col className={"mt-3"}>Адрес</Col>
                            <Col className={"mt-3"}>Статус</Col>
                        </Row>
                        <Row>
                            <Col><h3>{device.addressee}</h3></Col>
                            <Col><h3>{device.postcode}</h3></Col>
                            <Col >
                                {{
                                    '0': <h3> Закрыт</h3>,
                                    '1': <h3> В обработке</h3>,
                                    '2': <h3> Отправлен</h3>,
                                    '3': <h3> Завершен</h3>
                                }[device.status]}
                                <Button className="w-75 align-self-center ms" variant={"light"} onClick={() => product.setSelectedOrder(device.id)}> Открыть </Button>
                            </Col>
                        </Row>

                    </Row>
                    {device.id == product.selectedOrder &&
                        <Row className=" d-flex mb-2 p-4 w-100  m-3">
                            <Col className={"mt-3"}>Наименование товара</Col>
                            <Col className={"mt-3"}>Цена</Col>
                            <Col className={"mt-3"}>Фото</Col>
                            <Col className={"mt-3"}>Размер</Col>
                        </Row>}
                    {device.id == product.selectedOrder &&
                        product._orders_lists.map
                        (device =>
                            <Card className=" d-flex mb-2 p-4 m-3  ">
                                <Row className="row">

                                    <Col className={"mt-3"}>{device.product.name}</Col>
                                    <Col className={"mt-3"}>{device.product.price}</Col>
                                    <Col className={"mt-3"}><Image width={75} height={75} src={process.env.REACT_APP_API_URL + device.product.img}/></Col>
                                    <Col className={"mt-3"}>{device.sizeName}</Col>
                                </Row>
                            </Card>
                        )}
                    {device.id == product.selectedOrder &&
                        <Card className="d-flex flex-row  p-2 m-3 justify-content-between align-items-center mb-2">
                            <h1 className="align-self-end" style={{ fontSize: '24px' }} >Всего:</h1>
                            <h3  className="ms-3 align-self-end" style={{ fontSize: '24px' }}>{prices2}<span className="font-weight-light pl-2"> руб. </span></h3>
                        </Card>}

                </Card>
            )}




            <CreateOrder show={orderVisible} onHide={() => setOrderVisible(false)}/>
        </Container>
    );

});

export default Basket;
