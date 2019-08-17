# E-Dialectics
## Overview

  We have called our project “E-Dialectics” (short for “Electronic Dialectics”) as we intended it to be an electronic medium where people with different point of views can engage in discourses (dialectics) with each other. The project is inspired from Reddit and the initial data is populated from a sample of real Reddit data that was retrieved using Google Big-Query. The database is implemented using both SQL and NoSQL technologies in a complementary fashion. Users of E-Dialectics can read discussion threads and the comments for them, which are created by other users; each thread can also be under different subforums (eg. philosophy, computer science, science etc.). Anyone can read the threads and comments, but to be able to interact further they must login to the site; new users can create their own accounts. Users can then create new threads and comments after they log into their account. 

  Threads have a title along with a text body (optional) which can have paragraphs and URLs. When the user selects a thread all top-level comments, direct responses to the thread, on that thread are loaded. The user can comment on the thread or on some other comment. Comments on comments, subcomments, can be loaded through a click of a button. Also, comments can be infinitely nested. 
  
  Users can vote on both threads and comments. Each vote has a value of either +1 (for a upvote) or -1 (for a downvote) depending on if the user liked or disliked the content respectively. Users can also remove their own comments. Some users with moderation permissions can any comments or threads within the subforums that they moderate.
  
  Anyone who wants to interact with other people over the world through the internet, or share their mind can find this kind of forum appealing. They are our target users. 

## Front-end Technologies
### [Vue.js](https://vuejs.org/)

Description: Vue.js is an open source progressive JavaScript framework used for building either user-interfaces and sophisticated Single Page Applications (SPA). In SPA, we load one html file and update its components dynamically based on user input and the state of the application; our project is also of this type.

Justification: Vue.js is a powerful JavaScript framework competitive with Angular and React. It is quickly gaining popularity over other frameworks among web developers around the world. It is easy to pick up and it has excelled documentations over the net. As a JavaScript framework, it allows us to implement various client side logic in a more manageable manner compared to plain JavaScript. We setup our project with vue-cli which also allows real-time verification of changes enabling faster development time. It is also very modular, which means we can use reuse more code. 

### [Axios](https://github.com/axios/axios)

Description: Axios is a promise-based HTTP client for the browser and node.js

Justification: It allows asynchronous (thanks to promise-based API)  communication between the client and server (node.js). 

## Back-end Technologies
### [Node.js](https://nodejs.org/en/)

Description: Node.js is an asynchronous event-based Javascript runtime designed to handle many different connections concurrently. It uses non-blocking I/O, and it is built upon Chrome's V8 engine, to provide fast, highly scalable servers.

Justification: Node.js is an on-demand web technology in the industry for its unique features. With Node.js and Vue.js stack we can have our entire application based on one language - JavaScript. Being asynchronously driven, after sending a task to the database, Node.js can carry on to the next request, eliminating any need for waiting. As such, Node.js can be run in a single threaded memory-efficient manner; we do not have to worry about dead-locking. It also comes up with multiple modules of high-level abstraction (like express.js) that makes it easier to use. 

### [XAMPP](https://www.apachefriends.org/index.html)

Description: XAMPP is a free, open-source, cross-platform web server solution stack package.

Justification: It allows us to use Apache and MySQL at the same time to let us interact with MySQL database through a browser GUI. It can serve MySQL (MariaDB)  locally. 

## Other auxiliary technologies:
- Vue-CLI to setup our project.
- Vuex for client-side state management.
- sweet-alert-2 for better JavaScript popup alerts.
- ckeditor v5 for text editors.
- MongoDB and MySQL modules of Node.js to connect to the respective databases.
- express.js for Node.js to have higher level abstractions for request handling codes.
- Node.js module CORS for Cross-Origin Resource Sharing.
- moment.js to format time and date. 

## Teamwork
- Frontend development: Cortez, Dan, Jishnu
- Backend development: Cortez, Dan, Jishnu
- Real data aggregation: Emily, Jishnu
- SQL Testing: Cortez, Dan, Emily, Jishnu
- NoSQL: Cortez, Jishnu
- Documentation: Cortez, Dan, Emily, Jishnu
- Database design: Cortez, Dan, Emily, Jishnu

# Setup
Coming soon...
