function systemLogin() {
    

    $.get("Handler.ashx", {
        actionType: "login",
        userType: userType,       
    },

        function (data, status) {

            if (status == "success") {

                console.log(data);

                //אם אין משתמש
                if (data == "no user") {
                    
                }
                //אם יש משתמש
                else {
                    userObj = JSON.parse(data);
                    
                    if () {
                       
                    }
                    
                    else {
                       
                    }

                }
            }
        });
}