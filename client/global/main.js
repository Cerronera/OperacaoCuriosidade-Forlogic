const API_BASE_URL = "https://localhost:7095"

function getAuthenticationHeaders(){
    const token = sessionStorage.getItem('jwtToken')
    if(!token){
        return {
            'Content-Type': 'applicatoin/json'
        };
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}