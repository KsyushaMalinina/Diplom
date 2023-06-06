import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { fetchSimilarProducts } from '../http/productAPI';
import {Link, useNavigate} from "react-router-dom";
import {PRODUCT_ROUTE} from "../utils/consts";

const SimilarProducts = ({ productId }) => {
    console.log('productId in SimilarProducts: ', productId);
    const [similarProducts, setSimilarProducts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const getSimilarProducts = async () => {
            try {
                const data = await fetchSimilarProducts(productId);
                setSimilarProducts(data);
            } catch (error) {
                console.error(error);
            }
        };
        getSimilarProducts();
    }, [productId]);

    const handleClick = (id) => {
        navigate(PRODUCT_ROUTE + '/' + id);
        window.location.reload();
    };


    return (

        <Row className="mt-4 " >
            <h2 >Похожие товары</h2>
            <Row className="mt-4" style={{ display: 'flex',  flexWrap: 'nowrap', overflowX: 'auto'}}>
            {similarProducts &&
                similarProducts.map((product) => (
                    <Col md={2} key={product.id} onClick={() => handleClick(product.id)}>
                        <Card className="mt-3" style={{border: '2px solid lightgray', width: 170, height:300, cursor: 'pointer', marginBottom: '100px'} } >
                            <Card.Img width={150} height={150}
                                variant="top"
                                src={`${process.env.REACT_APP_API_URL}${product.img}`}
                            />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.price} руб.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Row>
    );
};

export default SimilarProducts;
