exports = async function (payload, response) {
  const users = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("users");
  const secretKey = context.values.get("secretKey");
  
  

  switch (context.request.httpMethod) {
    case "GET": {return "Hello";}
    case "POST": {
      const registerInfo = EJSON.parse(payload.body.text());
      
      return {message: "Is This Working"};

      const njwt = require("njwt");
      const passwordHash = require("password-hash");

      const { errors, isValid } = await context.functions.execute("user_login", loginInfo);

      // Check Validation
      if (!isValid) return errors;

      const email = loginInfo.email.toLowerCase();
      const password = loginInfo.password;

      let userCheck;

      // Find user by email
      try {
        userCheck = await users.findOne({ email });
        // Check if user exists
        if (!userCheck) {
          return { error: "404", message: "Email and/or Password Incorrect" };
        }
      } catch (e) {
        return { message: e };
      }

      let validToken;

      // Check password
      const isMatch = passwordHash.verify(password, userCheck.password);

      if (isMatch) {
        // User matched
        // Create JWT payload
        let tokenPayload = {
          _id: userCheck._id,
          exp: new Date("2022-12-31"),
          iat: new Date(),
        };

        // Sign token
        token = utils.jwt.encode("HS256", tokenPayload, secretKey);

        // add token to database for authorization
        let tokens = [];
        if (!userCheck.tokens) {
          tokens.push({ _id: BSON.ObjectId(), token: token });
        } else {
          tokens = userCheck.tokens.concat({ _id: BSON.ObjectId(), token });
        }

        let addToken = await users.updateOne(
          { _id: BSON.ObjectId(userCheck._id.toString()) },
          { $set: { tokens } }
        );

        return { token: token, id: userCheck._id.toString() };
      } else {
        return { error: "404", message: "Email and/or Password Incorrect" };
      }
    }
  }
};
