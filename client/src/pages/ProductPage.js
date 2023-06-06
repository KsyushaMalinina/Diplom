import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import {useNavigate, useParams} from 'react-router-dom'
import {addToBasket, delProduct, fetchOneProducts, updateAmount} from "../http/productAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import SimilarProducts from "../components/SimilarProducts";

const ProductPage = observer(() => {
    const {user} = useContext(Context)
    const [product, setProduct] = useState({info: [], size: []})
    const {id} = useParams()
    const [productVisible, setProductVisible] = useState(false)
    const typeId = product.typeId; // здесь нужно заменить на фактический способ вычисления категории
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    useEffect(() => {
        fetchOneProducts(id).then((data) => {
            setProduct(data);
            console.log(setProduct(data))
        });
    }, []);

    const [value, setValue] = useState('')

    // const Amount = () => {
    //     updateAmount(id, value).then(response => alert(`Количество товаров обновлено`))
    // }
    // // ------- Создаём функцию для записи ------- //

    const add = () => {
        if (!selectedSize) {
            alert('Пожалуйста, выберите размер');
            return;
        }
        if (!user.isAuth) {
            alert('Пожалуйста, авторизуйтесь, чтобы добавить товар в корзину');
            return;
        }

        const formData = new FormData()
        console.log(selectedSize.size);
        formData.append('sizeName', selectedSize.size);
        formData.append('productId', id)
        formData.append('productSizeId', selectedSize.id);

       // formData.append("quantity", selectedQuantity);
        console.log(id, selectedSize.id);
        addToBasket(formData).then((response) => {
            alert(`Товар ${product.name} был добавлен в вашу корзину!`);
            setSelectedQuantity(1);
        }).catch((error) => {
            console.log(error);
        });

    }


    const handleSelectSize = (size) => {
        const selectedSize = product.size.find(s => s.size === size);
        setSelectedSize(selectedSize);
    };


    const handleSelectQuantity = (quantity) => {
        setSelectedQuantity(quantity);
    };
    return (
        <Container>
            <Row className="justify-content-center mb-0">
            <Col className="mt-4">
                <Image width={400} height={460} src={process.env.REACT_APP_API_URL + product.img}/>
                <h1>{product.name}</h1>
            </Col>
                <Col>
                <h2 className="mt-4">Характеристики</h2>
                {product.info.map((info, index) =>
                    <Row key={info.id} style={{
                        border: '2px solid lightgray',
                        background: index % 2 === 0 ? 'lightgray' : 'transparent',
                        padding: 10
                    }}>
                        <Col>{info.title}</Col><Col> : {info.description}</Col>
                    </Row>
                )}

            </Col>
        </Row><br/>
    <Row>
        <Col className={"w-75"}>
            <label >
                {product._info}
            </label>
                <label>Выберите размер:</label>
                <Form.Select onChange={(e) => handleSelectSize(e.target.value)}>
                    <option>Выберите размер</option>
                    {product.size.map((size) => (
                        <option key={size.id} value={size.size} disabled={size.quantity === 0}>
                            {size.size} ({size.quantity === 0 ? 'Нет в наличии' : `${size.quantity} шт.`})
                        </option>
                    ))}
                </Form.Select>
                {selectedSize && (
                    <div>
                        <label>Вы выбрали:</label>
                        <p>{selectedSize.size}</p>
                    </div>
                )}

        </Col>
        <Col>
            <Card
                className="d-flex flex-column align-items-center align-self-end p-3 "
                style={{width: 800, fontSize: 32, border: '5px solid light'}}
            >
                <div className="d-flex align-items-center" >
                <h3 style={{ marginRight: '10px', fontSize: '24px' }}>Цена: {product.price} руб.</h3>
                <Button variant={"light"}
                        className=" p-2"
                        style={{ backgroundColor: '#8294C4' }}
                        onClick={add}>Добавить в корзину  </Button>
                </div>
            </Card>
    </Col>
    </Row>
        <Row >
                <SimilarProducts productId={id} />
        </Row>

    {user.isRole === "ADMIN"?
        <Row>
            <Button
                variant={"outline-dark"}
                className="mt-4 p-2 bg-danger text-light"
                onClick={() => delProduct(id).then(response => alert(`Товар был удален!`)) }
            >
                Удалить
            </Button>

        </Row>:<br/>
    }
</Container>
);
});

export default ProductPage;