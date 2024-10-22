using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using Dapper;
using Ticket.Models;
using System.Configuration;

namespace Ticket.DAL
{
    public class TicketSystemDAL
    {
        string ConnectionString = ConfigurationManager.ConnectionStrings["adoConnectionstring"].ToString();
        public UserMasterBOL ValidateUser(string username, string password)
        {
            UserMasterBOL user = null;
            try
            {
                using (IDbConnection db = new SqlConnection(ConnectionString))
                {
                    var p = new DynamicParameters();
                    p.Add("@username", username);
                    p.Add("@password", password);

                    user = db.Query<UserMasterBOL>("Usp_GetUserDetails", p, commandType: CommandType.StoredProcedure).FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                // Handle exception (log it or show a message)
            }
            return user;
        }
        public NewTicket CreateUserTicket(NewTicket Ticket)
        {
            NewTicket ticket = new NewTicket();
            try
            {
                var p = new DynamicParameters();
                p.Add("@subject", Ticket.Subject);
                p.Add("@Description", Ticket.Description);
                p.Add("@QueryType", Ticket.QueryType);
                p.Add("@UserID", Ticket.UserID);
                ticket = HelperList.QuerySP<NewTicket>("spCreateUserTicket", p, null, null, false, null, ConnectionString).FirstOrDefault();
            }
            catch (Exception ex)
            {
            }

            return ticket;
        }
        public List<TicketSystemBOL> GetTickets(long UserID,int RoleTypeID, int StatusID)
        {
            List<TicketSystemBOL> objTicketList = new List<TicketSystemBOL>();
            try
            {
                var p = new DynamicParameters();
                p.Add("@RoleTypeID", RoleTypeID);
                p.Add("@UserID", UserID);
                p.Add("@StatusID", StatusID);
               
                objTicketList = HelperList.QuerySP<TicketSystemBOL>("spGetUserTickets", p, null, null, false, null, ConnectionString).ToList();
            }
            catch (Exception ex)
            {
                //InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return objTicketList;
        }


        public List<UserMasterBOL> GetCallCenterMember()
        {
            List<UserMasterBOL> objTicketList = new List<UserMasterBOL>();
            try
            {
                var p = new DynamicParameters();

                objTicketList = HelperList.QuerySP<UserMasterBOL>("spGetCallCenterEmployee", p, null, null, false, null, ConnectionString).ToList();
            }
            catch (Exception ex)
            {
                //InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return objTicketList;
        }
        public List<CallCenterMessagesBOL> GetCallCenterMessages(int TicketID, int LoginTypeID)
        {
            List<CallCenterMessagesBOL> objMessageList = new List<CallCenterMessagesBOL>();
            try
            {
                var p = new DynamicParameters();
                p.Add("@TicketID", TicketID);
                p.Add("@LoginTypeID", LoginTypeID);
                objMessageList = HelperList.QuerySP<CallCenterMessagesBOL>("spGetCallCenterMessages", p, null, null, false, null, ConnectionString).ToList();
            }
            catch (Exception ex)
            {
                //InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return objMessageList;
        }
        public TicketSystemBOL GetTicketDetails(int TicketID)
        {
            TicketSystemBOL objTicketDetails = new TicketSystemBOL();
            try
            {
                var p = new DynamicParameters();
                p.Add("@TicketID", TicketID);
                objTicketDetails = HelperList.QuerySP<TicketSystemBOL>("spGetTicketDetails", p, null, null, false, null, ConnectionString).FirstOrDefault();
            }
            catch (Exception ex)
            {
                //InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return objTicketDetails;
        }
        public List<CallCenterMessagesBOL> SendMessages(CallCenterMessagesBOL MSG)
        {
            List<CallCenterMessagesBOL> objMessageList = new List<CallCenterMessagesBOL>();
            try
            {
                var p = new DynamicParameters();
                p.Add("@UserID", MSG.UserID);
                p.Add("@Message", MSG.Message);
                p.Add("@TicketID", MSG.TicketID);
                p.Add("@IsCallCenterMSG", MSG.IsCallCenterMSG);
                p.Add("@AttachmentType", MSG.AttachmentType);
                objMessageList = HelperList.QuerySP<CallCenterMessagesBOL>("spSaveMessages", p, null, null, false, null, ConnectionString).ToList();
            }
            catch (Exception ex)
            {
                //InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return objMessageList;
        }
        public TicketSystemBOL AssignTicket(int TicketID, int AssignTo, int UserID, int StatusID,string AdminRemark)
        {
            TicketSystemBOL ticket = new TicketSystemBOL();
            try
            {
                var p = new DynamicParameters();
                p.Add("@TicketID", TicketID);
                p.Add("@AssignTo", AssignTo);
                p.Add("@UserID", UserID);
                p.Add("@StatusID", StatusID);
                p.Add("@AdminRemark", AdminRemark);

                ticket = HelperList.QuerySP<TicketSystemBOL>("spAssignTickets", p, null, null, false, null, ConnectionString).FirstOrDefault();
            }
            catch (Exception ex)
            {
            }

            return ticket;
        }
        public List<Dependent> GetDependent(int UserID)
        {
            List<Dependent> DependentList = new List<Dependent>();
            try
            {
                var p = new DynamicParameters();
                p.Add("@UserID", UserID);

                DependentList = HelperList.QuerySP<Dependent>("spGetDependent", p, null, null, false, null, ConnectionString).ToList();
            }
            catch (Exception ex)
            {
            }

            return DependentList;
        }
        public void SaveFeedback(int TicketID, string Concern, string ImprovementInFuture, string FeedBackPoints, int Ratings)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@TicketID", TicketID);
                p.Add("@FeedBack", Concern);
                p.Add("@Sugestions", ImprovementInFuture);
                p.Add("@FeedBackPoints", FeedBackPoints);
                p.Add("@Ratings", Ratings);

                HelperList.QuerySP<TicketSystemBOL>("spUpdateTicketFeedback", p, null, null, false, null, ConnectionString).ToList();
            }
            catch (Exception ex)
            {
            }
        }
        public StatusCount GetStatusCount(int UserID, int RoleTypeID)
        {
            StatusCount statusCounts = new StatusCount();
            try
            {
                var p = new DynamicParameters();
                p.Add("@RoleTypeID", RoleTypeID);
                p.Add("@UserID", UserID);

                statusCounts=HelperList.QuerySP<StatusCount>("spGetTicketCountStatusWise", p, null, null, false, null, ConnectionString).FirstOrDefault();
            }
            catch (Exception ex)
            {
            }

            return statusCounts;
        }

        // Example method to log errors
        private void LogError(string message)
        {
            // Implement your logging mechanism here
            Console.WriteLine(message); // Example: log to console; replace with actual logging
        }

        public CallCenterMessagesBOL GetUnSeenMsg(int UserID)
        {
            CallCenterMessagesBOL UnSeenCount = new CallCenterMessagesBOL();
            try
            {
                var p = new DynamicParameters();
                p.Add("@UserID", UserID);

                UnSeenCount = HelperList.QuerySP<CallCenterMessagesBOL>("spGetUnSeenCallCenterMessages", p, null, null, false, null, ConnectionString).First();
            }
            catch (Exception ex)
            {
            }

            return UnSeenCount;
         
        }

    }
}
