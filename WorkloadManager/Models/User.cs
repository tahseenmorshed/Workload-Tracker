namespace WorkloadManager.Models
{
    public class User
    {
        public string name { get; set; }
        public string email { get; set; }
        public string? role { get; set; }
        public string staffID { get; set; }
        public string password { get; set; }
        public string? positionTitle { get; set; }
        public string? employmentStatus { get; set; }
        public string occupancyType { get; set; }
        public string workFunction { get; set; }
        public DateOnly? occupancyStartDate { get; set; }
        public DateOnly? occupancyEndDate { get; set; }
        public float? positionFTE { get; set; }
        public int? workloadHours { get; set; }
        public int? plannedLeave { get; set; }
        public int? bookedLeave { get; set; }
        public string discipline { get; set; }
    }
}
