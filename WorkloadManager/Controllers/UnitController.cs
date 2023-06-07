using System;
using Microsoft.AspNetCore.Mvc;
using WorkloadManager.Models;
using System.Text.Json;
using System.Text;
using System.Xml.Linq;
using MySql.Data.MySqlClient;

namespace WorkloadManager.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UnitController : Controller
    {
        public List<Unit> units;
        public List<User> users;
        private MySqlConnection conn;
        private IConfiguration _configuration;
        private string connString;

        public UnitController(IConfiguration configuration)
        {
            // Connection string
            //string connStr = "server=127.0.0.1;uid=root;pwd=WorkloadTracker$2023!;"; // Note: It contains the password used to setup the DB
            //MySqlConnection conn = new MySqlConnection(connStr);
            _configuration = configuration;
            conn = new();
            connString = configuration.GetConnectionString("DefaultConnection");
            conn.ConnectionString = connString;

            //INSTANTIATING Units OBJECTS BY READING ROWS FROM units TABLE
            try
            {
                //Open the connection to the MySQL server
                conn.Open();

                string sql = "SELECT * FROM units"; //Constructing MySQL query
                MySqlCommand cmd = new MySqlCommand(sql, conn); //Instantiating MySQLCommand object, linking the command and connection string
                MySqlDataReader unitsreader = cmd.ExecuteReader(); //Instantiating the DataEReader object which contains the output of the query

                units = new List<Unit>(); //Instantiating a list of units, which will contain the units from the database
                users = new List<User>(); //instantiating a list of users, which will be used to obtain staff id for staff names

                while (unitsreader.Read())
                {
                    Unit unit = new Unit(); //Instantiating a unit object to store the unit info

                    //Reading the row, column by column
                    unit.code = unitsreader.GetString("unit_code"); //passing the column name, refer to table schema above
                    unit.name = unitsreader.GetString("unit_name");
                    unit.teachingWeeks = unitsreader.GetInt32("teaching_weeks");
                    unit.creditPoints = unitsreader.GetInt32("credit_points");
                    unit.coordinator = unitsreader.IsDBNull(unitsreader.GetOrdinal("coordinator")) ? null : unitsreader.GetString("coordinator");
                    unit.workloadParameter = unitsreader.GetString("workload_parameter");
                    unit.studyPeriod = unitsreader.GetString("study_period");
                    unit.plannedHeadCount = unitsreader.GetInt32("planned_head_count");
                    unit.location = unitsreader.GetString("location");

                    //######################
                    //PROJECT INFO OF A UNIT
                    ProjectUnit projectUnit = new ProjectUnit(); //Instantiating ProjectUnit object
                    projectUnit.isProjectUnit = unitsreader.GetBoolean("project_unit");
                    projectUnit.noStudentsPerProject = unitsreader.IsDBNull(unitsreader.GetOrdinal("students_per_project")) ? 0 : unitsreader.GetInt32("students_per_project");
                    projectUnit.noProjects = unitsreader.IsDBNull(unitsreader.GetOrdinal("number_of_projects")) ? 0 : unitsreader.GetInt32("number_of_projects");
                    projectUnit.parameter = unitsreader.IsDBNull(unitsreader.GetOrdinal("project_parameter")) ? 0 : unitsreader.GetFloat("project_parameter");

                    //Add to the unit
                    unit.projectUnit = projectUnit; //Setting the units project

                    units.Add(unit);

                }
                unitsreader.Close();


                MySqlDataReader tdsreader;
                for (int i = 0; i < units.Count; i++)
                {
                    List<StandardTD> standardTDs = new List<StandardTD>();
                    List<Fieldwork> fieldworks = new List<Fieldwork>();

                    sql = "SELECT * FROM teaching_delivery WHERE unit_code = '" + units[i].code + "' AND study_period = '" + units[i].studyPeriod + "'";
                    cmd = new MySqlCommand(sql, conn);
                    tdsreader = cmd.ExecuteReader();

                    while (tdsreader.Read())
                    {
                        if (tdsreader.GetString("type") == "Fieldwork" || tdsreader.GetString("type") == "Practical")
                        {
                            Fieldwork fieldwork = new Fieldwork();

                            fieldwork.type = tdsreader.GetString("type");
                            fieldwork.tuitionPatternFrequency = tdsreader.GetString("tuition_pattern_frequency");
                            fieldwork.tuitionPatternHours = tdsreader.GetInt32("tuition_pattern_hours");
                            //fieldwork.staffAllocatedHours = tdsreader.GetInt32("allocated_hours");
                            fieldwork.noStaff = tdsreader.GetInt32("num_staff");
                            fieldwork.hoursPerStaff = tdsreader.GetInt32("hours_per_staff");
                            fieldworks.Add(fieldwork); //Add to the list

                        }
                        else
                        {
                            StandardTD standardTD = new StandardTD();

                            standardTD.type = tdsreader.GetString("type");
                            standardTD.tuitionPatternFrequency = tdsreader.GetString("tuition_pattern_frequency");
                            standardTD.tuitionPatternHours = tdsreader.GetInt32("tuition_pattern_hours");
                            //standardTD.staffAllocatedHours = tdsreader.GetInt32("allocated_hours");
                            standardTD.totalCount = tdsreader.GetInt32("total_count");
                            standardTD.duplicateClasses = tdsreader.GetInt32("duplicate_classes");
                            standardTDs.Add(standardTD); //Add to the list
                        }
                    }
                    units[i].standardTDs = standardTDs;
                    units[i].fieldworks = fieldworks;

                    tdsreader.Close();
                }

                MySqlDataReader trdsreader;
                for (int i = 0; i < units.Count; i++)
                {
                    TeachingRelatedDuties trds = new TeachingRelatedDuties();
                    sql = "SELECT * FROM teaching_related_duty WHERE unit_code = '" + units[i].code + "' AND study_period = '" + units[i].studyPeriod + "'";
                    cmd = new MySqlCommand(sql, conn);
                    trdsreader = cmd.ExecuteReader();

                    while (trdsreader.Read())
                    {
                        trds.unitCoordination = trdsreader.GetFloat("unit_coordination");
                        trds.preparation = trdsreader.GetFloat("preparation");
                        trds.consultation = trdsreader.GetFloat("consultation");
                        trds.marking = trdsreader.GetFloat("marking");
                        trds.moderation = trdsreader.GetFloat("moderation");
                        trds.coAssessorDuties = trdsreader.GetFloat("co_assesor_duties");
                        trds.other = trdsreader.GetFloat("other");
                    }

                    //Add to the unit
                    units[i].teachingRelatedDuties = trds;
                    trdsreader.Close();

                }


                MySqlDataReader staffreader;
                for (int i = 0; i < units.Count; i++)
                {
                    List<TeachingStaff> teachingStaff = new List<TeachingStaff>();
                    sql = "SELECT * FROM teaching_staff WHERE unit_code = '" + units[i].code + "' AND study_period = '" + units[i].studyPeriod + "'";
                    cmd = new MySqlCommand(sql, conn);
                    staffreader = cmd.ExecuteReader();

                    while (staffreader.Read())
                    {
                        TeachingStaff staff = new TeachingStaff();
                        staff.staffName = staffreader.GetString("staff_name");
                        staff.staffID = staffreader.GetString("staff_id");
                        teachingStaff.Add(staff);
                    }

                    units[i].teachingStaff = teachingStaff;
                    staffreader.Close();
                }


                for (int i = 0; i < units.Count; i++)
                {
                    MySqlDataReader tdAllocreader;

                    for (int j = 0; j < units[i].teachingStaff.Count; j++)
                    {
                        //TD ALLOCATIONS for staff member
                        List<TeachingDelivery> tdAllocations = new List<TeachingDelivery>();
                        sql = "SELECT * FROM td_allocations WHERE unit_code = '" + units[i].code + "' AND study_period = '" + units[i].studyPeriod + "' AND staff_id = '" + units[i].teachingStaff[j].staffID + "'";
                        cmd = new MySqlCommand(sql, conn);
                        tdAllocreader = cmd.ExecuteReader();

                        while (tdAllocreader.Read())
                        {
                            TeachingDelivery tdAlloc = new TeachingDelivery();
                            tdAlloc.type = tdAllocreader.GetString("type");
                            if (!tdAllocreader.IsDBNull(tdAllocreader.GetOrdinal("allocated_hours")))
                            {
                                tdAlloc.total = tdAllocreader.GetInt32("allocated_hours");
                            }
                            else
                            {
                                // Handle the case when "allocated_hours" is null
                                // You can assign a default value or handle it based on your requirements
                                tdAlloc.total = 0; // For example, assigning zero as a default value
                            }
                            tdAllocations.Add(tdAlloc); // Add to the list
                        }
                        tdAllocreader.Close();
                        units[i].teachingStaff[j].tdAllocations = tdAllocations;
                    }
                }

                for (int i = 0; i < units.Count; i++)
                {
                    MySqlDataReader trdAllocreader;

                    for (int j = 0; j < units[i].teachingStaff.Count; j++)
                    {
                        //TRD ALLOCATIONS for staff member
                        TeachingRelatedDuties trdAllocations = new TeachingRelatedDuties();
                        sql = "SELECT * FROM trd_allocations WHERE unit_code = '" + units[i].code + "' AND study_period = '" + units[i].studyPeriod + "' AND staff_id = '" + units[i].teachingStaff[j].staffID + "'";
                        cmd = new MySqlCommand(sql, conn);
                        trdAllocreader = cmd.ExecuteReader();

                        while (trdAllocreader.Read())
                        {
                            trdAllocations.unitCoordination = trdAllocreader.GetFloat("unit_coordination");
                            trdAllocations.preparation = trdAllocreader.GetFloat("preparation");
                            trdAllocations.consultation = trdAllocreader.GetFloat("consultation");
                            trdAllocations.marking = trdAllocreader.GetFloat("marking");
                            trdAllocations.moderation = trdAllocreader.GetFloat("moderation");
                            trdAllocations.coAssessorDuties = trdAllocreader.GetFloat("co_assessor_duties");
                            trdAllocations.other = trdAllocreader.GetFloat("other");
                        }
                        trdAllocreader.Close();

                        //Add TD Allocations to staff
                        units[i].teachingStaff[j].trdAllocations = trdAllocations;
                    }
                }

                //assign the total allocated hours for every unit
                for (int i = 0; i < units.Count; i++)
                {
                    units[i].totalAllocatedHours = units[i].GetTotalAllocatedHours();
                }



                //add the users from the database
                sql = "SELECT * FROM users"; //Constructing MySQL query
                cmd = new MySqlCommand(sql, conn); //Instantiating MySQLCommand object, linking the command and connection string
                MySqlDataReader userReader = cmd.ExecuteReader(); //Instantiating the DataEReader object which contains the output of the query

                while (userReader.Read())
                {
                    User user = new User();
                    user.name = userReader.GetString("name");
                    user.staffID = userReader.GetString("staff_id");

                    users.Add(user);
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            finally
            {
                conn.Close();
            }

        }

        [HttpGet("GetUnitByCode/{unitCode}")]
        public IActionResult GetUnitByCode(string unitCode) //need to add query param 
        {

            Unit returnUnit = new Unit();

            for (int i = 0; i < units.Count; i++)
            {
                if (unitCode.Equals(units[i].code))
                {
                    returnUnit = units[i];
                }
            }
            return Ok(returnUnit);
        }

        [HttpGet("GetUnits")]
        public IActionResult GetUnits()
        {
            return Ok(units);
        }

        [HttpGet("GetUnitByStaff/{staffID}")]
        public IActionResult GetUnitByStaff(string staffID)
        {
            List<Unit> staffUnits = new List<Unit>();
            string staffName = "";

            for (int i=0; i<users.Count; i++)
            {
                if (users[i].staffID.Equals(staffID))
                {
                    staffName = users[i].name;
                }
            }

            for (int i=0; i<units.Count; i++)
            {
                if (units[i].coordinator.Equals(staffName))
                {
                    staffUnits.Add(units[i]);
                }
                else
                {

                    for (int j = 0; j < units[i].teachingStaff.Count; j++)
                    {
                        if (staffID.Equals(units[i].teachingStaff[j].staffID))
                        {
                            staffUnits.Add(units[i]);
                        }
                    }
                }
            }

            return Ok(staffUnits);
        }


        [HttpPost]
        public IActionResult CreateUnit([FromBody] Unit unitDTO)
        {
            units.Add(unitDTO);

            try
            {
                conn.Open();
                Console.WriteLine("Creating unit: " + unitDTO);
                //check that the unit coordinator does exist
                bool doesExist = false;
                for (int i = 0; i < users.Count; i++)
                {
                    if (users[i].name == unitDTO.coordinator)
                    {
                        doesExist = true;
                    }
                }

                if (doesExist == false)
                {
                    return BadRequest("Name: " + unitDTO.coordinator + " was not found"); //name was not found in database
                }


                //check that all staff members do exist

                for (int i = 0; i < unitDTO.teachingStaff.Count; i++)
                {
                    string staffName = unitDTO.teachingStaff[i].staffName;
                    doesExist = false;

                    if (!staffName.Equals(""))
                    {

                        for (int j = 0; j < users.Count; j++) //checking every name in the unitDTO
                        {
                            if (users[j].name == staffName)
                            {
                                doesExist = true;
                            }
                        }
                        if (doesExist == false)
                        {
                            return BadRequest("Staff Name: " + staffName + " was not found"); //name was not found in database
                        }
                    }
                }

                string sql = "SELECT * FROM units WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                MySqlDataReader unitsreader = cmd.ExecuteReader();

                //Does the unit already exist?
                if (!unitsreader.HasRows)
                {
                    //FALSE - Add the unit
                    unitsreader.Close();
                    string insert = "INSERT INTO units" +
                    "(unit_code, unit_name, teaching_weeks, credit_points, coordinator, workload_parameter, study_period," +
                    "planned_head_count, location, project_unit, students_per_project, number_of_projects, project_parameter) VALUES" +
                    "(@unitCode, @unitName, @teachingWeeks, @creditPoints, @coordinator, @workloadParameter, @studyPeriod," +
                    "@plannedHeadCount, @location, @projectUnit, @studentsPerProject, @numberOfProjects, @projectParameter)";

                    cmd = new MySqlCommand(insert, conn);
                    cmd.Parameters.AddWithValue("@unitName", unitDTO.name);
                    cmd.Parameters.AddWithValue("@teachingWeeks", unitDTO.teachingWeeks);
                    cmd.Parameters.AddWithValue("@creditPoints", unitDTO.creditPoints);
                    cmd.Parameters.AddWithValue("@coordinator", unitDTO.coordinator);
                    cmd.Parameters.AddWithValue("@workloadParameter", unitDTO.workloadParameter);
                    cmd.Parameters.AddWithValue("@plannedHeadCount", unitDTO.plannedHeadCount);
                    cmd.Parameters.AddWithValue("@location", unitDTO.location);
                    cmd.Parameters.AddWithValue("@projectUnit", (bool)unitDTO.projectUnit.isProjectUnit ? 1 : 0);
                    cmd.Parameters.AddWithValue("@studentsPerProject", unitDTO.projectUnit.noStudentsPerProject);
                    cmd.Parameters.AddWithValue("@numberOfProjects", unitDTO.projectUnit.noProjects);
                    cmd.Parameters.AddWithValue("@projectParameter", unitDTO.projectUnit.parameter);
                    cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                    cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);

                    int rowsAffected = cmd.ExecuteNonQuery(); // this should be equal to 1
                    if (rowsAffected != 1)
                    {
                        //Output failed to add unit
                        Console.WriteLine("Failed to add unit");
                    }

                    else
                    {
                        //Add Teaching deliveries
                        //Add Standard TDs
                        insert = "INSERT INTO teaching_delivery " +
                        "(unit_code, study_period, type, tuition_pattern_frequency, tuition_pattern_hours, allocated_hours, " +
                        "total_count, duplicate_classes) VALUES " +
                        "(@unitCode, @studyPeriod, @type, @tuitionPatternFrequency, @tuitionPatternHours, @allocatedHours, " +
                        "@totalCount, @duplicateClasses)";

                        foreach (StandardTD td in unitDTO.standardTDs)
                        {
                            cmd = new MySqlCommand(insert, conn);
                            cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                            cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                            cmd.Parameters.AddWithValue("@type", td.type);
                            cmd.Parameters.AddWithValue("@tuitionPatternFrequency", td.tuitionPatternFrequency);
                            cmd.Parameters.AddWithValue("@tuitionPatternHours", td.tuitionPatternHours);
                            cmd.Parameters.AddWithValue("@allocatedHours", td.staffAllocatedHours);
                            cmd.Parameters.AddWithValue("@totalCount", td.totalCount);
                            cmd.Parameters.AddWithValue("@duplicateClasses", td.duplicateClasses);
                            cmd.ExecuteNonQuery();
                        }

                        //Add Fieldwork TDs
                        insert = "INSERT INTO teaching_delivery " +
                        "(unit_code, study_period, type, tuition_pattern_frequency, tuition_pattern_hours, allocated_hours, " +
                        "num_staff, hours_per_staff) VALUES " +
                        "(@unitCode, @studyPeriod, @type, @tuitionPatternFrequency, @tuitionPatternHours, @allocatedHours, " +
                        "@numStaff, @hoursPerStaff)";

                        foreach (Fieldwork fieldwork in unitDTO.fieldworks)
                        {
                            cmd = new MySqlCommand(insert, conn);
                            cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                            cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                            cmd.Parameters.AddWithValue("@type", fieldwork.type);
                            cmd.Parameters.AddWithValue("@tuitionPatternFrequency", fieldwork.tuitionPatternFrequency);
                            cmd.Parameters.AddWithValue("@tuitionPatternHours", fieldwork.tuitionPatternHours);
                            cmd.Parameters.AddWithValue("@allocatedHours", fieldwork.staffAllocatedHours);
                            cmd.Parameters.AddWithValue("@numStaff", fieldwork.noStaff);
                            cmd.Parameters.AddWithValue("@hoursPerStaff", fieldwork.hoursPerStaff);
                            cmd.ExecuteNonQuery();
                        }

                        //Add Teaching related duties
                        insert = "INSERT INTO teaching_related_duty " +
                        "(unit_code, study_period, unit_coordination, preparation, consultation, marking, moderation, co_assesor_duties, other) VALUES " +
                        "(@unitCode, @studyPeriod, @unitCoordination, @preparation, @consultation, @marking, @moderation, @coAssesorDuties, @other)";

                        cmd = new MySqlCommand(insert, conn);
                        cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                        cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                        cmd.Parameters.AddWithValue("@unitCoordination", unitDTO.teachingRelatedDuties.unitCoordination);
                        cmd.Parameters.AddWithValue("@preparation", unitDTO.teachingRelatedDuties.preparation);
                        cmd.Parameters.AddWithValue("@consultation", unitDTO.teachingRelatedDuties.consultation);
                        cmd.Parameters.AddWithValue("@marking", unitDTO.teachingRelatedDuties.marking);
                        cmd.Parameters.AddWithValue("@moderation", unitDTO.teachingRelatedDuties.moderation);
                        cmd.Parameters.AddWithValue("@coAssesorDuties", unitDTO.teachingRelatedDuties.coAssessorDuties);
                        cmd.Parameters.AddWithValue("@other", unitDTO.teachingRelatedDuties.other);
                        cmd.ExecuteNonQuery();

                        //Add Teaching staff
                        insert = "INSERT INTO teaching_staff " +
                        "(staff_id, unit_code, study_period, staff_name) VALUES " +
                        "(@staffId, @unitCode, @studyPeriod, @staffName)";


                        string currStaffID;
                        for (int i = 0; i < unitDTO.teachingStaff.Count; i++)
                        {
                            //Add Teaching staff
                            insert = "INSERT INTO teaching_staff " +
                            "(staff_id, unit_code, study_period, staff_name) VALUES " +
                            "(@staffId, @unitCode, @studyPeriod, @staffName)";

                            string currStaffName = unitDTO.teachingStaff[i].staffName;
                            if (!currStaffName.Equals("")) //valid staff name
                            {
                                //finf ther corresponding staff id
                                for (int j = 0; j < users.Count; j++)
                                {
                                    //insert into teaching staff table
                                    if (users[j].name.Equals(currStaffName))
                                    {
                                        //insert into teaching staff table
                                        currStaffID = users[j].staffID;
                                        cmd = new MySqlCommand(insert, conn);
                                        cmd.Parameters.AddWithValue("@staffId", currStaffID);
                                        cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                                        cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                                        cmd.Parameters.AddWithValue("@staffName", currStaffName);
                                        cmd.ExecuteNonQuery();

                                        //insert into td table
                                        insert = "INSERT INTO td_allocations " +
                                                            "(staff_id, unit_code, study_period, type, allocated_hours) VALUES " +
                                                            "(@staffId, @unitCode, @studyPeriod, @type, @allocatedHours)";

                                        for (int k = 0; k < unitDTO.teachingStaff[i].tdAllocations.Count; k++)
                                        {
                                            //unitDTO.teachingStaff[i].tdAllocations[k].type);
                                            cmd = new MySqlCommand(insert, conn);
                                            cmd.Parameters.AddWithValue("@staffId", currStaffID);
                                            cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                                            cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                                            cmd.Parameters.AddWithValue("@type", unitDTO.teachingStaff[i].tdAllocations[k].type);
                                            cmd.Parameters.AddWithValue("@allocatedHours", unitDTO.teachingStaff[i].tdAllocations[k].total);
                                            cmd.ExecuteNonQuery();
                                        }

                                        //insert into trd table
                                        insert = "INSERT INTO trd_allocations " +
                                                "(staff_id, unit_code, study_period, unit_coordination, preparation, consultation, marking, moderation, co_assessor_duties, other) VALUES " +
                                                "(@staffId, @unitCode, @studyPeriod, @unitCoordination, @preparation, @consultation, @marking, @moderation, @coAssessorDuties, @other)";

                                        cmd = new MySqlCommand(insert, conn);
                                        cmd.Parameters.AddWithValue("@staffId", currStaffID);
                                        cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                                        cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                                        cmd.Parameters.AddWithValue("@unitCoordination", unitDTO.teachingStaff[i].trdAllocations.unitCoordination);
                                        cmd.Parameters.AddWithValue("@preparation", unitDTO.teachingStaff[i].trdAllocations.preparation);
                                        cmd.Parameters.AddWithValue("@consultation", unitDTO.teachingStaff[i].trdAllocations.consultation);
                                        cmd.Parameters.AddWithValue("@marking", unitDTO.teachingStaff[i].trdAllocations.marking);
                                        cmd.Parameters.AddWithValue("@moderation", unitDTO.teachingStaff[i].trdAllocations.moderation);
                                        cmd.Parameters.AddWithValue("@coAssessorDuties", unitDTO.teachingStaff[i].trdAllocations.coAssessorDuties);
                                        cmd.Parameters.AddWithValue("@other", unitDTO.teachingStaff[i].trdAllocations.other);
                                        cmd.ExecuteNonQuery();
                                    }
                                }
                            }

                        }

                    }

                }
                else
                {
                    //TRUE - Output unit already exists
                    Console.WriteLine("Unit already exists");
                }
                return Ok();
            }

            catch (Exception e)
            {
                return BadRequest();
            }

            finally
            {
                conn.Close();
            }

        }


        [HttpDelete("{unitCode}/{studyPeriod}")]
        public IActionResult DeleteUnit(string unitCode, string studyPeriod)
        {
            
            try
            {
                Console.WriteLine("Deleting the unit: " + unitCode); 

                conn.Open();

                // Check if the unit exists
                string selectUnitSql = "SELECT * FROM units WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand selectUnitCmd = new MySqlCommand(selectUnitSql, conn);
                selectUnitCmd.Parameters.AddWithValue("@unitCode", unitCode);
                selectUnitCmd.Parameters.AddWithValue("@studyPeriod", studyPeriod);
                MySqlDataReader unitReader = selectUnitCmd.ExecuteReader();

                if (!unitReader.HasRows)
                {
                    return NotFound(); // Unit not found
                }

                unitReader.Close();

                // Delete from teaching_delivery table
                string deleteTeachingDeliverySql = "DELETE FROM teaching_delivery WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand deleteTeachingDeliveryCmd = new MySqlCommand(deleteTeachingDeliverySql, conn);
                deleteTeachingDeliveryCmd.Parameters.AddWithValue("@unitCode", unitCode);
                deleteTeachingDeliveryCmd.Parameters.AddWithValue("@studyPeriod", studyPeriod);
                deleteTeachingDeliveryCmd.ExecuteNonQuery();

                // Delete from teaching_staff table
                string deleteTeachingStaffSql = "DELETE FROM teaching_staff WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand deleteTeachingStaffCmd = new MySqlCommand(deleteTeachingStaffSql, conn);
                deleteTeachingStaffCmd.Parameters.AddWithValue("@unitCode", unitCode);
                deleteTeachingStaffCmd.Parameters.AddWithValue("@studyPeriod", studyPeriod);
                deleteTeachingStaffCmd.ExecuteNonQuery();

                // Delete from td_allocations table
                string deleteTDAllocationsSql = "DELETE FROM td_allocations WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand deleteTDAllocationsCmd = new MySqlCommand(deleteTDAllocationsSql, conn);
                deleteTDAllocationsCmd.Parameters.AddWithValue("@unitCode", unitCode);
                deleteTDAllocationsCmd.Parameters.AddWithValue("@studyPeriod", studyPeriod);
                deleteTDAllocationsCmd.ExecuteNonQuery();

                // Delete from trd_allocations table
                string deleteTRDAllocationsSql = "DELETE FROM trd_allocations WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand deleteTRDAllocationsCmd = new MySqlCommand(deleteTRDAllocationsSql, conn);
                deleteTRDAllocationsCmd.Parameters.AddWithValue("@unitCode", unitCode);
                deleteTRDAllocationsCmd.Parameters.AddWithValue("@studyPeriod", studyPeriod);
                deleteTRDAllocationsCmd.ExecuteNonQuery();

                // Delete from teaching_related_duty table
                string deleteTeachingRelatedDutySql = "DELETE FROM teaching_related_duty WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand deleteTeachingRelatedDutyCmd = new MySqlCommand(deleteTeachingRelatedDutySql, conn);
                deleteTeachingRelatedDutyCmd.Parameters.AddWithValue("@unitCode", unitCode);
                deleteTeachingRelatedDutyCmd.Parameters.AddWithValue("@studyPeriod", studyPeriod);
                deleteTeachingRelatedDutyCmd.ExecuteNonQuery();

                // Delete from units table
                string deleteUnitSql = "DELETE FROM units WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand deleteUnitCmd = new MySqlCommand(deleteUnitSql, conn);
                deleteUnitCmd.Parameters.AddWithValue("@unitCode", unitCode);
                deleteUnitCmd.Parameters.AddWithValue("@studyPeriod", studyPeriod);
                deleteUnitCmd.ExecuteNonQuery();

                return NoContent(); // Deletion successful
            }
            catch (Exception e)
            {
                return BadRequest(); // Error occurred
            }


        }



        [HttpPut]
        public IActionResult UpdateUnit([FromBody] Unit unitDTO)
        {
            try
            {
                conn.Open();
                Console.WriteLine("Updating unit: " + unitDTO.code);

                bool doesExist = false;
                for (int i = 0; i < users.Count; i++)
                {
                    if (users[i].name == unitDTO.coordinator)
                    {
                        doesExist = true;
                    }
                }

                if (doesExist == false)
                {
                    return BadRequest("Name: " + unitDTO.coordinator + " was not found"); //name was not found in database
                }


                //check that all staff members do exist

                for (int i = 0; i < unitDTO.teachingStaff.Count; i++)
                {
                    string staffName = unitDTO.teachingStaff[i].staffName;
                    doesExist = false;

                    if (!staffName.Equals(""))
                    {

                        for (int j = 0; j < users.Count; j++) //checking every name in the unitDTO
                        {
                            if (users[j].name == staffName)
                            {
                                doesExist = true;
                            }
                        }
                        if (doesExist == false)
                        {
                            return BadRequest("Staff Name: " + staffName + " was not found"); //name was not found in database
                        }
                    }
                }

                // Update the unit
                string updateSql = "UPDATE units SET " +
                    "unit_name = @unitName, " +
                    "teaching_weeks = @teachingWeeks, " +
                    "credit_points = @creditPoints, " +
                    "coordinator = @coordinator, " +
                    "workload_parameter = @workloadParameter, " +
                    "planned_head_count = @plannedHeadCount, " +
                    "location = @location, " +
                    "project_unit = @projectUnit, " +
                    "students_per_project = @studentsPerProject, " +
                    "number_of_projects = @numberOfProjects, " +
                    "project_parameter = @projectParameter " +
                    "WHERE unit_code = @unitCode AND study_period = @studyPeriod";

                MySqlCommand cmd = new MySqlCommand(updateSql, conn);
                cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                cmd.Parameters.AddWithValue("@unitName", unitDTO.name);
                cmd.Parameters.AddWithValue("@teachingWeeks", unitDTO.teachingWeeks);
                cmd.Parameters.AddWithValue("@creditPoints", unitDTO.creditPoints);
                cmd.Parameters.AddWithValue("@coordinator", unitDTO.coordinator);
                cmd.Parameters.AddWithValue("@workloadParameter", unitDTO.workloadParameter);
                cmd.Parameters.AddWithValue("@plannedHeadCount", unitDTO.plannedHeadCount);
                cmd.Parameters.AddWithValue("@location", unitDTO.location);
                cmd.Parameters.AddWithValue("@projectUnit", (bool)unitDTO.projectUnit.isProjectUnit ? 1 : 0);
                cmd.Parameters.AddWithValue("@studentsPerProject", unitDTO.projectUnit.noStudentsPerProject);
                cmd.Parameters.AddWithValue("@numberOfProjects", unitDTO.projectUnit.noProjects);
                cmd.Parameters.AddWithValue("@projectParameter", unitDTO.projectUnit.parameter);
                cmd.ExecuteNonQuery();

                //Add Teaching deliveries
                // Update the teaching deliveries in the teaching_delivery table
                string updateTeachingDeliverySql = "UPDATE teaching_delivery SET " +
                    "tuition_pattern_frequency = @tuitionPatternFrequency, " +
                    "tuition_pattern_hours = @tuitionPatternHours, " +
                    "allocated_hours = @allocatedHours, " +
                    "total_count = @totalCount, " +
                    "duplicate_classes = @duplicateClasses, " +
                    "num_staff = @numStaff, " +
                    "hours_per_staff = @hoursPerStaff " +
                    "WHERE unit_code = @unitCode AND study_period = @studyPeriod AND type = @type";

                MySqlCommand updateTeachingDeliveryCmd = new MySqlCommand(updateTeachingDeliverySql, conn);

                foreach (StandardTD td in unitDTO.standardTDs)
                {
                    updateTeachingDeliveryCmd.Parameters.Clear();
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@type", td.type);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@tuitionPatternFrequency", td.tuitionPatternFrequency);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@tuitionPatternHours", td.tuitionPatternHours);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@allocatedHours", td.staffAllocatedHours);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@totalCount", td.totalCount);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@duplicateClasses", td.duplicateClasses);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@numStaff", null); // Set to null for StandardTD
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@hoursPerStaff", null); // Set to null for StandardTD
                    int rowsAffected = updateTeachingDeliveryCmd.ExecuteNonQuery();

                    if (rowsAffected == 0) { }
                }

                foreach (Fieldwork fieldwork in unitDTO.fieldworks)
                {
                    updateTeachingDeliveryCmd.Parameters.Clear();
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@type", fieldwork.type);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@tuitionPatternFrequency", fieldwork.tuitionPatternFrequency);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@tuitionPatternHours", fieldwork.tuitionPatternHours);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@allocatedHours", fieldwork.staffAllocatedHours);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@totalCount", null); // Set to null for Fieldwork
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@duplicateClasses", null); // Set to null for Fieldwork
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@numStaff", fieldwork.noStaff);
                    updateTeachingDeliveryCmd.Parameters.AddWithValue("@hoursPerStaff", fieldwork.hoursPerStaff);
                    updateTeachingDeliveryCmd.ExecuteNonQuery();
                }


                string updateTRDTableSql = "UPDATE teaching_related_duty SET " +
                            "unit_coordination = @unitCoordination, " +
                            "preparation = @preparation, " +
                            "consultation = @consultation, " +
                            "marking = @marking, " +
                            "moderation = @moderation, " +
                            "co_assesor_duties = @coAssessorDuties, " +
                            "other = @other " +
                            "WHERE unit_code = @unitCode AND study_period = @studyPeriod";

                cmd = new MySqlCommand(updateTRDTableSql, conn);
                cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                cmd.Parameters.AddWithValue("@unitCoordination", unitDTO.teachingRelatedDuties.unitCoordination);
                cmd.Parameters.AddWithValue("@preparation", unitDTO.teachingRelatedDuties.preparation);
                cmd.Parameters.AddWithValue("@consultation", unitDTO.teachingRelatedDuties.consultation);
                cmd.Parameters.AddWithValue("@marking", unitDTO.teachingRelatedDuties.marking);
                cmd.Parameters.AddWithValue("@moderation", unitDTO.teachingRelatedDuties.moderation);
                cmd.Parameters.AddWithValue("@coAssessorDuties", unitDTO.teachingRelatedDuties.coAssessorDuties);
                cmd.Parameters.AddWithValue("@other", unitDTO.teachingRelatedDuties.other);
                cmd.ExecuteNonQuery();


                // Delete from teaching_staff table
                string deleteTeachingStaffSql = "DELETE FROM teaching_staff WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand deleteTeachingStaffCmd = new MySqlCommand(deleteTeachingStaffSql, conn);
                deleteTeachingStaffCmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                deleteTeachingStaffCmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                deleteTeachingStaffCmd.ExecuteNonQuery();

                // Delete from td_allocations table
                string deleteTDAllocationsSql = "DELETE FROM td_allocations WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand deleteTDAllocationsCmd = new MySqlCommand(deleteTDAllocationsSql, conn);
                deleteTDAllocationsCmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                deleteTDAllocationsCmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                deleteTDAllocationsCmd.ExecuteNonQuery();

                // Delete from trd_allocations table
                string deleteTRDAllocationsSql = "DELETE FROM trd_allocations WHERE unit_code = @unitCode AND study_period = @studyPeriod";
                MySqlCommand deleteTRDAllocationsCmd = new MySqlCommand(deleteTRDAllocationsSql, conn);
                deleteTRDAllocationsCmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                deleteTRDAllocationsCmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                deleteTRDAllocationsCmd.ExecuteNonQuery();

                string currStaffID; 
                for (int i = 0; i < unitDTO.teachingStaff.Count; i++)
                {
                    //Add Teaching staff
                    string insert = "INSERT INTO teaching_staff " +
                    "(staff_id, unit_code, study_period, staff_name) VALUES " +
                    "(@staffId, @unitCode, @studyPeriod, @staffName)";

                    string currStaffName = unitDTO.teachingStaff[i].staffName;
                    if (!currStaffName.Equals("")) //valid staff name
                    {
                        //finf ther corresponding staff id
                        for (int j = 0; j < users.Count; j++)
                        {
                            //insert into teaching staff table
                            if (users[j].name.Equals(currStaffName))
                            {
                                //insert into teaching staff table
                                currStaffID = users[j].staffID;
                                cmd = new MySqlCommand(insert, conn);
                                cmd.Parameters.AddWithValue("@staffId", currStaffID);
                                cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                                cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                                cmd.Parameters.AddWithValue("@staffName", currStaffName);
                                cmd.ExecuteNonQuery();

                                //insert into td table
                                insert = "INSERT INTO td_allocations " +
                                                    "(staff_id, unit_code, study_period, type, allocated_hours) VALUES " +
                                                    "(@staffId, @unitCode, @studyPeriod, @type, @allocatedHours)";

                                for (int k = 0; k < unitDTO.teachingStaff[i].tdAllocations.Count; k++)
                                {
                                    //unitDTO.teachingStaff[i].tdAllocations[k].type);
                                    cmd = new MySqlCommand(insert, conn);
                                    cmd.Parameters.AddWithValue("@staffId", currStaffID);
                                    cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                                    cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                                    cmd.Parameters.AddWithValue("@type", unitDTO.teachingStaff[i].tdAllocations[k].type);
                                    cmd.Parameters.AddWithValue("@allocatedHours", unitDTO.teachingStaff[i].tdAllocations[k].total);
                                    cmd.ExecuteNonQuery();
                                }

                                //insert into trd table
                                insert = "INSERT INTO trd_allocations " +
                                        "(staff_id, unit_code, study_period, unit_coordination, preparation, consultation, marking, moderation, co_assessor_duties, other) VALUES " +
                                        "(@staffId, @unitCode, @studyPeriod, @unitCoordination, @preparation, @consultation, @marking, @moderation, @coAssessorDuties, @other)";

                                cmd = new MySqlCommand(insert, conn);
                                cmd.Parameters.AddWithValue("@staffId", currStaffID);
                                cmd.Parameters.AddWithValue("@unitCode", unitDTO.code);
                                cmd.Parameters.AddWithValue("@studyPeriod", unitDTO.studyPeriod);
                                cmd.Parameters.AddWithValue("@unitCoordination", unitDTO.teachingStaff[i].trdAllocations.unitCoordination);
                                cmd.Parameters.AddWithValue("@preparation", unitDTO.teachingStaff[i].trdAllocations.preparation);
                                cmd.Parameters.AddWithValue("@consultation", unitDTO.teachingStaff[i].trdAllocations.consultation);
                                cmd.Parameters.AddWithValue("@marking", unitDTO.teachingStaff[i].trdAllocations.marking);
                                cmd.Parameters.AddWithValue("@moderation", unitDTO.teachingStaff[i].trdAllocations.moderation);
                                cmd.Parameters.AddWithValue("@coAssessorDuties", unitDTO.teachingStaff[i].trdAllocations.coAssessorDuties);
                                cmd.Parameters.AddWithValue("@other", unitDTO.teachingStaff[i].trdAllocations.other);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                }




                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest();
            }
            finally
            {
                conn.Close();
            }
        }


    }


}
