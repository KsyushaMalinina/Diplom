import React, {useContext, useEffect} from 'react';
import {Card, Col} from "react-bootstrap";
import vector from '../assets/Vector.png'

import {PRODUCT_ROUTE} from "../utils/consts";
import Image from "react-bootstrap/Image"
import { useNavigate} from "react-router-dom";
import {Context} from "../index";
import {addToBasket} from "../http/productAPI";
import {FaShoppingCart} from "react-icons/fa";

const ProductItem = ({product}) => {
     const history = useNavigate()
     useEffect(()=>{console.log(history)})
    const {user} = useContext(Context)

    const handleAddToBasket = (event) => {
        event.stopPropagation(); // Prevents click event from propagating to parent elements
        addToBasket({ productId: product.id }).then((response) => {
            alert(`Товар ` + product.name + `  был добавлен в вашу корзину!`);
        });
    };

    return (
        <Col md={3} className={"mt-3"}  onClick={() => history(PRODUCT_ROUTE + '/' + product.id)}>
            {product.amount != 0 ?
                <Card style={{border: '2px solid lightgray', width: 170, height:300, cursor: 'pointer'} } className="p-2">
                <Image width={150} height={150} src={process.env.REACT_APP_API_URL + product.img}/><br/>
                <div style={{width: '90%', margin: '0 auto', textalign: 'center'}}>{product.name}<br/>
                    Цена: {product.price} руб.
                    {/*Осталось:{product.amount}
                    */}
                    <br />
                    {/*{user.isAuth && (*/}
                    {/*    <FaShoppingCart className="cart-icon" onClick={handleAddToBasket} />*/}
                    {/*)}*/}
                </div>
            </Card>
            :
            <Card style={{border: '2px solid red', width: 180, height:300, cursor: 'pointer'} } className="p-2">
                <Image width={150} height={150} src={process.env.REACT_APP_API_URL + product.img}/><br/>
                <div style={ {width: '90%', margin: '0 auto', textalign: 'center'} } >{product.name}<br/>
                    Цена: {product.price} руб.
                    Нет в наличии
                </div>
            </Card>
            }
        </Col>
    );
};
export default ProductItem;