import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import {BsPersonFillLock} from 'react-icons/bs'
import {MdOutlineSummarize} from 'react-icons/md'
import { BsFileEarmarkLock2 } from "react-icons/bs";
import React, {useEffect} from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Button } from "bootstrap";
import { IoLogOutOutline } from 'react-icons/io5'; // Import the Logout icon
import { useNavigate } from 'react-router-dom';


const Item = ({ title, to, icon, selected, setSelected }) => 
{
  return (
    <MenuItem 
     data-testid={`menu-item-${title}`}
      active={selected === title}
      style= {{ color: "#ffffff" }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography style={{ fontSize: "16px"}}>
          {title}
      </Typography>
      <Link to={to} />
    </MenuItem>
  );
};

function getTokenClaims(token){
  const payloadBase64Url = token.split('.')[1]; //splitting the token and getting payload section of the key 
  const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/'); //decoding the payload
  const payloadJson = atob(payloadBase64);
  const claims = JSON.parse(payloadJson);
  return claims; 
}

const Sidebar = ({onLogout}) => 
{
  const [isCollapsed] = useState(false);
  const [selected, setSelected] = useState();
  const [units, setUnits] = useState([]); 

  const [role, setRole] = useState(); 
  const [name, setName] = useState();
  const [id, setId] = useState(); 
  //console.log("claims: ", claims)

  const navigate = useNavigate();
  
  useEffect(() => {
    const claims = getTokenClaims(localStorage.getItem("token"));
    console.log("claims", claims);
    setId(claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'])
    setName(claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'])
    setRole(claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    )

    const fetchUnits = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/Unit/GetUnitByStaff/${id}`);
          if (response.ok) {
            const fetchedUnits = await response.json();
            setUnits(fetchedUnits);
          } else {
            console.log('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
  
    fetchUnits();
  }, [id]);
  
  

  const handleLogout = () => {
    navigate('/login');
    onLogout();
  }; 

  return (
    <Box
      sx={{

        "& .pro-sidebar-inner": {
          background: `${"#2c75e2"} !important`, 
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#ffffff !important",
        },
        "& .pro-menu-item.active": {
          color: "#ffffff !important",
        },
      }}
      className="sidebar"
    >
      {/*The code below adds the user profile, name and job title -  at the moment this is all hard coded*/}
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
       
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user1.png`}
                  style={{ cursor: "pointer", borderRadius: "50%", marginTop: "50px" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h1"
                  color={"#ffffff"}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {name}
                </Typography>
                <Typography variant="h4" color={"#ffffff"}>
                  {role}
                </Typography>
              </Box>
            </Box>
          )}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
        {/*To add a Header for your pages use the typography tag below*/ }
        {/*To add a page underneath the header, use the item tag, where title is the name displayed, to is the route it'll take to App.js*/ }
        {/*Units header and sub section is just for display, it's not connected to anything*/}
            <Typography
              color={"#ffffff"}
              sx={{ m: "10px 0 0px 10px" }}
              style={{fontWeight: "bold", fontSize: 20}}
            >
              Admin
            </Typography>
            <Item
              title="Admin Unit Page"
              to="/adminunitpage"
              icon={<BsFileEarmarkLock2 size="30px" color="white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              variant="h1"
              title="Admin Staff Page"
              to="/adminstaffpage"
              icon={<BsPersonFillLock size="30px" color="white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              color={"#ffffff"}
              sx={{ m: "10px 0 0px 10px" }}
              style={{fontWeight: "bold", fontSize: 20}}
            >
              Summary Page
            </Typography>
              <Item

              title="Unit Summary Page"
              to="/unitsummarypage"
              icon={<MdOutlineSummarize size="30px" color="white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              color={"#ffffff"}
              sx={{ m: "10px 0 0px 10px" }}
              style={{fontWeight: "bold", fontSize: 20}}
            >
              My Units
            </Typography>
            {units.map((unit) => (
              <Item
                key = {unit.code}
                title={unit.name}
                to={`/units/${unit.code}`}
                icon={<MdOutlineSummarize size="30px" color="white" />}
                selected={selected}
                setSelected={setSelected}
              />      
            ))}

            
            {/* Logout Section */}
            <Typography
              color={"#ffffff"}
              sx={{ m: "10px 0 0px 10px" }}
              style={{fontWeight: "bold", fontSize: 20}}
            >
              Logout
            </Typography>
            <MenuItem 
              style= {{ color: "#ffffff" }}
              onClick={handleLogout}
              icon={<IoLogOutOutline size="30px" color="white" />}
            >
            <Typography style={{ fontSize: "16px"}}>
                Logout
            </Typography>
            </MenuItem>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};
export default Sidebar;