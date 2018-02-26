import * as types from './types';
import fetch from '../utils/fetch';

export const fetchOpportunities = (page = 1, query = {}) => (dispatch) => {
    dispatch({
        type: types.FETCHING_OPPORTUNITIES,
        search: query
    });

    let URL = '/deals?page=' + page;

    if (Object.keys(query).length) {
        Object.keys(query).map((key) => {
            URL = URL + '&' + key + '=' + query[key];
        });
    }

    fetch(URL)
        .then((response) => {
            dispatch({
                type: types.FETCHING_OPPORTUNITIES_SUCCESS,
                data: response.data.data,
                dataFetched: true,
                pagination: response.data.meta
            });
        });
};

export const fetchOpportunity = (id) => (dispatch) => {
    dispatch({
        type: types.FETCHING_SINGLE_ACCOUNT
    });

    let URL = '/deals/' + id;

    fetch(URL)
        .then((response) => {
            dispatch({
                type: types.FETCHING_SINGLE_ACCOUNT_SUCCESS,
                data: response.data.data,
                dataFetched: true
            });
        });
};

export const fetchOpportunityCustomFields = () => (dispatch) => {
    dispatch({
        type: types.FETCHING_OPPORTUNITY_CUSTOM_FIELDS
    })

    let URL = '/contexts/Deal?customOnly=true';

    fetch(URL)
        .then((response) => {
            dispatch({
                type: types.FETCHING_OPPORTUNITY_CUSTOM_FIELDS_SUCCESS,
                data: response.data,
                dataFetched: true
            })
        })
};

export const postOpportunity = (data) => (dispatch) => {
    if (typeof data === 'undefined' || Object.keys(data).length === 0) {
        return;
    }

    dispatch({
        type: types.POSTING_OPPORTUNITY
    });

    let METHOD = 'POST';
    let URL = '/deals';

    if (data.hasOwnProperty('id') && data.id !== 'new') {
        URL = URL + '/' + data.id;
        METHOD = 'PATCH';
    } else {
        delete data.id;
    }

    let options = {
        body: data,
        method: METHOD
    };

    fetch(URL, options)
        .then((response) => {
            dispatch({
                type: types.POSTING_OPPORTUNITY_SUCCESS,
                data: response.data.data,
                dataFetched: true
            })
        });
};

export const addOpportunityNote = (data) => {
    if (typeof data === 'undefined' || Object.keys(data).length === 0) {
        return;
    }

    let METHOD = 'POST';
    let URL = '/deals/' + data.id + '/notes';

    let options = {
        body: data,
        method: METHOD
    }

    fetch(URL, options)
        .then((response) => {
            console.log(response);
        });
};