import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `http://127.0.0.1:8000/api/add_citizen/`;
const villageUrl = `http://127.0.0.1:8000/api/add_citizen_page/`

export const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getVillage
};

function getVillage() {
    return fetchWrapper.get(villageUrl);
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
