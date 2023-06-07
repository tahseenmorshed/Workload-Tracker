/*
This file is used to configure all routes and maintain code modularity. For protected routes, within the <ProtectedRoute> component 
pass in expected roles who are authorized to access this, and the page which the route will navigate to. 
Example: 
    {
        path: '/admin',
        element: (
            <ProtectedRoute expectedRoles={'Admin'} element={<Admin/>}/>
        )
    },
*/

import ProtectedRoute from "./components/ProtectedRoute";
import AdminStaffPage from "./mainpages/AdminStaffPage/MainStaffPage";
import AdminUnitPage from "./mainpages/AdminUnitPage/MainUnitPage";
import Login from "./mainpages/LoginPage/Login";
import UnitPage from "./mainpages/UnitPages/MainTable"
import AddUnitPage from "./mainpages/AdminUnitPage/UnitAddPage/MainTable";
import Unauthorized from "./mainpages/UnauthorizedPage/UnauthorizedPage";
import EditPage from "./mainpages/AdminUnitPage/UnitEditPage/MainTable"
import MainUnitPage from "./mainpages/UnitSummaryPage/MainUnitPage"

const routesConfig = [
    {
        path: '/adminstaffpage',
        element: (
                <ProtectedRoute expectedRoles={'Admin'} element={<AdminStaffPage/>}/>
        )
    },
    {
        path: '/uniteditpage/:unitCode',
        element: <EditPage/>
    },
    {
        path: '/units/:unitCode',
        element: (
            <ProtectedRoute expectedRoles={'Staff'} element={<UnitPage/>}/>
        )
    },
    {
        path: '/adminunitpage',
        element: (
            <ProtectedRoute expectedRoles={'Admin'} element={<AdminUnitPage/>}/>
        )
    },
    {
        path: '/',
        element:<Login/>
    },
    {
        path: '/login',
        element:<Login/>
    },
    {
        path: '/unauthorized',
        element: <Unauthorized/>
    },
    {
        path: '/unitaddpage',
        element: <ProtectedRoute expectedRoles={'Admin'} element={<AddUnitPage/>}/>
    },
    {
        path: '/unitsummarypage',
        element: <ProtectedRoute expectedRoles={'Staff'} element={<MainUnitPage/>}/>
    },

]

export default routesConfig; 