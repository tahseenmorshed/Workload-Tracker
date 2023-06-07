using System;
namespace WorkloadManager.Models
{
	public class TeachingRelatedDuties
	{
		public double unitCoordination { get; set; }
		public double preparation { get; set; }
		public double consultation { get; set; }
		public double marking { get; set; }
		public double moderation { get; set; }
		public double coAssessorDuties { get; set; }
		public double other { get; set; }
		public double total { get; set; }

		public double GetTotal()
		{
			return unitCoordination + preparation + consultation + marking + moderation + coAssessorDuties + other; 
		}
	}
}

