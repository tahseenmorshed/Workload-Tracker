import React, {useState, useEffect} from 'react';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import UnitInformation from './UnitInformation';
import TDRTable from './TDRTable';
import TeachingTeamAllocationTable from './TeachingTeamAllocationTable';
import './styles.css';
import { useParams } from 'react-router-dom';

  const Main = () => {
    const [data, setData] = useState([]); 
    const{unitCode} = useParams(); 
    const [isLoading, setIsLoading] = useState(true);

    //get unit data from backend by using unit code in the url
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(`/api/Unit/GetUnitByCode/${unitCode}`);
        console.log("Api response: ", response)
        if (response.ok){
          const units = await response.json();
          console.log(units)
          setData(units);
        }
        else {
          console.error('Error fetching unit data:', response.status, response.statusText);
        }
        setIsLoading(false);

      };
      
      fetchData();
    }, [unitCode]);

    if (isLoading) {
      return <div>Loading...</div>;
    }
  
  const DataTables = ({ data }) => {
    const unit = data;
    const standardContacts = unit.standardTDs; 
    console.log("UNit = ", unit)
    console.log("SC = ", standardContacts);
    /*const unit =data[0]*/
    return (
      <>
      {unit && (
        <div className="table-wrapper-style">
          <UnitInformation unit={unit} />
        </div>
      )}
      <Container>
        {unit && <TDRTable unit={unit}/>}
        {unit && <TeachingTeamAllocationTable unit={unit}/>}
      </Container>  
      </>
    );
  };
  
    return (
      <Container>
        <DataTables data={data} />
      </Container>
    );
  };
  
  export default Main;