
const { app } = require('@azure/functions');
const { ObjectId } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;

// function for checking if a user is logged in
// returns array of the user id itself (for use in routes) and a true if logged in 
// returns array of -1 and false if user is logged out
function getUser(req){

    const header = req.headers.get('x-ms-client-principal');
    const encoded = Buffer.from(header, 'base64');
    const decoded = encoded.toString('ascii');
    let clientPrincipal = JSON.parse(decoded);
    let user_id;
    
    if(clientPrincipal && clientPrincipal["userRoles"].includes('anonymous') && clientPrincipal["userRoles"].includes("authenticated")){
        user_id = clientPrincipal["userId"]
        return [user_id, true]
    }

    else{
        return [-1, false]
    }


}

// adds user to db
async function addUser(user_id){
    const client = await mongoClient.connect(process.env.USER_DB)
    let payload = {user_id}
    let result = await client.db("fitness").collection("user_data").insertOne(payload)
    client.close()

    if(result.ok){
        return true
    }

    else{
        return false
    }
}


async function checkUser(user){

    const client = await mongoClient.connect(process.env.USER_DB)

    console.log(user)
    let result = await client.db("fitness").collection("user_data").find({user_id: user}).toArray()
    console.log(result)
    client.close()

    // if result length is > 0 then the user is in the db
    if(result && result.length >= 1){
        console.log("HI")
        return true
    }

    else{
        return false
    }
}

async function fullUserCheck(req){
    let the_result = getUser(req)
    
    let return_val = false
    let userid;
    // will be false if user is logged out
    if(the_result[1]){
        userid = the_result[0]
        return_val = true

        // check if user in db, if not add them
        let user_indb = await checkUser(userid)
        console.log(user_indb)
        if(!user_indb){
            console.log("Added user for the first time")
            let addResult = addUser(userid)
            if(!addResult){
                return_val = false
            }
        }
    }

    if(return_val){
        return [return_val, userid]
    }

    return return_val
}

app.http('getDiet', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getDiet',
    handler: async (request, context) => {

        const client = await mongoClient.connect(process.env.DIETLOG_DB)
        const results = await client.db("dietLog").collection("dietCollection").find({}).toArray()
        // console.log(results[0].dietlog);
        const sending = results[0].dietlog;
        client.close();
        return {
            jsonBody: {dietlog : sending}
        }
    },
});

app.http('deleteFood', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'deleteFood',
    handler: async (request, context) => {

        const client = await mongoClient.connect(process.env.DIETLOG_DB)

        const body = await request.json();
        const food = body.name;
        console.log(body.name, body.userID, body.date);
        const matcher = {"_id": new ObjectId("661ed6a65e3fec9c68884d4a"), "dietlog.name": body.userID, "dietlog.diet.date": body.date};
        const removing = { "$pull": { "dietlog.$.diet.$[dietEntry].food" : { "name": food }}};
        const moreMatch = { arrayFilters: [{"dietEntry.date": body.date}]};
        const results = await client.db("dietLog").collection("dietCollection").updateOne(matcher, removing, moreMatch);
        console.log(results);
        client.close();

        return {
            jsonBody: {status : 200}
        }
    },
});

app.http('addFood', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'addFood',
    handler: async (request, context) => {
        const client = await mongoClient.connect(process.env.DIETLOG_DB);
        const body = await request.json();
        const food = body.food[0];
        const date = body.date
        const userID = body.userID;

        const matching = {"_id": new ObjectId("661ed6a65e3fec9c68884d4a"), "dietlog.name": userID,}
        let results = await client.db("dietLog").collection("dietCollection").findOne(matching);

        if(!results) {
            const newDateEntry = { name: userID, diet : [{date: date, food: [food]}] };
            const addDateUpdate = { $push: { "dietlog": newDateEntry } };
            results = await client.db("dietLog").collection("dietCollection").updateOne({ "_id": new ObjectId("661ed6a65e3fec9c68884d4a") }, addDateUpdate);
        } else {
            const dateFilter = { "_id": new ObjectId("661ed6a65e3fec9c68884d4a"), "dietlog.name": userID, "dietlog.diet.date": date };
            results = await client.db("dietLog").collection("dietCollection").findOne(dateFilter);
            if(!results) {
                // console.log("FOUND DATE");
                const newDateEntry = { date: date, food: [food] };
                const update = { $push: { "dietlog.$.diet": newDateEntry } };
                await client.db("dietLog").collection("dietCollection").updateOne(matching, update);
            } else {
                const update = { $push: { "dietlog.$.diet.$[elem].food": food } };
                const options = { arrayFilters: [{ "elem.date": date }] };
                results = await client.db("dietLog").collection("dietCollection").updateOne(matching, update, options);
            }
        }
        const sending = await client.db("dietLog").collection("dietCollection").find({}).toArray();

        // console.log(results);
        client.close();
        return {
            status: 201,
            jsonBody: {finished : "Done", result: sending, date: date}
        }
    },
});

app.http('AddImage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'addImage',
    handler: async (request, context) =>{
        
        // check for the login
        let answer = await fullUserCheck(request)
        

        if(!answer){
            return{
                status: 404, 
                body: "Invalid user"
            }
        }

        let user_id = answer[1]

    
        let body = await request.json()
        console.log(body)

        let img_data = body.img_data

        const client = await mongoClient.connect(process.env.USER_DB);
        
        let payload = {img_data, user_id}
        let result = await client.db("fitness").collection("images").insertOne(payload)
        client.close();

        let sending = {finished : "Done"};

        
        return {
            status: 201,
            jsonBody: sending
        }

    }
})


app.http('GetImages', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getimages',
    handler: async(request, context)=>{
        let answer = await fullUserCheck(request)
        

        if(!answer){
            return{
                status: 404, 
                body: "Invalid user"
            }
        }

        let user = answer[1]


        const client = await mongoClient.connect(process.env.USER_DB);
        let result = await client.db("fitness").collection("images").find({user_id: user}).toArray()

        console.log(result)

        let sending = {finished : "Done"};

        return {
            status: 201,
            jsonBody: result
        }
    }
})

app.http("deleteImage", {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'deleteImage',
    handler: async (request, context) =>{
        let answer = await fullUserCheck(request)
        

        if(!answer){
            return{
                status: 404, 
                body: "Invalid user"
            }
        }

        let user = answer[1]

        data = await request.json()
        imgdata = data.img_data
        const client = await mongoClient.connect(process.env.USER_DB);

        // images are too many characters and the db gives errors, so instead of deleting the specific image with deleteOne 
        // find ObjectID then delete based on that
        let result2 = await client.db("fitness").collection("images").find({user_id: user}).toArray()
        let object_to_del; 
        console.log(result2)
        for(let i = 0; i < result2.length; i++){
            if(result2[i].img_data == imgdata){
                object_to_del = result2[i]._id 
                break
            }
        }
        const result = await client.db("fitness").collection("images").deleteOne( {"_id":object_to_del, "user_id": user})
        if(result.deletedCount > 0){
            return {
              status: 200,
              jsonBody: {status: "ok"}
            }
          }
      
          else{
            return{
              status: 404, 
              body: "Invalid delete"
            }
          }

          
        console.log(data.img_data)
    }
})


app.http('addInfo', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'addinfo',
    handler: async (request, context) =>{
        let answer = await fullUserCheck(request)
        

        if(!answer){
            return{
                status: 404, 
                body: "Invalid user"
            }
        }

        let userid = answer[1]

        let body = await request.json()
        console.log(body)

        let data = body

        const client = await mongoClient.connect(process.env.USER_DB);
        
        let payload = {data}
        let result = await client.db("fitness").collection("user_data").updateOne({user_id: userid} , {$set: {"data": data}})
        client.close();

        let sending = {finished : "Done"};

        
        return {
            status: 201,
            jsonBody: sending
        }

    }
})

app.http('GetInfo', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getinfo',
    handler: async(request, context)=>{
        let answer = await fullUserCheck(request)
        

        if(!answer){
            return{
                status: 404, 
                body: "Invalid user"
            }
        }

        let user = answer[1]

        const client = await mongoClient.connect(process.env.USER_DB);
        let result = await client.db("fitness").collection("user_data").find({user_id: user}).toArray()

        // console.log(result)

        return {
            status: 201,
            jsonBody: result
        }
    }
})




app.http('AddWorkoutEvent', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'addWorkoutEvent',
    handler: async (request, context) => {
      try {
        let answer = await fullUserCheck(request);
        if (!answer) {
          return {
            status: 404,
            body: "Invalid user"
          };
        }
        
        let user_id = answer[1];
  
        let body = await request.json();
  
        body.user_id = user_id;
  
        if (!body.title) {
          return { status: 400, jsonBody: { error: "Title is required" } };
        }
        if (!body.start || !body.end) {
          return { status: 400, jsonBody: { error: "Date and times are required" } };
        }
  
        const startParts = body.start.split("T");
        const endParts = body.end.split("T");

        if (startParts.includes('') || endParts.includes('') || startParts.includes(":00") || endParts.includes(":00")) {
          return { status: 400, jsonBody: { error: "Date and times are required" } };
        }
        const startTime = new Date(body.start);
        const endTime = new Date(body.end);
  
        if (startTime >= endTime) {
          return { status: 400, jsonBody: { error: "Start time must be before end time" } };
        }
  
        const client = await mongoClient.connect(process.env.CALENDER_DB);
        const newEventNotes = body.newEventNotes ? body.newEventNotes.replace(/\r\n/g, '\n') : '';
        const result = await client.db("workout").collection("event").insertOne({
          ...body,
          newEventNotes
        });
  
        const insertedId = result.insertedId;
        client.close();
  
        return {
          status: 201,
          jsonBody: {
            message: "Event added successfully",
            id: insertedId
          }
        };
      } catch (error) {
        console.error("Error adding event:", error);
        return { status: 500, jsonBody: { error: "Internal server error" } };
      }
    }
  });
  
  


app.http('GetEvents', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getEvents',
    handler: async(request, context)=>{
        let answer = await fullUserCheck(request)

        if(!answer){
            return{
                status: 404, 
                body: "Invalid user"
            }
        }

        let user = answer[1]

        const client = await mongoClient.connect(process.env.CALENDER_DB);
        let result = await client.db("workout").collection("event").find({user_id: user}).toArray()

        return {
            status: 201,
            jsonBody: result
        }
    }
})

app.http('DeleteEvent', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'deleteEvent/{id}',
    handler: async(request, context) => {
      try {
        const id = request.params.id;
        if (!id) {
          return { status: 400, jsonBody: { error: "Event ID is required" } };
        }
  
        let answer = await fullUserCheck(request);
        if (!answer) {
          return { status: 404, body: "Invalid user" };
        }
        let user = answer[1];
  
        const client = await mongoClient.connect(process.env.CALENDER_DB);
        const event = await client.db("workout").collection("event").findOne({ _id: new ObjectId(id) });
  
        if (!event) {
          client.close();
          return { status: 404, jsonBody: { error: "Event not found" } };
        }
  
        if (event.user_id !== user) {
          client.close();
          return { status: 403, jsonBody: { error: "Unauthorized"} };
        }
  
        const result = await client.db("workout").collection("event").deleteOne({ _id: new ObjectId(id) });
        client.close();

        return { status: 200, jsonBody: { message: "Event deleted successfully" } };
      } catch (error) {
        console.error("Error deleting event:", error);
        return { status: 500, jsonBody: { error: "Internal server error" } };
      }
    }
  });
  
  
  
  
  