import { useMemo, useState, useContext } from 'react'
import axios from 'axios'
import qs from 'qs';
import Cookies from 'js-cookie';
import { GlobalSettingsContext } from '../Contexts/GlobalSettingsContext';

let useGetData = () => {
    const { token, setToken } = useContext(GlobalSettingsContext)

    let call = useMemo(() => async (action, params) => {

        let { query } = params;
        try {
            if (token) {
                let {data: {result, result_message}} = await axios.get(query ? `http://localhost:3000/api/${action}?${qs.stringify(query)}` : `http://localhost:3000/api/${action}`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                        'x-api-lang': 'TR'
                    }
                })

                if (result_message && result_message.type === 'token_expire') {
                    Cookies.remove("token")
                    setToken(null);
                    return (result_message.message)
                }
                else if (!result && result_message.type === 'error')
                    throw Error(result_message.message)
                else
                    return ({ result, result_message })

            } else {
                throw new Error({ status: 404 })
            }
        }
        catch (error) {
            if (error) {
                if (error?.response?.status === 401)
                    throw ({ code: 401, message: error.message })
                if (error?.response?.status === 404)
                    throw ({ code: 404, message: '404 Aradığınızı bulamadık.' })
                else if (error?.message === 'Entity not found')
                    throw ({ code: 0, message: 'Aradığınız kayıt bulunamadı.' })
                else
                    throw ({ code: 0, message: error.message })
            }
        }

    }, [token])

    return call
}

let usePostData = () => {
    const { token, setToken } = useContext(GlobalSettingsContext)

    let call = useMemo(() => async (action, values) => {
        if (token) {
            try {
                let {data: {result, result_message}} = await axios.post(`http://localhost:3000/api/${action}`, values, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })

                if (!result && result_message.type === 'error')
                    throw Error(result_message.message)
                else
                    return ({ result, result_message })
            }
            catch (error) {
                if (error) {
                    if (error?.response?.status === 404)
                        throw ({ code: 404, message: '404 We couldn t find what you re looking for.' })
                    else if (error?.message === 'Registration failed.')
                        throw ({ code: 0, message: 'Could not find the records you are looking for.' })
                    else
                        throw ({ code: 0, message: error.message })
                }
            }
        }
        else {
            throw ({ code: 0, message: 'failed' })
        }

    }, [token])

    return call

}

let useDeleteData = () => {
    const { token, setToken } = useContext(GlobalSettingsContext)

    let call = useMemo(() => async (action) => {
        if (token) {
            try {
                let {data: {result, result_message}} = await axios.delete(`http://localhost:3000/api/${action}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                if (result_message && result_message.type === 'token_expire') {
                    Cookies.remove("token")
                    setToken(null);
                    return (result_message.message)
                }
                else if (!result && result_message.type === 'error')
                    throw Error(result_message.message)
                else
                    return ({ result, result_message })
            }
            catch (error) {
                if (error) {
                    if (error?.response?.status === 404)
                        throw ({ code: 404, message: '404 Aradığınızı bulamadık.' })
                    else if (error?.message === 'Entity not found')
                        throw ({ code: 0, message: 'Aradığınız kayıt bulunamadı.' })
                    else
                        throw ({ code: 0, message: error.message })
                }
            }
        }
        else {
            throw new Error({ status: 404 })
        }
    }, [token])

    return call

}

let usePatchData = () => {
    const { token, setToken } = useContext(GlobalSettingsContext)

    let call = useMemo(() => async (action, values) => {
        if (token) {
            try {
                let { data: { result, result_message } } = await axios.patch(`http://localhost:3000/api/${action}`, values, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })

                if (result_message && result_message.type === 'token_expire') {
                    Cookies.remove("token")
                    setToken(null);
                    return (result_message.message)
                }
                else if (!result && result_message.type === 'error')
                    throw Error(result_message.message)
                else
                    return ({ result, result_message })
            }
            catch (error) {
                if (error) {
                    if (error?.response?.status === 404)
                        throw ({ code: 404, message: '404 Aradığınızı bulamadık.' })
                    else if (error?.message === 'Entity not found')
                        throw ({ code: 0, message: 'Aradığınız kayıt bulunamadı.' })
                    else
                        throw ({ code: 0, message: error.message })
                }
            }
        }
        else {
            throw new Error({ status: 404 })
        }
    }, [token])

    return call

}

let useUploadFile = () => {
    const { token, setToken } = useContext(GlobalSettingsContext)

    const [progress, setProgress] = useState(0);
    let upload = useMemo(() => async (values) => {
        if (token) {
            try {
                const formData = new FormData();
                values.files.forEach(file => formData.append('files', file));

                let { data: { result, result_message } } = await axios.post(`http://localhost:3000/api/upload`, formData, {
                    headers: {
                        'ContenType': 'multipart/form-data',
                        authorization: `Bearer ${token}`
                    },
                    onUploadProgress: event => {
                        const percent = Math.floor((event.loaded / event.total) * 100);
                        setProgress(percent - 1);
                    }
                })

                if (result_message && result_message.type === 'token_expire') {
                    Cookies.remove("token")
                    setToken(null);
                    return (result_message.message)
                }
                else if (!result && result_message.type === 'error')
                    throw Error(result_message.message)
                else
                    return ({ result, result_message })
            }
            catch (error) {
                if (error) {
                    if (error?.response?.status === 404)
                        throw ({ code: 404, message: '404 Aradığınızı bulamadık.' })
                    else if (error?.message === 'Entity not found')
                        throw ({ code: 0, message: 'Aradığınız kayıt bulunamadı.' })
                    else
                        throw ({ code: 0, message: error.message })
                }
            }
        }
        else {
            throw new Error({ status: 404 })
        }
    }, [token])

    return [upload, progress]

}

export { useGetData, usePostData, usePatchData, useDeleteData, useUploadFile }