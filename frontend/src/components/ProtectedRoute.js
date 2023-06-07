import { Navigate } from "react-router-dom";
import { Route } from "react-router-dom";
import { redirect } from "react-router-dom";
import UnauthorisedPage from '../mainpages/UnauthorizedPage/UnauthorizedPage'

function getTokenClaims(token){
    const payloadBase64Url = token.split('.')[1]; //splitting the token and getting payload section of the key 
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/'); //decoding the payload
    const payloadJson = atob(payloadBase64);
    const claims = JSON.parse(payloadJson);
    return claims; 
}

const ProtectedRoute = ({expectedRoles, element}) => {
    
    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        if (!token){
            return false;
        }

        //check the user is of the correct role
        const claims = getTokenClaims(token);
        const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; //ClaimTypes.Roles identifier

        if (expectedRoles === 'Staff'){
            return true;
        }

        if (expectedRoles === 'Admin'){
            if (roles === 'Admin' || roles == 'Unit Coordinator' || roles == 'Line Manager'){
                return true;
            }

            else{
                return false; 
            }
        }
    }; 

    const authenticated = isAuthenticated(); 
    if (!authenticated){
        return <Navigate to="/unauthorized" replace/> //edit
    }

    return element;
}

export default ProtectedRoute;