# Tortuga - Enhanced Schedule of Classes
Tortuga is a modern alternative to the University of Maryland’s Testudo course catalog, built to make class planning faster and more intuitive. With its sleek, enhanced interface and powerful search capabilities, Tortuga simplifies the course selection process into a single, all-in-one experience. Students can browse courses effortlessly and subscribe to real-time notifications that alert them the moment a seat opens, ensuring they never miss an opportunity to enroll in the classes they need.

<img width="1465" height="747" alt="Screenshot 2025-10-01 at 9 15 17 PM" src="https://github.com/user-attachments/assets/f44643ab-bd3e-461d-9010-fb2cdf1ac369" />

## Section Slingshot

<img width="1074" height="664" alt="Screenshot 2025-10-01 at 9 21 39 PM" src="https://github.com/user-attachments/assets/1bc682de-3ef7-435e-b589-c85d532a4cf0" />


## Technologies 

### Frontend Development 
- Built all UI components using Nuxt.js and TailwindCSS for a fast and responsive interface.
- Incorporated FontAwesome Icons to maintain a modern and consistent user experience.

### Backend Development 
- Developed backend scripts in TypeScript and managed data persistence with MongoDB for storing user data and notification caches.
- Created a [separate web scraper](https://github.com/sidharthponram916/schedule-of-classes-api) that collects course data from Testudo, leveraging Python, FastAPI, and BeautifulSoup.
- Designed and deployed the email notification pipeline using TypeScript and AWS EventBridge to automate alert delivery.
