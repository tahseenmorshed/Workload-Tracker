using System;
namespace WorkloadManager.Models
{
	public class ProjectUnit
	{
		public bool? isProjectUnit { get; set; }
		public int? noStudentsPerProject { get; set; }
		public int? noProjects { get; set; }
		public double? parameter { get; set; }

        public ProjectUnit()
        { }
    }
}

