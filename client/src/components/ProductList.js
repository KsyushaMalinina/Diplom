import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import ProductItem from "./ProductItem";


const ProductList = observer(() => {
    const {product} = useContext(Context)
    const acceptedProducts = product.products.filter((product) => product.accepted);

    return (

        <Row className="d-flex">
            {acceptedProducts.map((product) =>(
                <ProductItem key={product.id} product={product}/>
            ))}
        </Row>
    );
});

export default ProductList;