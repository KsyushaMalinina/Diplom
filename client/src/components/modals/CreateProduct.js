import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Dropdown, Form, Modal, Row} from "react-bootstrap";
import {Context} from "../../index";
import {createProduct, fetchTypes} from "../../http/productAPI";
import {observer} from "mobx-react-lite";

const CreateProduct = observer(({show, onHide}) => {
    const {product} = useContext(Context)
    const [name, setName] = useState('')
    const [amount, setAmount] = useState(1)
    const [price, setPrice] = useState(0)
    const [file, setFile] = useState(null)
    const [info, setInfo] = useState([])
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        fetchTypes().then(data => product.setTypes(data))
    }, [])

    const addInfo = () => {
        setInfo([...info, {title: '', description: '', number: Date.now()}])
    }

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number))
    }

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? {...i, [key]: value} : i))
    }

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const addProduct = () => {
        const formData = new FormData()
        try {
            formData.append('name', name)
            formData.append('price', `${price}`)
            formData.append('img', file)
            formData.append('amount', `${amount}`)
            formData.append('typeId', product.selectedType.id)
            formData.append('info', JSON.stringify(info))
            formData.append('size', JSON.stringify(sizes));
            createProduct(formData).then(data => onHide())
        } catch (e) {
            alert(e)
        }

    }

    const handleSizeChange = (event, index) => {
        const newSizes = [...sizes];
        newSizes[index][event.target.name] = event.target.value;
        setSizes(newSizes);
    };

    const handleAddSize = () => {
        setSizes([...sizes, { size: "", quantity: 0 }]);
    };


    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header style={{backgroundColor: '#DBDFEA'}} closeButton>
                <Modal.Title  id="contained-modal-title-vcenter">
                    Добавить товар
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2 mb-2" >
                        <Dropdown.Toggle variant={"outline-dark"}>{product.selectedType.name || "Выберите тип"}</Dropdown.Toggle>
                        <Dropdown.Menu >
                            {product.types.map(type =>
                                <Dropdown.Item
                                    onClick={() => product.setSelectedType(type)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название товара"
                    />
                    <Form.Control
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите стоимость товара"
                    />
                    <Form.Control
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите количество"
                        type="number"
                    />

                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                    />

                    <div>
                        Размеры:
                        {sizes.map((size, index) => (
                            <div key={index}>
                                <Form.Control
                                    type="text"
                                    name="size"
                                    value={size.size}
                                    placeholder="Размер"
                                    onChange={(e) => handleSizeChange(e, index)}
                                />
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={size.quantity}
                                    placeholder="Количество"
                                    onChange={(e) => handleSizeChange(e, index)}
                                />
                            </div>
                        ))}
                        <Button variant={"outline-dark"} className="mt-3" onClick={handleAddSize}>
                            Добавить размер
                        </Button>
                    </div>
                    <hr/>
                    <Button
                        variant={"outline-dark"}
                        onClick={addInfo}
                    >
                        Добавить новое свойство
                    </Button>
                    {info.map(i =>
                            <Row className="mt-4" key={i.number}>
                                <Col md={4}>
                                    <Form.Control
                                        value={i.title}
                                        onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                        placeholder="Введите название свойства"
                                    />

                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        value={i.description}
                                        onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                        placeholder="Введите описание свойства"
                                    />
                                </Col>
                                <Col md={4}>
                                    <Button
                                        onClick={() => removeInfo(i.number)}
                                        variant={"outline-danger"}
                                    >
                                        Удалить
                                    </Button>
                                </Col>

                            </Row>

                        )
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addProduct}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;