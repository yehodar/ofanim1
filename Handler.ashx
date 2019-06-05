<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data;
using System.Data.OleDb;
using System.Collections.Generic;


public class Handler : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        //בדיקת סוג הפעולה המבוקשת
        string actionType = context.Request["actionType"];

        //פעולת התחברות למערכת//
        if (actionType == "login")
        {
            string userType = context.Request["userType"];
            string userName = context.Request["userName"];
            string userPassword = context.Request["userPassword"];
            string myQueryUser = "";
            string myQueryUser2 = "";
            string myGroup = "";
            if (userType == "1")
            {
                myQueryUser = "select * from Students where UserName='" + userName + "' and Password='" + userPassword + "'";





            }
            else if (userType == "2")
            {
                myQueryUser = "select * from Instructors where UserName='" + userName + "' and Password='" + userPassword + "'";
            }
            DataSet UserDit = sqlRet(myQueryUser);
            //הוספת פריטים
            if (userType == "1")
            {
                myGroup = UserDit.Tables[0].Rows[0][1].ToString();
                myQueryUser2 = "select gActiveQuestionID from Groups where gID=" + myGroup + "";
                //myQueryUser2 = "select myName from Students where UserName='" + userName + "' and Password='" + userPassword + "'";
                //DataTable dt = new DataTable();
                UserDit.Tables[0].Columns.Add(new DataColumn("groupCurrentQuestion",typeof(string)));

                DataSet UserDit2 = sqlRet(myQueryUser2);
                UserDit.Tables[0].Rows[0]["groupCurrentQuestion"]=UserDit2.Tables[0].Rows[0][0].ToString();
                //DataRow dr = dt.NewRow();
                //dr["currentQuestion"] = 111;
                //dt.Rows.Add(dr);
                //UserDit.Tables.Add(dt);


            }
            //DataSet UserDit2 =sqlRet(myQueryUser2);

            if (UserDit.Tables[0].Rows.Count != 0)
            {
                string jsonUserText = JsonConvert.SerializeObject(UserDit.Tables[0]);

                context.Response.Write(jsonUserText);

            }
            else
            {
                context.Response.Write("no user");
            }
        }


        //פעולת שחזור כל החידות הקודמות שפורסמו והחידות שהילד ענה עליהן
        else if (actionType == "getMyPreviousQuestions")
        {
            string userID = context.Request["studentID"];
            string groupID = context.Request["groupID"];

            var myQuery = "select * from PublishingDocumentation where groupID=" + groupID;
            var myQuery2 = "select * from questionsResponseDocumentation where studentID=" + userID;
            DataSet UserDit = sqlRet(myQuery);
            DataSet UserDit2 = sqlRet(myQuery2);
            UserDit.Tables[0].Columns.Add("answerdByUser");
            UserDit.Tables[0].Columns.Add("responseDate");
            UserDit.Tables[0].Columns.Add("responseTrue");
            UserDit.Tables[0].Columns.Add("responseValue");
            foreach(DataRow dr in UserDit.Tables[0].Rows) // search whole table
            {
                dr["answerdByUser"] = "false";
                string myquestion = dr["questionID"].ToString();

                foreach(DataRow dr2 in UserDit2.Tables[0].Rows)
                {

                    if(dr2["studentID"].ToString() == userID && dr2["questionID"].ToString() == myquestion)
                    {

                        dr["answerdByUser"] = "true";
                        dr["responseDate"] = dr2["responseDate"];
                        dr["responseTrue"] = dr2["responseTrue"];
                        dr["responseValue"] = dr2["responseValue"];
                    }
                }


            }



            //DataTable dt2 = UserDit2.Tables[0];



            if (UserDit.Tables[0].Rows.Count != 0)
            {
                string jsonUserText = JsonConvert.SerializeObject(UserDit.Tables[0]);

                context.Response.Write(jsonUserText);

            }
            else
            {
                context.Response.Write("no user");
            }
        }


        //פעולת עדכון מידע
        else if (actionType == "updateTable")
        {
            string newData = context.Request["newData"];
            var updateQuery1 = "UPDATE [Instructors] SET [Password]='" + newData + "' WHERE ID=1";
            newUpdateTable(updateQuery1);
            context.Response.Write("updateIsDone " + newData);
        }
        //פעולת בדיקת איזה חידה להביא
        else if (actionType == "getMyQuestions")
        {
            string studentID = context.Request["studentID"];
            string checkGroupQuery = "select * from Students where ID='" + studentID + "'";
            DataSet checkGroupQueryDit = sqlRet(checkGroupQuery);
            string myGroupID= checkGroupQueryDit.Tables[0].Rows[0]["groupID"].ToString();

            context.Response.Write("group " + myGroupID);


        }
        else if (actionType == "updateDbNewResponse")
        {

            var checkLastQuery = "SELECT TOP 1 * FROM questionsResponseDocumentation ORDER BY qrdID DESC";
            DataSet checkLastQueryDIT = sqlRet(checkLastQuery);
            int lastID = Convert.ToInt32(checkLastQueryDIT.Tables[0].Rows[0]["qrdID"]);
            int studentID = Convert.ToInt32(context.Request["studentID"]);
            int groupID = Convert.ToInt32(context.Request["groupID"]);
            int questionID = Convert.ToInt32(context.Request["questionID"]);
            string responseDate = context.Request["responseDate"];
            string responseTrue = context.Request["responseTrue"];
            string responseValue = context.Request["responseValue"];

            var insertQuery = "INSERT INTO [questionsResponseDocumentation] VALUES ("+(lastID+1)+","+studentID+", "+groupID+", "+questionID+", '"+responseDate+"', '"+responseTrue+"', '"+responseValue+"')";
            newUpdateTable(insertQuery);
                string studentIDstring = context.Request["studentID"];
            int trueAnswersSum;
            string checkAnswerDataQuery = "select * from Students where ID=" + studentIDstring;
            DataSet AnswerDataDS = sqlRet(checkAnswerDataQuery);
            int answersSum = Convert.ToInt32(AnswerDataDS.Tables[0].Rows[0]["sAnsweredQuestionsSum"]) + 1;
            if (responseTrue == "true")
            {
                trueAnswersSum = Convert.ToInt32(AnswerDataDS.Tables[0].Rows[0]["sAnsweredRightQuestionsSum"]) + 1;
            }
            else
            {
                trueAnswersSum = Convert.ToInt32(AnswerDataDS.Tables[0].Rows[0]["sAnsweredRightQuestionsSum"]);
            }


            string updateAnswersSumQuery = "UPDATE [Students] SET [sAnsweredQuestionsSum]=" + answersSum + ", [sAnsweredRightQuestionsSum] ="+trueAnswersSum+" WHERE ID="+studentID;
            newUpdateTable(updateAnswersSumQuery);

            context.Response.Write("Insert is Done ");
        }

        //פעולת הבאת החידה עצמה
        else {

            string questionCode = context.Request["questionCode"]; // חשוב לשים לב שזה אותו שם משתנה כמו באנימייט
            if (questionCode != null)
            {
                //שאילתא למציאת המשחק לפי קוד המשחק
                string myQueryQuestionD = "select * from questions where qID=" + questionCode;
                DataSet QuestionDit = sqlRet(myQueryQuestionD);

                //האם המשחק קיים
                if (QuestionDit.Tables[0].Rows.Count != 0)
                {
                    //יצירת הjson עם פרטי המשחק
                    // string jsonQuestionText = "{ \"Question Name\": \"" + QuestionDit.Tables[0].Rows[0]["qName"].ToString() + "\", ";

                    //קבלת כל הפריטים של המשחק הרלוונטי
                    string myQuery = "select * from questions where qID=" + questionCode;
                    DataSet QuestionItems = sqlRet(myQuery);

                    //הוספה של הפריטים לJson
                    string jsonQuestionText = JsonConvert.SerializeObject(QuestionItems.Tables[0]);

                    context.Response.Write(jsonQuestionText);

                }
                else
                {
                    //במידה והמשחק לא קיים
                    context.Response.Write("לא נמצאה שאלה");
                }
            }
        }
    }
    //פונקציה להבאת נתונים מהבסיס נתונים
    public DataSet sqlRet(string myQuery)
    {
        string mySource = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + HttpContext.Current.Server.MapPath("App_Data/myData.accdb") + ";";

        OleDbDataAdapter oda = new OleDbDataAdapter(myQuery, mySource);
        DataSet ds = new DataSet();
        oda.Fill(ds);
        return ds;
    }

    //פונקציה לעדכון נתונים בבסיס נתונים

    public void newUpdateTable(string queryString)
    {
        string connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + HttpContext.Current.Server.MapPath("App_Data/myData.accdb") + ";";
        using (OleDbConnection connection = new OleDbConnection(connectionString))
        {
            OleDbCommand command = new OleDbCommand(queryString, connection);
            command.Connection.Open();
            command.ExecuteNonQuery();

        }
    }




    public bool IsReusable
    {
        get
        {
            return true;
        }
    }
}
















