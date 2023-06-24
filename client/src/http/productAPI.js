import {$authHost, $host} from "./index";
// import axios from "axios";


export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type')
    return data
}
export const deleteType = async (id) => {
    const { data } = await $authHost.delete('api/type/del/'+ id);
    return data;
}



export const createProduct = async (product) => {
    const {data} = await $authHost.post('api/product', product)
    return data
}

export const delProduct = async (id) => {
    const {data} = await $authHost.post('api/product/del/'+ id)
    return data
}


export const fetchProducts = async (typeId, page, limit = 5) => {
    const {data} = await $host.get('api/product', {params: {
        typeId, page, limit
        }})
    return data
}

export const fetchOneProducts = async (id) => {
    const {data} = await $host.get('api/product/' + id)
    console.log(data)
    return data

}

export const fetchSimilarProducts = async (productId) => {
    try {
        const response = await $host.get(`/api/product/${productId}/similar`);
        return response.data;
} catch (error) {
    console.error(error);
    throw new Error('Ошибка при загрузке похожих товаров' + error.message);
}
}



export const addToBasket = async (formData) => {
    const {response} = await $authHost.post('api/basket', formData)
    return response
}

export const deleteFromBasket = async (id) => {
    const {response} = await $authHost.post('api/basket/delete', {id:id})
    return response
}

export const getBasket = async () => {
    const {data} = await $authHost.get('api/basket')
    return data
}

// -------- Заказ -----------//

export const addOrder = async (id, phone, postcode, addressee) => {
    const {data} = await $host.post('api/order', {
        id, phone, postcode, addressee
    })
    return data
}

export const getOrder = async (id) => {
    const {data} = await $authHost.get('api/order/')
    return data
}


export const getUserOrder = async (id) => {
    if(!id)id = 0;
    const {data} = await $authHost.get('api/order/user/'+id, id)
    return data
}

export const getUserOrderList = async (id) => {
    if(!id)id = 0;
    const {data} = await $authHost.get('api/order/'+id, id)
    return data
}

export const updateUserOrder = async (id, status) => {
    if (!id)id = 0;
    const { data } = await $authHost.post('api/order/user/update/'+id, { id: id, status: status });
    return data;
};

export const updateAmount = async (_id, _amount) => {
    const {data} = await $authHost.post('api/product/update/'+_id, {_id, _amount})
    return data
}

export const getAllForInventory = async (status) => {
    try {
        const { data } = await $authHost.get('api/product/inventory', {
            params: { status },
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
};

export const updateProductStatus = async (productId, accepted) => {
    try {
        const { data } = await $authHost.post('api/product/status', {
            productId,
            accepted,
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Product not found');
    }
};

export const updateProductSize = async (productId, sizeId, quantity) => {
    try {
        const {response} = await $authHost.post(`/api/product/${productId}/size/${sizeId}`, { quantity });
        return response;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
