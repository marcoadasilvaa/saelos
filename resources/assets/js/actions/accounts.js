import * as types from './types';
import fetch from '../utils/fetch';

export function fetchAccounts(page = 1) {
    return (dispatch) => {
        dispatch({
            type: types.FETCHING_ACCOUNTS
        });

        let URL = '/companies?page=' + page;

        fetch(URL)
            .then((response) => {
                dispatch({
                    type: types.FETCHING_ACCOUNTS_SUCCESS,
                    data: response.data.data,
                    dataFetched: true,
                    pagination: response.data.meta
                });
            });
    }
}

export function postAccount(data, dispatch) {
    if (typeof data === 'undefined' || Object.keys(data).length === 0) {
        return;
    }

    dispatch({
        type: types.POSTING_ACCOUNT
    });

    let METHOD = 'POST';
    let URL = '/companies';

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
                type: types.POSTING_ACCOUNT_SUCCESS,
                data: response.data.data,
                dataFetched: true
            })
        });
}
