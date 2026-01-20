# ATS Database Structure

## Database: `ats_system`
Connection: `mongodb://localhost:27017/ats_system`

---

## 📋 Collections Overview

### 1. **users** - System Users
**Purpose**: Store admin, leader, and recruiter accounts

**Collection Name**: `users`

**Fields**:
- `_id` - MongoDB ObjectId (auto-generated)
- `email` - String (unique, lowercase) - User's email
- `name` - String - Full name
- `password` - String (hashed with bcrypt) - **Hidden by default**
- `role` - String - One of: `ADMIN`, `LEADER`, `RECRUITER`
- `createdAt` - Date (auto-generated)
- `updatedAt` - Date (auto-updated)

**Find Your Admin User**:
```javascript
db.users.find({ role: "ADMIN" })
db.users.find({ email: "your-email@example.com" })
```

---

### 2. **companies** - Client Companies
**Purpose**: Store companies that have job openings

**Collection Name**: `companies`

**Fields**:
- `_id` - MongoDB ObjectId
- `name` - String - Company name
- `industry` - String - Industry type
- `website` - String (optional) - Company website
- `contactPerson` - String - Primary contact name
- `contactEmail` - String - Contact email
- `contactPhone` - String - Contact phone
- `address` - String (optional) - Office address
- `status` - String - One of: `ACTIVE`, `INACTIVE`, `PROSPECT`
- `notes` - String (optional) - Additional notes
- `createdAt` - Date
- `updatedAt` - Date

**Find Companies**:
```javascript
db.companies.find({ status: "ACTIVE" })
db.companies.find({ name: /search-term/i })
```

---

### 3. **joborders** - Job Openings
**Purpose**: Store job positions from companies

**Collection Name**: `joborders`

**Fields**:
- `_id` - MongoDB ObjectId
- `title` - String - Job title
- `company` - ObjectId - Reference to `companies._id`
- `description` - String - Job description
- `requirements` - String - Job requirements
- `location` - String - Job location
- `jobType` - String - One of: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `TEMPORARY`
- `experienceLevel` - String - One of: `ENTRY`, `MID`, `SENIOR`, `LEAD`, `EXECUTIVE`
- `salaryMin` - Number (optional) - Minimum salary
- `salaryMax` - Number (optional) - Maximum salary
- `openings` - Number - Number of positions
- `status` - String - One of: `OPEN`, `ON_HOLD`, `FILLED`, `CANCELLED`
- `priority` - String - One of: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- `assignedTo` - ObjectId - Reference to `users._id`
- `startDate` - Date (optional) - Position start date
- `deadline` - Date (optional) - Hiring deadline
- `createdAt` - Date
- `updatedAt` - Date

**Find Job Orders**:
```javascript
db.joborders.find({ status: "OPEN" })
db.joborders.find({ priority: "HIGH" })
db.joborders.find({ company: ObjectId("...") }) // Replace with actual ID
```

**Find with Company Details** (MongoDB Compass):
```javascript
db.joborders.aggregate([
  { $lookup: { from: "companies", localField: "company", foreignField: "_id", as: "companyDetails" } }
])
```

---

### 4. **candidates** - Job Applicants
**Purpose**: Store candidate profiles

**Collection Name**: `candidates`

**Fields**:
- `_id` - MongoDB ObjectId
- `firstName` - String - First name
- `lastName` - String - Last name
- `email` - String (unique) - Email address
- `phone` - String - Phone number
- `currentTitle` - String (optional) - Current job title
- `currentCompany` - String (optional) - Current employer
- `experience` - Number - Years of experience
- `education` - String - Educational background
- `skills` - Array of Strings - Skills list
- `resume` - String (optional) - Resume file path/URL
- `linkedin` - String (optional) - LinkedIn profile
- `location` - String - Current location
- `expectedSalary` - Number (optional) - Expected salary
- `noticePeriod` - Number (optional) - Notice period in days
- `status` - String - One of: `ACTIVE`, `PLACED`, `INACTIVE`, `BLACKLISTED`
- `source` - String - How candidate was found
- `notes` - String (optional) - Additional notes
- `addedBy` - ObjectId - Reference to `users._id`
- `createdAt` - Date
- `updatedAt` - Date

**Find Candidates**:
```javascript
db.candidates.find({ status: "ACTIVE" })
db.candidates.find({ email: "candidate@example.com" })
db.candidates.find({ skills: { $in: ["JavaScript", "React"] } })
```

---

### 5. **interviews** - Interview Schedules
**Purpose**: Track interview schedules and results

**Collection Name**: `interviews`

**Fields**:
- `_id` - MongoDB ObjectId
- `candidate` - ObjectId - Reference to `candidates._id`
- `jobOrder` - ObjectId - Reference to `joborders._id`
- `scheduledAt` - Date - Interview date and time
- `duration` - Number - Duration in minutes
- `round` - String - One of: `PHONE_SCREEN`, `TECHNICAL`, `HR`, `FINAL`, `CLIENT`
- `mode` - String - One of: `IN_PERSON`, `VIDEO`, `PHONE`
- `location` - String (optional) - Interview location/link
- `interviewer` - String - Interviewer name
- `status` - String - One of: `SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`, `RESCHEDULED`
- `feedback` - String (optional) - Interview feedback
- `rating` - Number (optional) - Rating out of 10
- `result` - String (optional) - One of: `SELECTED`, `REJECTED`, `ON_HOLD`, `PENDING`
- `notes` - String (optional) - Additional notes
- `createdAt` - Date
- `updatedAt` - Date

**Find Interviews**:
```javascript
db.interviews.find({ status: "SCHEDULED" })
db.interviews.find({ candidate: ObjectId("...") })
db.interviews.find({ scheduledAt: { $gte: new Date() } }) // Upcoming
```

**Find with Full Details**:
```javascript
db.interviews.aggregate([
  { $lookup: { from: "candidates", localField: "candidate", foreignField: "_id", as: "candidateDetails" } },
  { $lookup: { from: "joborders", localField: "jobOrder", foreignField: "_id", as: "jobDetails" } }
])
```

---

### 6. **offers** - Job Offers
**Purpose**: Track job offers sent to candidates

**Collection Name**: `offers`

**Fields**:
- `_id` - MongoDB ObjectId
- `candidate` - ObjectId - Reference to `candidates._id`
- `jobOrder` - ObjectId - Reference to `joborders._id`
- `offeredSalary` - Number - Offered salary amount
- `joiningDate` - Date - Expected joining date
- `status` - String - One of: `PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`, `NEGOTIATING`
- `offerLetterUrl` - String (optional) - Offer letter file path/URL
- `validUntil` - Date (optional) - Offer expiry date
- `benefits` - String (optional) - Benefits description
- `notes` - String (optional) - Additional notes
- `offeredBy` - ObjectId - Reference to `users._id`
- `respondedAt` - Date (optional) - When candidate responded
- `createdAt` - Date
- `updatedAt` - Date

**Find Offers**:
```javascript
db.offers.find({ status: "PENDING" })
db.offers.find({ candidate: ObjectId("...") })
db.offers.find({ status: "ACCEPTED", joiningDate: { $gte: new Date() } })
```

---

## 🔍 Quick Find Queries

### Find Your Admin User
```javascript
db.users.find({ role: "ADMIN" }).pretty()
```

### Count All Documents
```javascript
db.users.countDocuments()
db.companies.countDocuments()
db.joborders.countDocuments()
db.candidates.countDocuments()
db.interviews.countDocuments()
db.offers.countDocuments()
```

### View All Collections
```javascript
show collections
```

### View Sample Data
```javascript
db.users.findOne()
db.companies.findOne()
db.joborders.findOne()
```

---

## 🔗 Relationships

```
users (recruiters)
  └── joborders.assignedTo → users._id
  └── candidates.addedBy → users._id
  └── offers.offeredBy → users._id

companies
  └── joborders.company → companies._id

joborders
  └── interviews.jobOrder → joborders._id
  └── offers.jobOrder → joborders._id

candidates
  └── interviews.candidate → candidates._id
  └── offers.candidate → candidates._id
```

---

## 📊 MongoDB Compass Instructions

1. **Connect**: `mongodb://localhost:27017`
2. **Select Database**: `ats_system`
3. **View Collections**: Click on any collection in the left sidebar
4. **Find Documents**: Use the filter bar with JSON queries
5. **View Relationships**: Use the Aggregations tab for $lookup queries

---

## 🛠️ Useful Commands

### Delete All Data (Fresh Start)
```javascript
db.users.deleteMany({})
db.companies.deleteMany({})
db.joborders.deleteMany({})
db.candidates.deleteMany({})
db.interviews.deleteMany({})
db.offers.deleteMany({})
```

### Export Collection
```bash
mongoexport --db=ats_system --collection=users --out=users.json
```

### Import Collection
```bash
mongoimport --db=ats_system --collection=users --file=users.json
```
