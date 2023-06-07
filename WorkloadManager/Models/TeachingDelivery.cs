using System;
using System.Text.Json.Serialization; 

namespace WorkloadManager.Models
{
	public class TeachingDelivery
	{
		public string? type { get; set; }
		public string? tuitionPatternFrequency { get; set; } 
		public double? tuitionPatternHours { get; set; } //duration of teaching delivery, attribute [A] in spreadsheet
		public int? staffAllocatedHours { get; set; }
		public double? total { get; set; }

		public TeachingDelivery() { }
    }
}

