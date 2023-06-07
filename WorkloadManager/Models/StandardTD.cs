using System;
namespace WorkloadManager.Models
{
	public class StandardTD : TeachingDelivery
	{
		public int totalCount { get; set; } //total classes for this method, attribute [B] in spreadsheet
		public int duplicateClasses { get; set; } //number of same classes in the week, attribute [C] in spreadsheet

		public StandardTD() :base()
		{ }
		
    }
}

