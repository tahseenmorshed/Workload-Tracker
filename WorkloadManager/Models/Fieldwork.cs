using System;
namespace WorkloadManager.Models
{
	public class Fieldwork : TeachingDelivery
	{
		public int noStaff { get; set; } //attribute [D] in spreadsheet
		public int hoursPerStaff { get; set; } //attribute [E] in spreadsheet

		public Fieldwork() :base()
		{ }
	}
}

