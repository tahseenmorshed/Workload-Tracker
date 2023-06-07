import { Box } from "@mui/material";

const Topbar = () => {
  return (
    <Box display="flex" justifyContent="space-between" p={3}>
      {/*Adds the curtin logo at the top of the page*/}
      <Box display="flex">
        <img 
        alt="profile-user"
        width="200px"
        height="35px"
        src={'../../assets/curtin.png'} 
        />
      </Box>
    </Box>
  );
};

export default Topbar;
