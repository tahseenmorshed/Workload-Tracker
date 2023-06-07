using System;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using WorkloadManager.Models;

namespace WorkloadManager.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class UserController : Controller
	{
        private MySqlConnection conn;
        private IConfiguration _configuration;
        private string connString;
		public List<User> users; 

        public UserController(IConfiguration configuration)
		{
            _configuration = configuration;
            connString = configuration.GetConnectionString("DefaultConnection");
            conn = new(connString);

            users = new List<User>(); 

            try
            {
                conn.Open();

                string sql = "SELECT * from users";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader userReader = cmd.ExecuteReader();

                while (userReader.Read())
                {
                    User user = new User();
                    user.email = userReader.GetString("email");
                    user.name = userReader.GetString("name");
                    user.staffID = userReader.GetString("staff_id");
                    user.discipline = userReader.GetString("discipline"); 
                    user.password = userReader.GetString("password");
                    user.workFunction = userReader.GetString("work_function");
                    user.positionTitle = userReader.GetString("position_title");
                    user.occupancyType = userReader.GetString("occupancy_type");
                    users.Add(user);
                }
            }

            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            finally
            {
                conn.Close(); 
            }

        }

        [HttpDelete("{staffID}")]
        public IActionResult DeleteUser(string staffID)
        {
            Console.WriteLine("Deleting staff: " + staffID);

            try
            {
                conn.Open();
                string deleteSQL = "DELETE FROM td_allocations WHERE staff_id = @staffID";
                MySqlCommand cmd = new MySqlCommand(deleteSQL, conn);
                cmd.Parameters.AddWithValue("staffID", staffID);
                cmd.ExecuteNonQuery();

                deleteSQL = "DELETE FROM trd_allocations WHERE staff_id = @staffID";
                cmd = new MySqlCommand(deleteSQL, conn);
                cmd.Parameters.AddWithValue("staffID", staffID);
                cmd.ExecuteNonQuery();

                deleteSQL = "DELETE FROM teaching_staff WHERE staff_id = @staffID";
                cmd = new MySqlCommand(deleteSQL, conn);
                cmd.Parameters.AddWithValue("staffID", staffID);
                cmd.ExecuteNonQuery();


                deleteSQL = "DELETE FROM users WHERE staff_id = @staffID";
                cmd = new MySqlCommand(deleteSQL, conn);
                cmd.Parameters.AddWithValue("staffID", staffID);
                cmd.ExecuteNonQuery();

                return Ok();
            }
            catch(Exception e)
            {
                Console.WriteLine("Exceotion " + e);
                return BadRequest();
            }
            finally
            {
                conn.Close();
            }

        }

        [HttpPost]
		public IActionResult CreateUser([FromBody] User user)
		{
            try
            {
                conn.Open();

                string command = "INSERT INTO users " +
                                 "(name, email, staff_id, password, discipline, position_title, work_function, occupancy_type) VALUES " +
                                 "(@name, @email, @staffID, @password, @discipline, @positionTitle, @workFunction, @occupancyType)";

                MySqlCommand cmd = new MySqlCommand(command, conn);
                cmd.Parameters.AddWithValue("@name", user.name);
                cmd.Parameters.AddWithValue("@email", user.email);
                cmd.Parameters.AddWithValue("@staffID", user.staffID);
                cmd.Parameters.AddWithValue("@password", user.password);
                cmd.Parameters.AddWithValue("@discipline", user.discipline);
                cmd.Parameters.AddWithValue("@positionTitle", user.positionTitle);
                cmd.Parameters.AddWithValue("@workFunction", user.workFunction);
                cmd.Parameters.AddWithValue("@occupancyType", user.occupancyType);
                cmd.ExecuteNonQuery();

                return Ok("done");
            }

            catch(Exception e)
            {
                Console.WriteLine("Exception occirred " + e);
                return BadRequest(); 
            }
            finally
            {
                conn.Close();
            }
		}

        [HttpGet("GetUsers")]
        public IActionResult GetUsers()
        {
            Console.WriteLine("Users: " + users);
            return Ok(users); 
        }

		[HttpGet("getUserByName/{name}")]
		public IActionResult GetUserByName(string name)
		{

			//FIND USER IN DATABASE
			return Ok();
		}
	}
}

