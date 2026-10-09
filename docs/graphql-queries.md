# GraphQL Test Operations

Use these operations in GraphiQL or Postman with GraphQL requests.

Endpoints:

- Auth: `http://localhost:3001/graphql`
- Scheduling: `http://localhost:3002/graphql`

For protected operations, add:

```text
Authorization: Bearer <accessToken>
```

## 1. Register

```graphql
mutation Register {
  register(registerUserInput: {
    email: "alice@example.com"
    password: "password123"
  }) {
    id
    email
    accessToken
  }
}
```

## 2. Login

```graphql
mutation Login {
  login(loginInput: {
    email: "alice@example.com"
    password: "password123"
  }) {
    id
    email
    accessToken
  }
}
```

Save the returned `accessToken` for protected requests.

## 3. Validate Token

```graphql
query ValidateToken {
  validateToken(token: "<accessToken>") {
    id
    email
    accessToken
    createdAt
    updatedAt
  }
}
```

## 4. Customer Operations


### Create Customers

```graphql
mutation CreateCustomers {
  customer1: createCustomer(createCustomerInput: {
    name: "Alice Anderson"
    email: "alice@example.com"
  }) {
    id
    name
    email
  }
  customer2: createCustomer(createCustomerInput: {
    name: "Bob Martin"
    email: "bob@example.com"
  }) {
    id
    name
    email
  }
}
```

Save the returned customer IDs.

### List Customers

```graphql
query GetCustomers {
  getAllCustomers(page: 1, limit: 10) {
    data { id name email createdAt updatedAt }
    meta { total page limit }
  }
}
```

### Get Customer by ID

```graphql
query GetCustomer {
  getCustomerById(id: "CUSTOMER_ID_1") {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

### Update Customer

```graphql
mutation UpdateCustomer {
  updateCustomer(updateCustomerInput: {
    id: "CUSTOMER_ID_1"
    name: "Alice Updated"
    email: "alice.updated@example.com"
  }) {
    id
    name
    email
    updatedAt
  }
}
```

### Delete Customer

```graphql
mutation DeleteCustomer {
  deleteCustomer(id: "CUSTOMER_ID_1")
}
```

## 5. Doctor Operations

### Create Six Doctors

```graphql
mutation CreateDoctors {
  doctor1: createDoctor(createDoctorInput: { name: "Dr. Sarah Johnson" }) { id name }
  doctor2: createDoctor(createDoctorInput: { name: "Dr. Michael Chen" }) { id name }
  doctor3: createDoctor(createDoctorInput: { name: "Dr. Emily Williams" }) { id name }
  doctor4: createDoctor(createDoctorInput: { name: "Dr. Daniel Brown" }) { id name }
  doctor5: createDoctor(createDoctorInput: { name: "Dr. Olivia Davis" }) { id name }
  doctor6: createDoctor(createDoctorInput: { name: "Dr. James Wilson" }) { id name }
}
```

### Get Doctor by ID

```graphql
query GetDoctor {
  getDoctorById(id: "DOCTOR_ID_1") {
    id
    name
    createdAt
    updatedAt
  }
}
```

### Update Doctor

```graphql
mutation UpdateDoctor {
  updateDoctor(updateDoctorInput: {
    id: "DOCTOR_ID_1"
    name: "Dr. Sarah Johnson Updated"
  }) {
    id
    name
    updatedAt
  }
}
```

### Delete Doctor

```graphql
mutation DeleteDoctor {
  deleteDoctor(id: "DOCTOR_ID_1")
}
```

### Doctor Pagination

```graphql
query GetDoctorsPageOne {
  getAllDoctors(page: 1, limit: 3) {
    data { id name createdAt updatedAt }
    meta { total page limit }
  }
}
```

```graphql
query GetDoctorsPageTwo {
  getAllDoctors(page: 2, limit: 3) {
    data { id name }
    meta { total page limit }
  }
}
```

## 6. Schedule Operations

### Create Six Schedules

Replace the placeholder IDs with IDs returned by the customer and doctor mutations.

```graphql
mutation CreateSchedules {
  schedule1: createSchedule(createScheduleInput: {
    objective: "Dental checkup"
    doctorId: "DOCTOR_ID_1"
    customerId: "CUSTOMER_ID_1"
    scheduledAt: "2026-11-01T09:00:00.000Z"
  }) { id objective doctorId customerId scheduledAt }

  schedule2: createSchedule(createScheduleInput: {
    objective: "Annual health examination"
    doctorId: "DOCTOR_ID_2"
    customerId: "CUSTOMER_ID_2"
    scheduledAt: "2026-11-02T10:00:00.000Z"
  }) { id objective doctorId customerId scheduledAt }

  schedule3: createSchedule(createScheduleInput: {
    objective: "Cardiology consultation"
    doctorId: "DOCTOR_ID_3"
    customerId: "CUSTOMER_ID_1"
    scheduledAt: "2026-11-03T11:00:00.000Z"
  }) { id objective doctorId customerId scheduledAt }

  schedule4: createSchedule(createScheduleInput: {
    objective: "Follow-up consultation"
    doctorId: "DOCTOR_ID_4"
    customerId: "CUSTOMER_ID_2"
    scheduledAt: "2026-11-04T13:00:00.000Z"
  }) { id objective doctorId customerId scheduledAt }

  schedule5: createSchedule(createScheduleInput: {
    objective: "Blood test"
    doctorId: "DOCTOR_ID_5"
    customerId: "CUSTOMER_ID_1"
    scheduledAt: "2026-11-05T14:00:00.000Z"
  }) { id objective doctorId customerId scheduledAt }

  schedule6: createSchedule(createScheduleInput: {
    objective: "Dental follow-up"
    doctorId: "DOCTOR_ID_6"
    customerId: "CUSTOMER_ID_2"
    scheduledAt: "2026-11-06T15:00:00.000Z"
  }) { id objective doctorId customerId scheduledAt }
}
```

### Get Schedule by ID

```graphql
query GetSchedule {
  getScheduleById(id: "SCHEDULE_ID") {
    id
    objective
    doctorId
    customerId
    scheduledAt
    createdAt
    updatedAt
  }
}
```

### Schedule Pagination

```graphql
query GetSchedulesPageOne {
  getAllSchedules(page: 1, limit: 3) {
    data {
      id
      objective
      doctorId
      customerId
      scheduledAt
    }
    meta { total page limit }
  }
}
```

### Filter by Objective

The objective filter uses case-insensitive partial matching.

```graphql
query SearchDentalSchedules {
  getAllSchedules(page: 1, limit: 10, objective: "Dental") {
    data { id objective doctorId customerId scheduledAt }
    meta { total page limit }
  }
}
```

### Filter by Doctor and Customer

```graphql
query SearchByDoctorAndCustomer {
  getAllSchedules(
    page: 1
    limit: 10
    doctorId: "DOCTOR_ID_1"
    customerId: "CUSTOMER_ID_1"
  ) {
    data { id objective doctorId customerId scheduledAt }
    meta { total page limit }
  }
}
```

### Filter by Date Range

```graphql
query SearchByDateRange {
  getAllSchedules(
    page: 1
    limit: 10
    scheduledFrom: "2026-11-01T00:00:00.000Z"
    scheduledTo: "2026-11-30T23:59:59.999Z"
  ) {
    data { id objective scheduledAt }
    meta { total page limit }
  }
}
```

### Delete Schedule

```graphql
mutation DeleteSchedule {
  deleteSchedule(id: "SCHEDULE_ID")
}
```

## Postman Request Format

Create a `POST` request to one of the GraphQL endpoints with this header:

```text
Content-Type: application/json
Authorization: Bearer <accessToken>
```

Use this JSON body:

```json
{
  "query": "query GetDoctors { getAllDoctors(page: 1, limit: 3) { data { id name } meta { total page limit } } }"
}
```
