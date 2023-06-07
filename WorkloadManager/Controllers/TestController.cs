using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WorkloadManager.Controllers;

[ApiController]
[Route("[controller]")]
public class TestController : Controller
{
    private MySqlConnection conn;
    private IConfiguration _configuration;
    private string connString; 

    public TestController(IConfiguration configuration)
    {
        _configuration = configuration;
        conn = new();
        connString = configuration.GetConnectionString("DefaultConnection");
        conn.ConnectionString = connString; 
        conn.Open(); 
    }

    [HttpGet]
    public ActionResult Get()
    {
        string command = "select * from Users";
        MySqlCommand cmd = new MySqlCommand(command, conn);
        MySqlDataReader reader = cmd.ExecuteReader();

        string password = "";
        string username = "";
        string res = "";
        while (reader.Read())
        {
            string val = (reader[0] + " -- " + reader[1] + " -- " + reader[14]);
            username = reader[1].ToString();
            password = reader[14].ToString();
            res = res + val;
        }

        reader.Close();
        conn.Close();

        var jsonVal = new {TestValue = res};
        return Json(jsonVal);
        //return Ok(res);
        //return Ok("{\"TestValue\": \"Value from Backend\"}");
    }
}

