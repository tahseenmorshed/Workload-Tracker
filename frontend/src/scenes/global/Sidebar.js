import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import {TbLockAccess} from 'react-icons/tb'


const Item = ({ title, to, icon, selected, setSelected }) => 
{
  return (
    <MenuItem 
      active={selected === title}
      style= {{ color: "#ffffff" }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>
          {title}
      </Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => 
{
  const [isCollapsed] = useState(false);
  const [selected, setSelected] = useState("Summary");

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
                  Name
                </Typography>
                <Typography variant="h5" color={"#ffffff"}>
                  Job Title
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>


        {/*To add a Header for your pages use the typography tag below*/ }
        {/*To add a page underneath the header, use the item tag, where title is the name displayed, to is the route it'll take to App.js*/ }
        {/*Units header and sub section is just for display, it's not connected to anything*/}

            <Typography
              variant="h4"
              color={"#ffffff"}
              sx={{ m: "15px 0 5px 20px" }}
              style={{fontWeight: "bold", fontSize: 18}}
            >
              Admin
            </Typography>

            <Item
              title="Admin Unit Page"
              to="/adminunitpage"
              icon={<TbLockAccess size="30px" color="white"/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              variant="h1"
              title="Admin Staff Page"
              to="/adminstaffpage"
              icon={<TbLockAccess size="30px" color="white" />}
              selected={selected}
              setSelected={setSelected}
            />

          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
