using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ticket.Models
{
    public class StatusCount
    {
        public int StatusID { get; set; }
        public int TotalCount { get; set; }
        public int OpenCount { get; set; }
        public int UnderProcessCount { get; set; }
        public int CloseCount { get; set; }
    }
    public class NewTicket
    {
        public string Description { get; set; }
        public string QueryType { get; set; }
        public string Subject { get; set; }
        public int UserID { get; set; }
       

    }
    public class TicketSystemBOL
    {       
        public string Password { get; set; }
        public long TicketID { get; set; }
        public long UserId { get; set; }
        public string Role { get; set; }
        public int ClientId { get; set; }
        public string Subject { get; set; }
        public string Status { get; set; }
         public string TicketStatus { get; set; }
        public string StatusCode { get; set; }
        public long UserID { get; set; }
        public long LogInUserID { get; set; }
        public string QueryType { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public long TotalRecord { get; set; }
        public long SrNo { get; set; }
        public long AssignTo { get; set; }
        public long DependentID { get; set; }
        public string UserName { get; set; }
        public string DependentName { get; set; }
        public string ClientName { get; set; }
        public string ResponseMsg { get; set; }
        public string Email { get; set; }
        public string TicketNumber { get; set; }
        public string EncryptedID { get; set; }
        public string FirstName { get; set; }
        public long UnSeenMsgCount { get; set; }
        public int ResponseCode { get; set; }
        public int CurrentLoginTypeID { get; set; }
    }    
    public class CallCenterMessagesBOL
    {
        public long ID { get; set; }
        public string Message { get; set; }
        public string TicketID { get; set; }
        
        public string AttachmentType { get; set; }
        public long UserID { get; set; }
        public string CreatedDate { get; set; }
        public Boolean IsCallCenterMSG { get; set; }
        public Boolean IsReadByUser { get; set; }
        public Boolean IsReadBySupportTeam { get; set; }
        public int LoginTypeID { get; set; }
        public string FirstName { get; set; }
        public long UnseenMsgCount { get; set; }
        public string Time { get; set; }
    }
    public class Dependent
    {
        public long DependentID { get; set; }
        public string FirstName { get; set; }
    }
}