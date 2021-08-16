import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/api/v1/sfdatabase",
  // baseURL:
  //   "https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/restaurant-reviews-wddlm/service/restaurants/incoming_webhook/",
  headers: { "Content-type": "application/json" },
});
