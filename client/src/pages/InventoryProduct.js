import React, { useEffect, useState } from 'react';

import InventoryProductList from "../components/InventoryProductList";
import Pages from "../components/Pages";
import {Col, Container, Row} from "react-bootstrap";


const InventoryProduct = () => {
    return (
        <Container>
            <Row className="mt-2">
                <Col md={12}>
                    <h1>Управление инвентарем</h1>
                    <InventoryProductList />
                </Col>
            </Row>
        </Container>
    );
};

export default InventoryProduct;