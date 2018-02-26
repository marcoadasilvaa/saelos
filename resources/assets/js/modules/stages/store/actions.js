import * as types from './types';
import fetch from '../utils/fetch';

export const fetchStages = () => (dispatch) => {
    dispatch({
        type: types.FETCHING_STAGES
    });

    fetch('/stages')
        .then((response) => {
            dispatch({
                type: types.FETCHING_STAGES_SUCCESS,
                data: response.data.data,
                dataFetched: true,
                pagination: response.data.meta
            });
        });
}