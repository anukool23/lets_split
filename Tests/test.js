import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  cloud: {
    // Project: Test T1
    projectID: 3717123,
    // Test runs with the same name groups test runs together.
    name: 'Test 123'
  }
};

export default function() {
  http.get('http://localhost:3091/user/getprofiledetail');
  sleep(1);
}