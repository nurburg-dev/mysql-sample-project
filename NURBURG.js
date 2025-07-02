import http from "k6/http";
import { check, sleep } from "k6";
import faker from "k6/x/faker";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Get API server host from environment variable
const API_HOST = __ENV.API_HOST || "http://localhost:3000";

// Test configuration
export const options = {
  stages: [
    { duration: "2m", target: 10 }, // Ramp up to 10 users over 2 minutes
    { duration: "5m", target: 10 }, // Stay at 10 users for 5 minutes
    { duration: "2m", target: 0 }, // Ramp down to 0 users over 2 minutes
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests must complete below 500ms
    errors: ["rate<0.1"], // Error rate must be below 10%
  },
};

export default function () {
  // Health check endpoint
  const response = http.get(`${API_HOST}/api/health`);

  // Check response
  const result = check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  // Track errors
  errorRate.add(!result);

  // Simulate database operations
  if (response.status === 200) {
    // Test database read operation
    const readResponse = http.get(`${API_HOST}/api/users`);
    check(readResponse, {
      "read operation successful": (r) => r.status === 200,
    });

    // Test database write operation
    const writePayload = JSON.stringify({
      name: faker.person.name(),
      email: faker.person.email(),
    });

    const writeResponse = http.post(`${API_HOST}/api/users`, writePayload, {
      headers: { "Content-Type": "application/json" },
    });

    check(writeResponse, {
      "write operation successful": (r) => r.status === 201 || r.status === 200,
    });
  }

  // Wait between iterations
  sleep(1);
}

// Setup function - runs once before the test
export function setup() {
  console.log(`Starting MySQL load test against: ${API_HOST}`);
}

// Teardown function - runs once after the test
export function teardown() {
  console.log("MySQL load test completed");
}
