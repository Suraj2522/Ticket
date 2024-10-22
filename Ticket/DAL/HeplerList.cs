using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

using Dapper;
using System.Text;
using System.IO;
using System.Security.Cryptography;
namespace Ticket.DAL
{
    public static class HelperList
    {
        public static IEnumerable<T> QuerySP<T>(string storedProcedure, dynamic param = null,
          dynamic outParam = null, SqlTransaction transaction = null,
          bool buffered = true, int? commandTimeout = null, string connectionString = null) where T : class
        {
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            var output = connection.Query<T>(storedProcedure, param: (object)param, transaction: transaction, buffered: buffered, commandTimeout: commandTimeout, commandType: CommandType.StoredProcedure);
            connection.Close();
            return output;
        }
    }

}