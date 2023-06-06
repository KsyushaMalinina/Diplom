import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {ListGroup} from "react-bootstrap";

const TypeBar = observer(() => {
    const {product} = useContext(Context)
    return (
        <ListGroup  >
            {product.types.map(type =>
                <ListGroup.Item
                style={{cursor: 'pointer', backgroundColor: type.id === product.selectedType.id ? '#8294C4' : '' }}
                    active={type.id === product.selectedType.id}
                    onClick={() => product.setSelectedType(type)}
                    key={type.id}  >
                    {type.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default TypeBar;