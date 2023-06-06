import React, {useEffect, useState} from 'react';
import {Button, Container, Dropdown} from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateProduct from "../components/modals/CreateProduct";
import {deleteType, fetchTypes} from "../http/productAPI";


const Admin = () => {
    const [typeVisible, setTypeVisible] = useState(false)
    const [productVisible, setProductVisible] = useState(false)
    const [types, setTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    useEffect(() => {
        fetchAllTypes();
    }, []);

    const fetchAllTypes = async () => {
        try {
            const data = await fetchTypes();
            setTypes(data);
        } catch (error) {
            console.error('Ошибка при получении типов', error);
        }
    };

    const handleDeleteTypes = async () => {
        try {
            // Массив selectedTypes содержит выбранные для удаления типы
            for (const typeId of selectedTypes) {
                await deleteTypeAndProducts(typeId);
                // Обработка успешного удаления типа
                console.log(`Тип с ID ${typeId} успешно удален`);
            }
        } catch (error) {
            // Обработка ошибки удаления типа
            console.error('Ошибка при удалении типа', error);
        }
    };

    const deleteTypeAndProducts = async (typeId) => {
        // Удаление типа и связанных товаров
        await deleteType(typeId);
    };

    const handleToggleType = (typeId) => {
        const isSelected = selectedTypes.includes(typeId);
        if (isSelected) {
            setSelectedTypes((prevSelected) => prevSelected.filter((id) => id !== typeId));
        } else {
            setSelectedTypes((prevSelected) => [...prevSelected, typeId]);
        }
    };


    return (
        <Container className="d-flex flex-column ">
            <Button
                variant={"light"}
                className="mt-4 p-2"
                style={{ backgroundColor: '#DBDFEA' }}
                onClick={() => setTypeVisible(true)}
            >
                Добавить категорию
            </Button>
            <Button
                variant={"light"}
                className="mt-4 p-2"
                style={{ backgroundColor: '#DBDFEA' }}
                onClick={() => setProductVisible(true)}
            >
                Добавить товар
            </Button>

    <Dropdown className="mt-4 mb-4">
        <Dropdown.Toggle variant="light" style={{ backgroundColor: '#DBDFEA' }}>
            Выберите категории для удаления
        </Dropdown.Toggle>
        <Dropdown.Menu>
            {types.map((type) => (
                <Dropdown.Item
                    key={type.id}
                    onClick={() => handleToggleType(type.id)}
                    active={selectedTypes.includes(type.id)}
                >
                    {type.name}
                </Dropdown.Item>
            ))}
        </Dropdown.Menu>
    </Dropdown>
    <Button
        variant="light"
        className="mt-4 p-2"
        style={{ backgroundColor: '#DBDFEA' }}
        onClick={handleDeleteTypes}
    >
        Удалить выбранные категории
    </Button>
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>

        </Container>
    );
};

export default Admin;