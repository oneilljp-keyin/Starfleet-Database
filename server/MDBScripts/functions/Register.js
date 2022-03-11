exports = async function (payload, response) {
  const users = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("users");
  const secretKey = context.values.get("secretKey");
  
  switch (context.request.httpMethod) {
    case "POST": {
      const registerInfo = EJSON.parse(payload.body.text());
      
      const njwt = require("njwt");
      const passwordHash = require("password-hash");

      const { errors, isValid } = await context.functions.execute("user_login", registerInfo);

      // Check Validation
      if (!isValid) return errors;
      
      const name = registerInfo.name.trim();
      const email = registerInfo.email.toLowerCase();
      const password = registerInfo.password;
      const hashedPassword = passwordHash.generate(password);

      let userCheck;

      // Find user by email
      try {
        userCheck = await users.findOne({ email });
        // Check if email already exists
        if (!userCheck) {
          return { error: "404", message: "Email address already in use" };
        }
      } catch (e) {
        return { message: e };
      }

      let validToken;
      
      return {name: name, email: email, password: hashedPassword};

      let addToken = await users.updateOne(
        { _id: BSON.ObjectId(userCheck._id.toString()) },
        { $set: { tokens } }
      );

      return { token: token, id: userCheck._id.toString() };
    }
  }
};
