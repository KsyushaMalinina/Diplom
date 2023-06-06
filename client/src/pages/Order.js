import React, {useEffect, useRef} from 'react';
import { useContext, useState } from 'react';
import { Context } from '../';
import {fetchTypes, getOrder, getUserOrderList, updateAmount, updateUserOrder} from '../http/productAPI';
import {Button, Card, Col, Container, Dropdown, Row} from 'react-bootstrap'
import { observer } from 'mobx-react-lite';


const Order = observer(() => {
    const {product,user, a} = useContext(Context)
    const [orderVisible, setOrderVisible] = useState(false)
    const myRef = useRef(null)
    useEffect(() => {
        getOrder(user.isUser).then(data => product.setOrders(data))
        getUserOrderList(product._selectedOrder).then(data => product.setOrdersList(data))
    }, [product,product._selectedOrder, a])

    const UpdateStatus = async (id, status) => {
        await updateUserOrder(id, status);
        getOrder(user.isUser).then(data => product.setOrders(data));
        alert(`Статус обновлен`);
    }
    // ----- Считаем общую сумму, которую юзер набрал в корзину ------- //

    let prices = 0;
    {product._orders_lists.map(price =>
        prices += price.product.price
    )}
    return (
        <Container
            className="d-flex flex-sm-column justify-content-center align-items-center mt-3"
        >
            <h1 className="pt-5 pb-2 font-weight-bold " style={{ color: '#54576c' }}>Все заказы</h1>
            {product.order.map(device =>

                <Card className="d-flex w-100 pb-3  m-3">
                    <Row d-flex>
                        <Row className="row pb-1 m-3 ">

                            <Col className={"mt-3"}>ФИО</Col>
                            <Col className={"mt-3"}>Адрес</Col>
                            <Col className={"mt-3"}>Телефон</Col>
                            <Col className={"mt-3"}>Статус</Col>
                        </Row>
                        <Row className="row pb-1 m-3 ">
                            <Col style={{ color: '#54576c' }}><h3>{device.addressee}</h3></Col>
                            <Col style={{ color: '#54576c' }}><h3>{device.postcode}</h3></Col>
                            <Col style={{ color: '#54576c' }}><h3>{device.phone}</h3></Col>
                            <Col style={{ color: '#54576c' }}>
                                {{
                                    '0': <h3 > Закрыт</h3>,
                                    '1': <h3> В обработке</h3>,
                                    '2': <h3> Отправлен</h3>,
                                    '3': <h3> Завершен</h3>
                                }[device.status]}
                                <Button className="w-75 align-self-center ms " variant={"light"}  onClick={() => product.setSelectedOrder(device.id)}> Открыть </Button>
                                                               <Dropdown className="mt-2 mb-2" >
                                    <Dropdown.Toggle variant={"light"}>{device.status || "Выберите статус"}</Dropdown.Toggle>
                                                                   <Dropdown.Menu>
                                                                       {[0, 1, 2, 3].map(status => (
                                                                           <Dropdown.Item
                                                                               key={status}
                                                                               onClick={() => {
                                                                                   UpdateStatus(device.id, status);
                                                                               }}
                                                                           >
                                                                               {{
                                                                                   0: <h3> Закрыт</h3>,
                                                                                   1: <h3> В обработке</h3>,
                                                                                   2: <h3> Отправлен</h3>,
                                                                                   3: <h3> Завершен</h3>
                                                                               }[status]}
                                                                           </Dropdown.Item>
                                                                       ))}
                                                                   </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>

                    </Row>
                    {device.id === product.selectedOrder &&
                        product.selectedOrder &&
                        <Row className="  row pb-1 m-3">
                            <Col className={"mt-3"}>id товара</Col>
                            <Col className={"mt-3"}>Название</Col>
                            <Col className={"mt-3"}>Цена</Col>
                            <Col className={"mt-3"}>Размер</Col>
                        </Row>
                    }
                    {device.id === product.selectedOrder &&
                        product._orders_lists.map
                        (device =>

                            <Card className="  p-2 row m-3  ">
                                <Row className="row">
                                    <Col className={"mt-3"}>{device.product.id}</Col>
                                    <Col className={"mt-3"}>{device.product.name}</Col>
                                    <Col className={"mt-3"}>{device.product.price}</Col>
                                    <Col className={"mt-3"}>{device.sizeName}</Col>
                                </Row>
                            </Card>
                        )}
                    {device.id === product.selectedOrder &&
                        <Card className="d-flex flex-row  p-2 justify-content-between align-items-center mb-1 m-3">
                            <h1 className="align-self-end" >Всего:</h1>
                            <h3  className="ms-3 align-self-end">{prices}<span className="font-weight-light pl-2"> руб. </span></h3>
                        </Card>}
                </Card>
            )}

        </Container>
    );

});

export default Order;