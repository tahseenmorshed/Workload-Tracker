using System;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using WorkloadManager.Models; 

namespace WorkloadManager.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class LoginController : Controller
	{
		private MySqlConnection conn;
		private IConfiguration _configuration;
		private string connString;

		public LoginController(IConfiguration configuration)
		{
			_configuration = configuration;
			connString = configuration.GetConnectionString("DefaultConnection");
			conn = new(connString);
			conn.Open(); 
		}

		[HttpPost]
		[AllowAnonymous]
		public async Task<IActionResult> Post(LoginData loginData)
		{

			User user = Authenticate(loginData);
			//need to validate using SQL commands

			if (user != null)
			{
				var token = GenerateToken(user);
				return Ok(token);
			}

			return NotFound("User not found"); 
		}

		private User Authenticate(LoginData loginData)
		{

			try
			{
				string sql = "SELECT * from users";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader userReader = cmd.ExecuteReader();

				List<User> users = new List<User>(); 
				while (userReader.Read())
				{
					User user = new User();
					user.email = userReader.GetString("email");
					user.name = userReader.GetString("name");
					user.password = userReader.GetString("password");
					user.positionTitle = userReader.GetString("position_title");
					user.staffID = userReader.GetString("staff_id");
					users.Add(user);
				}

				for (int i=0; i<users.Count; i++)
				{
					User currUser = users[i];
					if (currUser.email.Equals(loginData.username) && currUser.password.Equals(loginData.password))
					{
						Console.WriteLine("credentails match");
						return currUser; 
					}
				}

            }
			catch(Exception e)
			{
				Console.WriteLine(e.ToString());
			}

            return null; 
		}

		private string GenerateToken(User user)
		{
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
			var claims = new[]
			{
                new Claim(ClaimTypes.NameIdentifier,user.email),
                new Claim(ClaimTypes.Role,user.positionTitle),
				new Claim(ClaimTypes.Name, user.name),
				new Claim(ClaimTypes.UserData, user.staffID)
            };
            var token = new JwtSecurityToken(_configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials);


            return new JwtSecurityTokenHandler().WriteToken(token);
        }
	}


	public class LoginData
	{
		public string username { get; set; }
		public string password { get; set; }
	}

}