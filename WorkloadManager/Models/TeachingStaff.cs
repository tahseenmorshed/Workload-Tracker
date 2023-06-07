using System;
using System.Text.Json.Serialization;

namespace WorkloadManager.Models
{
	public class TeachingStaff
	{
		public string? staffName { get; set; }
		public string? staffID { get; set; }
        public List<TeachingDelivery> tdAllocations { get; set; }
		public TeachingRelatedDuties trdAllocations { get; set; }
		public double? projectAllocation { get; set; }

		public TeachingStaff()
		{
            tdAllocations = new List<TeachingDelivery>();
        }
	}
}

