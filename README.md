#  Auction House — Semester Project 2

**Author:** Felicia Francina Baptiste  
**Course:** Noroff Front-End Development  
**Project:** Semester Project 2  

---

## Description

Auction House is a fully functional and responsive auction platform built using **HTML**, **CSS**, and **vanilla JavaScript (ES Modules)**. The application integrates with the **Noroff Auction API v2** and allows users to browse listings, place bids, and manage their own auction listings after authentication.

##  Project Links

-  Kanban Board: https://github.com/Flisa81/SP-2-Semester-project/projects?query=is%3Aopen
- [Design & UX Report – Auction House](https://github.com/Flisa81/SP-2-Semester-project/blob/main/Design_UX_Report_Auction_House-Felicia.B.pdf)
-  GitHub Repository: https://github.com/Flisa81/SP-2-Semester-project
-  Deployed Application: https://sp2-auction-house.netlify.app

### Project Focus
- Clean and accessible UI/UX  
- Modular JavaScript structure  
- REST API integration  
- Authentication and authorization  
- CRUD functionality for auction listings  

---

##  Features

### Authentication
- Register with a valid `@stud.noroff.no` email  
- Login with access token and API key handling  
- Persistent session using `localStorage`  
- Redirects for unauthorized access  

### Listings
- View all active listings  
- Search and browse listing cards  
- Single listing view with full details  
- Create listings with:
  - Title  
  - Description  
  - Image URL (media)  
  - Tags  
  - Auction end date  
- Edit and delete listings owned by the logged-in user  

###  Bidding System
- Place bids on other users’ listings  
- View bid history sorted by highest bid  
- Dynamic updates after placing a bid  

###  Profile Page
- Displays user credits  
- Lists all user-created listings  
- Lists all user wins  
- Logout functionality  

###  UI / UX Enhancements
- Fully responsive layout  
- Bootstrap-based components  
- Dynamic navigation (Login → Profile)  
- Fallback images for missing media  

---

## Design Documentation

The Figma design for this project is delivered as a high-fidelity **Design & User Experience Report (PDF)**, as permitted by the assignment guidelines.

The report includes:
- Desktop and mobile layouts  
- Interactive user flows  
- Typography and color style guide  
- UX and universal design explanations  

---

##  Tech Stack
- HTML5  
- CSS3 / Bootstrap 5  
- JavaScript (ES Modules)  
- npm (development tooling)  
- Noroff Auction API v2  
- LocalStorage  

---

##  Installation & Running the Project

This project uses **npm for development tooling only**.  
No front-end frameworks or build tools are used.

### 1. Clone the repository
```bash
git clone https://github.com/Flisa81/SP-2-Semester-project.git
cd auction-house

2. Install dependencies
npm install

3. Run the project locally
npm run dev

The application will be available at:
http://localhost:3000


🌐 API Reference

Base URL:
https://v2.api.noroff.dev

Authentication

POST /auth/register

POST /auth/login

POST /auth/create-api-key

Listings

GET /auction/listings

GET /auction/listings/{id}

POST /auction/listings

PUT /auction/listings/{id}

DELETE /auction/listings/{id}

POST /auction/listings/{id}/bids

Profiles

GET /auction/profiles/{name}

PUT /auction/profiles/{name}

📂 Project Structure
/
├── assets/
│   └── sounds/ (unused)
├── css/
│   └── style.css
├── js/
│   ├── auth/
│   │   ├── login.js
│   │   └── register.js
│   ├── listings/
│   │   ├── createListing.js
│   │   ├── editListing.js
│   │   ├── deleteListing.js
│   │   ├── singleListing.js
│   │   └── getListings.js
│   ├── profile/
│   │   └── getProfile.js
│   └── utils/
│       ├── api.js
│       ├── storage.js
│       └── render.js
├── index.html
├── listings.html
├── login.html
├── register.html
├── single-listing.html
├── create-listing.html
├── edit-listing.html
└── profile.html



## Known Issues

- Some listings may not include images (created by other users)
- Registration requires a valid `@stud.noroff.no` email address
- Editing listings requires a valid listing ID in the URL

## Future Improvements

- Dark mode
- Multi-image upload
- Improved search and filtering
- Real-time bidding using WebSockets
- Avatar upload feature

## Credits

- **Developer:** Felicia Francina Baptiste
- **Course:** Noroff Front-End Development
- **API:** Noroff Auction API v2

## License

This project was created for educational purposes only as part of the Noroff Front-End Development program.