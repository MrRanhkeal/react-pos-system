export const setServerStatus = (status) => {
    localStorage.setItem('server_status', status)
}

export const getServerStatus = () => {
    return localStorage.getItem('server_status')
}