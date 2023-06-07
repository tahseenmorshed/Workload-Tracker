import React,{ useState }  from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from 'react-bootstrap/InputGroup';

import { Table, Pagination } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
 
import {BiSearchAlt} from 'react-icons/bi'
import {FaPencilAlt} from 'react-icons/fa'

const tableWrapperStyle = 
{ //Adjusts the positioning of the table 
  marginLeft: '-60px', 
  marginTop: "60px"
};

const headerStyle = 
{ //Adjusts the style of the header columns (e.g. name, ID, unitCode)
  fontSize: '1.4em', 
  backgroundColor: '#2c75e2',
  color: 'white',
  textAlign: 'center'
};

const cellStyle = 
{ //Ensures data in table is in the centre of the columns
  textAlign: 'center',
};

const UserRow = ({ data, onSelect, selectedIds, onEdit, suspendedIds }) => 
{
  const [column, setColumn] = useState(null);
  const [direction, setDirection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const itemsPerPage = 10; //Max amount of columns allowed in each page
  
    // Add this useEffect hook to update the filtered data when data or searchQuery change
    React.useEffect(() => {
      const newFilteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(newFilteredData);
    }, [data, searchQuery]);

  const handlePaginationChange = (e, { activePage }) => 
  {
    setActivePage(activePage);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Update the paginatedData calculation to use filteredData
  const paginatedData = filteredData.slice
  (
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );
  
  const handleSearchChange = (e) => 
  {
    setSearchQuery(e.target.value);
  };


  function sortColumn(data, column, direction) 
  {
    const sortedData = [...data].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
  
      if (typeof aVal === 'string') 
      {
        return aVal.localeCompare(bVal) * (direction === 'ascending' ? 1 : -1);
      }
  
      return (aVal - bVal) * (direction === 'ascending' ? 1 : -1);
    });
  
    return sortedData;
  }


  /*
  const handleSort = (clickedColumn) => () => 
  {
    if (column !== clickedColumn) 
    {
      setColumn(clickedColumn);
      data = sortColumn(data, clickedColumn, 'ascending');
      setDirection('ascending');
      return;
    }
  
    data = data.reverse();
    setDirection(direction === 'ascending' ? 'descending' : 'ascending');
  };*/

  const handleSort = (clickedColumn) => () => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      const sortedData = sortColumn(filteredData, clickedColumn, 'ascending');
      setFilteredData(sortedData);
      setDirection('ascending');
      return;
    }
  
    const reversedData = [...filteredData].reverse();
    setFilteredData(reversedData);
    setDirection(direction === 'ascending' ? 'descending' : 'ascending');
  };
  
return(

<div style={tableWrapperStyle}>

  <InputGroup className="mb-3 custom-input-group" >
    <Form.Control //Creates the search bar 
      aria-label='Search'
      aria-describedby="search-addon"
      placeholder="Search..."
      value={searchQuery} //Takes in the users search request
      onChange={handleSearchChange}
    />
  <InputGroup.Text id="inputGroup-sizing-default" style={{backgroundColor:"#2c75e2"}}> {/*Icon for the search bar*/}
    <BiSearchAlt color='white' size={22}/> 
  </InputGroup.Text> 
  </InputGroup>
          
  <Table compact celled sortable active>
    <Table.Header style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
      <Table.Row>

        <Table.HeaderCell
        style={headerStyle}
        onClick={handleSort('id')}
        sorted={column === 'id' ? direction : null}
        >
          Select
        </Table.HeaderCell>

        <Table.HeaderCell
          style={headerStyle}
          onClick={handleSort('name')}
          sorted={column === 'name' ? direction : null}
        >
          Name
        </Table.HeaderCell>

        <Table.HeaderCell
          style={headerStyle}
          onClick={handleSort('ID')}
          sorted={column === 'ID' ? direction : null}
         >
            ID
         </Table.HeaderCell>
    
        <Table.HeaderCell
          style={headerStyle}
          onClick={handleSort('Discipline')}
          sorted={column === 'Discipline' ? direction : null}
        >
          Discipline
        </Table.HeaderCell>

        <Table.HeaderCell
          style={headerStyle}
          onClick={handleSort('Position')}
          sorted={column === 'Position' ? direction : null}
        >
          Position
        </Table.HeaderCell>

        <Table.HeaderCell
          style={headerStyle}
          onClick={handleSort('WFunction')}
          sorted={column === 'WFunction' ? direction : null}
        >
          WFunction
        </Table.HeaderCell>

        <Table.HeaderCell
          style={headerStyle}
          onClick={handleSort('Teaching')}
          sorted={column === 'Teaching' ? direction : null}
        >
          Workload Hours
        </Table.HeaderCell>

        <Table.HeaderCell></Table.HeaderCell>
      </Table.Row>
    </Table.Header>
              
        <Table.Body>
        {filteredData.map((item) => 
        (  // Maps over data array to render a row for each staff member 
           <Table.Row // Creates table row with unique key 
            key={item.id}
            className={suspendedIds.has(item.id) ? 'suspended' : ''}>
              <Table.Cell> {/* Table cell containing a checkbox to select the staff member*/}
                <Form.Check
                  type="checkbox"
                  checked={selectedIds.has(item.staffID)}
                  onChange={() => onSelect(item.staffID)}
                  style={{ textAlign: "center"}}
                />
                        
                </Table.Cell> {/*Table cells displaying the different properties of staff members*/}
                <Table.Cell style={cellStyle}>{item.name}</Table.Cell>
                <Table.Cell style={cellStyle}>{item.staffID}</Table.Cell>
                <Table.Cell style={cellStyle}>{item.discipline}</Table.Cell>
                <Table.Cell style={cellStyle}>{item.positionTitle}</Table.Cell>
                <Table.Cell style={cellStyle}>{item.workFunction}</Table.Cell>
                <Table.Cell style={cellStyle}>{item.workloadHours || 0}</Table.Cell>
                <Table.Cell>
                  <FaPencilAlt onClick={() => onEdit(item)} // Edit button icon 
                    variant="info" 
                    color="black" 
                    className="icons pencil"  >
                  </FaPencilAlt>
                </Table.Cell>
            </Table.Row>
        ))}
        </Table.Body>
  </Table>
  
  <Pagination
    activePage={activePage}
    onPageChange={handlePaginationChange}
    totalPages={totalPages}
    boundaryRange={1}
    siblingRange={1} 
  />

  </div>
  )
}

export default UserRow;