using System;
namespace WorkloadManager.Models
{
	public class Unit
	{
		public string code { get; set; }
		public string? name { get; set; }
		public int teachingWeeks { get; set; }
		public double creditPoints { get; set; }
		public string coordinator { get; set; }
		public string workloadParameter { get; set; }
		public string studyPeriod { get; set; }
		public int plannedHeadCount { get; set; }
		public string location { get; set; }

		public double? totalAllocatedHours { get; set; }

		public List<StandardTD> standardTDs { get; set; }
		public List<Fieldwork> fieldworks { get; set; }
		public ProjectUnit projectUnit { get; set; }
		public TeachingRelatedDuties? teachingRelatedDuties { get; set; }
		public List<TeachingStaff?> teachingStaff { get; set; }

		public double GetTotalAllocatedHours()
		{
			double tdSum = 0;
			for (int i=0; i<standardTDs.Count; i++)
			{
				StandardTD currTD = standardTDs[i];
				tdSum = (double)(tdSum + currTD.duplicateClasses * currTD.tuitionPatternHours * currTD.totalCount); 
			}

			for (int i=0; i<fieldworks.Count; i++)
			{
				Fieldwork currFieldwork = fieldworks[i];
				tdSum = (double)(tdSum + currFieldwork.noStaff * currFieldwork.hoursPerStaff); 
			}

			tdSum += (double) (projectUnit.parameter * projectUnit.noProjects); 

			tdSum += teachingRelatedDuties.GetTotal();

			double staffAllocSum = 0;

			for (int i=0; i<teachingStaff.Count; i++)
			{
				TeachingStaff currTeachingStaff = teachingStaff[i];
				
				for (int j=0; j<currTeachingStaff.tdAllocations.Count; j++)
				{
					staffAllocSum += (double) currTeachingStaff.tdAllocations[j].total; 
				}

				staffAllocSum += currTeachingStaff.trdAllocations.GetTotal(); 
			}

			return staffAllocSum - tdSum; 
		}
	}
}

