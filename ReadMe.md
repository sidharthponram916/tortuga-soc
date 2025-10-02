# Tortuga - Enhanced Schedule of Classes
Tortuga is an alternative course catalog that has an enhanced UI and feature-rich compabilities compared to [Testudo](https://app.testudo.umd.edu/soc), University of Maryland's existing SOC platform. Tortuga provides faster lookups including an all-in-one interface as well as a notification systems where students can track and get notified of any class openings. 

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
