import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProductSize, updateProductStatus } from '../http/productAPI';
import {Button, Card, Col, FormControl, Row} from "react-bootstrap";

const InventoryProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const data = await fetchProducts(null, 1, 20);
                if (data && data.rows) {
                    const sortedProducts = data.rows.sort((a, b) => b.id - a.id); // Сортировка по убыванию ID
                    setProducts(sortedProducts);
                } else {
                    console.error('Invalid data format:', data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllProducts();
    }, []);



    const handleStatusChange = async (productId, newStatus) => {
        try {
            await updateProductStatus(productId, newStatus);
            const updatedProducts = products.map(product => {
                if (product.id === productId) {
                    return { ...product, accepted: newStatus };
                }
                return product;
            });
            setProducts(updatedProducts);
        } catch (error) {
            console.error(error);
        }
    };


    const handleSizeChange = async (productId, sizeId, newQuantity) => {
        try {
            await updateProductSize(productId, sizeId, newQuantity);
            const updatedProducts = products.map(product => {
                if (product.id === productId) {
                    const updatedSizes = product.size.map(size => {
                        if (size.id === sizeId) {
                            return { ...size, quantity: newQuantity };
                        }
                        return size;
                    });
                    return { ...product, size: updatedSizes };
                }
                return product;
            });
            setProducts(updatedProducts);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card className="d-flex w-100 pb-3 m-3">
            <Row>
                <Col className="mt-3"><strong>ID</strong></Col>
                <Col className="mt-3"><strong>Название</strong></Col>
                <Col className="mt-3"><strong>Цена</strong></Col>
                <Col className="mt-3"><strong>Статус</strong></Col>
                <Col className="mt-3"><strong>Размеры</strong></Col>
                <Col className="mt-3"><strong>Действия</strong></Col>
            </Row>

            {products.map((product) => (
                <Card key={product.id} className="p-3 m-3">
                    <Row>
                        <Col>{product.id}</Col>
                        <Col>{product.name}</Col>
                        <Col>{product.price}</Col>
                        <Col>{product.accepted ? 'Принят' : 'Не принят'}</Col>
                        <Col>
                            {product.size.map((size) => (
                                <div key={size.id}>
                  <span>
                    {size.size} ({size.quantity})
                    <FormControl
                        type="number"
                        value={size.quantity}
                        onChange={(event) =>
                            handleSizeChange(product.id, size.id, event.target.value)
                        }
                    />
                  </span>
                                </div>
                            ))}
                        </Col>
                        <Col>
                            <Button
                                variant={"light"}
                                    className="mt-4 p-2"
                                    style={{ backgroundColor: '#DBDFEA' }}
                                    onClick={() => handleStatusChange(product.id, !product.accepted)}>
                                {product.accepted ? 'Отменить' : 'Принять'}
                            </Button>
                        </Col>
                    </Row>
                </Card>
            ))}
        </Card>
    );
};

export default InventoryProductList;
