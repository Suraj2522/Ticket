using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ticket.Models;

using Ticket.DAL;
using static TicketSystem.Controllers.TicketSystemController;

namespace TicketSystem.Controllers
{
    public class TicketSystemController : Controller
    {
        TicketSystemDAL tsDAL = new TicketSystemDAL();
        public ActionResult Index()
        {
            return View();
        }
        #region "TicketSystem"
     
        public ActionResult TicketDetails()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }

        // Handle login form submission
        [HttpPost]
        public ActionResult Login(string username, string password)
        {
            // Check if the username and password are provided
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                ViewBag.Message = "Username and password are required.";
                return View();
            }

            // Validate the user credentials using DAL method
            var user = tsDAL.ValidateUser(username, password);

            if (user != null)
            {
                // Store user information in the session
                Session["UserID"] = user.UserID;
                Session["UserName"] = user.UserName;
                Session["RoleTypeID"] = user.RoleTypeID;

                if (user.RoleTypeID == 1 || user.RoleTypeID == 2)
                {
                    
                    return RedirectToAction("Index");  // Redirect to Index if user role is 1 or 2
                }
                else if (user.RoleTypeID == 3)
                {
                    return RedirectToAction("TicketList");  // Redirect to TicketList if user role is 3
                }
            }

            // Invalid credentials
            ViewBag.Message = "Invalid username or password.";
            return View();
        }
        public JsonResult GetStatusCount()
        {
            StatusCount statusCounts = new StatusCount();
            try
            {
                int UserID = Convert.ToInt32(Session["UserID"]);
                int RoleTypeID = Convert.ToInt32(Session["RoleTypeID"]);
                statusCounts = tsDAL.GetStatusCount(UserID, RoleTypeID);
            }
            catch (Exception ex)
            {
            }
            return Json(statusCounts, JsonRequestBehavior.AllowGet);
        }

        // Logout
        //public ActionResult Logout()
        //{
        //    Session.Clear(); // Clear session
        //    return RedirectToAction("Login");
        //}
        public ActionResult TicketList()
        {
            return View();
        }
        public ActionResult SupportAdminPortal()
        {
            return View();
        }
        [HttpPost]
        public JsonResult CreateUserTicket(NewTicket Ticket )
        {
            NewTicket ticketsystem = new NewTicket();
           
             Ticket.UserID = Convert.ToInt32(Session["UserID"]);
             ticketsystem = tsDAL.CreateUserTicket(Ticket);
            return Json(ticketsystem, JsonRequestBehavior.AllowGet);
        }                
        public JsonResult GetTickets(int StatusID)
        {
            List<TicketSystemBOL> TickeList = new List<TicketSystemBOL>();
            try
            {
                int UserID = Convert.ToInt32(Session["UserID"]);
                int RoleTypeID = Convert.ToInt32(Session["RoleTypeID"]);
                TickeList = tsDAL.GetTickets(UserID, RoleTypeID, StatusID);                
            }
            catch (Exception ex)
            {
            }
            return Json(TickeList, JsonRequestBehavior.AllowGet);
        }
       
        public JsonResult GetCallCenterMember()
        {
            List<UserMasterBOL> EmployeeList = new List<UserMasterBOL>();
            try
            {
                EmployeeList = tsDAL.GetCallCenterMember();
            }
            catch (Exception ex)
            {
                // objCommon.InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return Json(EmployeeList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCallCenterMessages(int TicketID)
        {
            List<CallCenterMessagesBOL> MessagesList = new List<CallCenterMessagesBOL>();
            try
            {
                int LoginTypeID = Convert.ToInt32(Session["RoleTypeID"]);
                MessagesList = tsDAL.GetCallCenterMessages(TicketID, LoginTypeID);
            }
            catch (Exception ex)
            {
                //objCommon.InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return Json(MessagesList, JsonRequestBehavior.AllowGet);
        }        
        public JsonResult SendMessages(CallCenterMessagesBOL MSG)
        {
            List<CallCenterMessagesBOL> MessagesList = new List<CallCenterMessagesBOL>();
            try
            {
                MSG.UserID = Convert.ToInt32(Session["UserID"]);
                if (MSG.AttachmentType == null)
                {
                    MSG.AttachmentType = "T";
                }
                if (Convert.ToInt32(Session["RoleTypeID"]) ==1 || Convert.ToInt32(Session["RoleTypeID"]) == 2)
                {
                    MSG.IsCallCenterMSG = true;
                }
                else
                {
                    MSG.IsCallCenterMSG = false;
                }
                MessagesList = tsDAL.SendMessages(MSG);
            }
            catch (Exception ex)
            {
                //objCommon.InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return Json(MessagesList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AssignTicket(int TicketID, int AssignTo, int StatusID,string AdminRemark)
        {
            TicketSystemBOL ticket = new TicketSystemBOL();
            try
            {
                int UserID = Convert.ToInt32(Session["UserID"]);
                 ticket = tsDAL.AssignTicket(TicketID, AssignTo, UserID, StatusID, AdminRemark);
                if (ticket.TicketID > 0 && StatusID == 3)//for user
                {
                    ticket.ResponseMsg = "Ticket Closed Successfully.";
                }
                else if (StatusID == 2)//support team
                {
                    ticket.ResponseMsg = "Ticket Assigned Successfully.";
                }
            }
            catch (Exception ex)
            {
                //objCommon.InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return Json(ticket, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetUserID()
        {
            int RoleTypeID = Convert.ToInt32(Session["RoleTypeID"]);
            return Json(RoleTypeID, JsonRequestBehavior.AllowGet);
        }             
        public JsonResult GetTicketDetails(int TicketID)
        {
            TicketSystemBOL TicketDetails = new TicketSystemBOL();
            try
            {
                TicketDetails = tsDAL.GetTicketDetails(TicketID);
                TicketDetails.LogInUserID = Convert.ToInt32(Session["UserID"]);
                TicketDetails.CurrentLoginTypeID = Convert.ToInt32(Session["RoleTypeID"]);

            }
            catch (Exception ex)
            {
               // objCommon.InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return Json(TicketDetails, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult Logout()
        {
            // Clear all session data
            Session.Clear();
            Session.Abandon();

            // Remove authentication cookie if present
            if (Request.Cookies[".AspNet.ApplicationCookie"] != null)
            {
                var cookie = new HttpCookie(".AspNet.ApplicationCookie")
                {
                    Expires = DateTime.Now.AddDays(-1), // Set the cookie expiration to yesterday to remove it
                    HttpOnly = true
                };
                Response.Cookies.Add(cookie);
            }

            // Redirect to the login page
            return Json(new { redirectUrl = Url.Action("Login", "TicketSystem") }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetUnSeenMsg()
        {
            int UserID = Convert.ToInt32(Session["UserID"]);
            CallCenterMessagesBOL UnSeenCount = new CallCenterMessagesBOL();
            UnSeenCount = tsDAL.GetUnSeenMsg(UserID);
            return Json(UnSeenCount, JsonRequestBehavior.AllowGet);
        }
              [HttpPost]
        public JsonResult AttachemntUploadForTicket()
        {
            string TicketID = Convert.ToString(System.Web.HttpContext.Current.Request["TicketID"]);
            try
            {
                string _imgname = string.Empty;
                var fileName = "";
                if (System.Web.HttpContext.Current.Request.Files.AllKeys.Any())
                {
                    var pic = System.Web.HttpContext.Current.Request.Files["MyDoc"];

                    if (pic.ContentLength > 0)
                    {
                        fileName = Path.GetFileName(pic.FileName);
                        _imgname = fileName;
                        var _ext = Path.GetExtension(pic.FileName);
                          fileName = GetFileName(TicketID) + _ext;
                        fileName = fileName.Replace(" ", "_");
                        var _comPath = "D:\\netProjects\\Ticket 2\\Ticket\\Ticket\\Images\\" + TicketID + "\\";
                        if (!Directory.Exists(_comPath))
                        {
                            Directory.CreateDirectory(_comPath);
                        }
                        _comPath = _comPath + fileName;
                        var path = _comPath;
                        pic.SaveAs(path);
                        CallCenterMessagesBOL msg = new CallCenterMessagesBOL();
                        msg.TicketID = TicketID;
                        msg.Message = fileName;
                        msg.AttachmentType = "I";
                        SendMessages(msg);
                    }
                }
            }
            catch (Exception ex)
            {
                //objCommon.InsertErrorLog(ex.ToString() + "\n" + ex.StackTrace.ToString());
            }
            return Json("Image Uploaded", JsonRequestBehavior.AllowGet);
        }
        public string GetFileName(string ProjectName)
        {
            string FileName = ProjectName + "_" + DateTime.Now.ToString("yyyy/MM/dd").Replace("/", "_");
            FileName += "_" + DateTime.Now.TimeOfDay.Hours + "_" + DateTime.Now.TimeOfDay.Minutes + "_" + DateTime.Now.TimeOfDay.Seconds + "_" + DateTime.Now.TimeOfDay.Milliseconds;
            return FileName;
        }
        #endregion
    }
}