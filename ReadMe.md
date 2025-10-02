# Tortuga - Enhanced Schedule of Classes
Tortuga is an alternative course catalog that has an enhanced UI and feature-rich compabilities compared to [Testudo](https://app.testudo.umd.edu/soc), University of Maryland's official schedule of classes. Tortuga provides faster lookups including an all-in-one interface as well as a notification systems where students can track and get notified of any class openings. 

<img width="1465" height="747" alt="Screenshot 2025-10-01 at 9 15 17 PM" src="https://github.com/user-attachments/assets/f44643ab-bd3e-461d-9010-fb2cdf1ac369" />

<img width="1074" height="664" alt="Screenshot 2025-10-01 at 9 21 39 PM" src="https://github.com/user-attachments/assets/1bc682de-3ef7-435e-b589-c85d532a4cf0" />


## Technologies 

### Frontend Development 
- I used `Nuxt.js` and `TailwindCSS` to build all components of the application 
- I also utlized `FontAwesome Icons` throughout the app to contribute to a clean user experience. 

### Backend Development 
- I used `TypeScript` to write my backend scripts and `MongoDB` to store all user data and notification caches.
- The web scraper (in a different repository) that gathers data from [Testudo](https://app.testudo.umd.edu/soc) is built with `Python`, `FastAPI`, & `BeautifulSoup`.
- The email notification pipeline is built with `TypeScript` and deployed on `AWS Eventbridge` 
