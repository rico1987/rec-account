import qs from 'qs';
import fileFetch from '../utils/fileFetch';
import storageFetch from '../utils/storageFetch';

export function authorize(type, files) {
    return fileFetch.post('/authorize', qs.stringify({
        type,
        files,
    }));
}

export function upload(postData) {
    return storageFetch.post('/files', postData);
}
