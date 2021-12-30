import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:8000/api/v1/sfdatabase",
  // baseURL:
  //   "https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/restaurant-reviews-wddlm/service/restaurants/incoming_webhook/",
  baseURL:
    "https://us-east-1.aws.data.mongodb-api.com/app/sector-709-database-sstbi/endpoint/Starfleet/",
  headers: { "Content-type": "application/json" },
});
