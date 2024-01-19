## About The Project

This project implements an API service for looking up IMDb entries and finding associated YouTube videos. It aggregates and integrates two public RapidAPI services:

- IMDb API (https://rapidapi.com/apidojo/api/imdb8): Searches the IMDb database by title.

- YouTube Search API (https://rapidapi.com/elisbushaj2/api/youtube-search-api): Fetches YouTube video data related to the title.

By combining data from both APIs, the service returns enriched results with IMDb title information and associated YouTube videos.

## Behind the scene services
The aggregator service coordinates data fetching between the IMDB and YouTube services. It first checks its own collection for the requested title. If not found, it asks the IMDB service to lookup the title in its database or call the IMDB API. The IMDB service returns an object to the aggregator. The aggregator then asks the YouTube service to find related videos using the title and release year from the IMDB object. The YouTube service calls the YouTube API, stores the videos, and returns them to the aggregator. The aggregator combines the IMDB and YouTube data into a final response object which is returned to the user and stored.

## Run API locally
To get the REST API service running locally on your machine, follow these simple steps:

1. Clone the repository to your local machine
2. Inside the server folder, create a `.env` file with the variables given in the `.env.example` file
3. Still in the same server folder, run the following command in your terminal/command prompt:

   ```sh
   npm install && npm run build && npm start
   ```

   This will install dependencies, build the TypeScript code, and start the Node.js server.

4. Once the app finishes building and starts, you can test it by interacting with the API endpoints given below.


## Run API using docker image
To get the REST API service running using a docker image, follow these simple steps:

1. Clone the repository
2. Create a `.env` file in the server folder with the appropriate variables and values
3. At the root folder, run the `build_and_run_server_image.sh` bash script as follows:
   ```sh
   chmod +x build_and_run_server_image.sh && ./build_and_run_server_image.sh
   ```
4. The above script will build and run a docker image of the REST API. It will also create two other image containers for Redis and mongodb community server. To avoid any conflicts with existing local instances, make sure to stop any mongodb server and/or redis services you may have running before executing the script.



## Endpoints
The REST API service exposes the following endpoints:

### Search by term
This endpoint returns the aggregated document whose title field matches or contains the value of `term`. It searches the local database first, then calls the IMDB and YouTube APIs if no match is found, in order to return the most complete aggregated result.


- **Endpoint**: `http://127.0.0.1:5000/api/aggregators/search`
- **Method**: `POST`
- **Request Body**:
  ```json
    {
      "term": "Doctor Strange"
    }
  ```
- **Response Body**: 
  
  ```json
    {
        "_id": "65a9a14e4ab0f91d584fc0dc",
        "imdbId": "/title/tt1211837/",
        "image": {
            "height": 2048,
            "id": "/title/tt1211837/images/rm3012758016",
            "url": "https://m.media-amazon.com/images/M/MV5BNjgwNzAzNjk1Nl5BMl5BanBnXkFtZTgwMzQ2NjI1OTE@._V1_.jpg",
            "width": 1382
        },
        "runningTimeInMinutes": 115,
        "title": "Doctor Strange",
        "titleType": "movie",
        "year": 2016,
        "principals": [
            {
                "id": "/name/nm1212722/",
                "legacyNameText": "Cumberbatch, Benedict",
                "name": "Benedict Cumberbatch",
                "billing": 1,
                "category": "actor",
                "characters": [
                    "Dr. Stephen Strange"
                ],
                "roles": [
                    {
                        "character": "Dr. Stephen Strange",
                        "characterId": "/character/ch0387980/"
                    }
                ]
            },
            {
                "id": "/name/nm0252230/",
                "legacyNameText": "Ejiofor, Chiwetel",
                "name": "Chiwetel Ejiofor",
                "billing": 2,
                "category": "actor",
                "characters": [
                    "Mordo"
                ],
                "roles": [
                    {
                        "character": "Mordo",
                        "characterId": "/character/ch0036438/"
                    }
                ]
            },
            {
                "disambiguation": "I",
                "id": "/name/nm1046097/",
                "legacyNameText": "McAdams, Rachel (I)",
                "name": "Rachel McAdams",
                "billing": 3,
                "category": "actress",
                "characters": [
                    "Dr. Christine Palmer"
                ],
                "roles": [
                    {
                        "character": "Dr. Christine Palmer"
                    }
                ]
            }
        ],
        "relatedYoutubeVideos": [
            {
                "videoId": "h7gvFravm4A",
                "thumbnail": "https://i.ytimg.com/vi/h7gvFravm4A/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAIAd-JffFdjh8Xqct6oRf0GsP4WQ",
                "title": "Doctor Strange Official Trailer 1 (2016) - Benedict Cumberbatch Movie",
                "author": {
                    "profile": "https://yt3.ggpht.com/_XxIsLgks3G7PJ1Yhfq6GWBeDr2PfYIi9xrbz-7AnsaiutSh6pItq4odcQgXRAvCn1KuGqlj4g=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Rotten Tomatoes Trailers"
                },
                "viewCount": "4.8M views",
                "duration": "2:22",
                "published": "7 years ago",
                "description": "After his career is destroyed, a brilliant but arrogant and conceited surgeon gets a new lease on life when a sorcerer takes him ..."
            },
            {
                "videoId": "GOOkWuzPIv8",
                "thumbnail": "https://i.ytimg.com/vi/GOOkWuzPIv8/hq720.jpg?sqp=-oaymwExCNAFEJQDSFryq4qpAyMIARUAAIhCGAHwAQH4AdQGgALgA4oCDAgAEAEYSiBlKGAwDw==&rs=AOn4CLA41R7TiwaurRe15W1rLau_KW0loA",
                "title": "dr strange surgery scene #Movieclips",
                "author": {
                    "profile": "https://yt3.ggpht.com/ytc/AIf8zZRMkvbCbo-3fwb5BfZH6qy-wLRMIuaNPuBlq7MjsFvxk9ReI8tnBhREvWWUFQ55=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Hungry"
                },
                "viewCount": "441K views",
                "duration": "4:11",
                "published": "2 years ago",
                "description": "Surrender Stephen Strange, Surrender! Doctor Strange - Open your eye Tony stark meets dr strange avengers infinity war ..."
            },
            {
                "videoId": "XXMjzTMeZE4",
                "thumbnail": "https://i.ytimg.com/vi/XXMjzTMeZE4/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBY7ZgpSc2GwjWUKNGG6peUiL5Aow",
                "title": "Dr. Strange & The Ancient One - \"It's Not About You\" Scene | Doctor Strange (2016) Movie Clip HD 4K",
                "author": {
                    "profile": "https://yt3.ggpht.com/DP_nMt7bdKwDo_NHUtWW698GUgtPfIxYMZ41y69ya6NPv8Z9juh0nQAy7Ys5qjpDgz3eOwbe_0w=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Filmey Box"
                },
                "viewCount": "379K views",
                "duration": "3:44",
                "published": "2 years ago",
                "description": "Dr. Strange and The Ancient One - \"It's Not About You\" - Sorcerer Supreme Death Scene | Doctor Strange (2016) Movie Clip 4K ..."
            },
            {
                "videoId": "RwUptiSvXuU",
                "thumbnail": "https://i.ytimg.com/vi/RwUptiSvXuU/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDPDFbGqTzXnDQRqeUTxEi2Q0ALYA",
                "title": "Dr. Strange Car Crash Scene | Doctor Strange (2016) Movie Clip HD 4K",
                "author": {
                    "profile": "https://yt3.ggpht.com/DP_nMt7bdKwDo_NHUtWW698GUgtPfIxYMZ41y69ya6NPv8Z9juh0nQAy7Ys5qjpDgz3eOwbe_0w=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Filmey Box"
                },
                "viewCount": "190K views",
                "duration": "3:45",
                "published": "1 year ago",
                "description": "Dr. Strange Car Crash Scene | Doctor Strange (2016) Movie Clip 4K Ultra HD [Open Matte] Cast: Benedict Cumberbatch, Chiwetel ..."
            },
            {
                "videoId": "LrHTR22pIhw",
                "thumbnail": "https://i.ytimg.com/vi/LrHTR22pIhw/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLALQiAcR60m8YPA6Tl-tRdTNMW13A",
                "title": "DOCTOR STRANGE Movie Clip - Dormammu, I've Come To Bargain Scene (2016)",
                "author": {
                    "profile": "https://yt3.ggpht.com/w9IESz1N7hF8yvVLMyO5XbzXlYHzZXX314GqYb7NkWkVxjYxpgzl2G6vhZAUtLbEdLRLLecakw=s68-c-k-c0x00ffffff-no-rj",
                    "name": "JoBlo Movie Clips"
                },
                "viewCount": "11M views",
                "duration": "4:01",
                "published": "4 years ago",
                "description": "DOCTOR STRANGE Movie Clip - Dormammu, I've Come To Bargain Scene |4K ULTRA HD| 2016 SUBSCRIBE for more Movie ..."
            },
            {
                "videoId": "il27ttA5eXY",
                "thumbnail": "https://i.ytimg.com/vi/il27ttA5eXY/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCyC5C-eZ9vvyXuihDpkFsFrpgTNQ",
                "title": "Dr. Strange vs Kaecilius & Zealots - First Fight Scene | Doctor Strange (2016) IMAX Movie Clip HD 4K",
                "author": {
                    "profile": "https://yt3.ggpht.com/DP_nMt7bdKwDo_NHUtWW698GUgtPfIxYMZ41y69ya6NPv8Z9juh0nQAy7Ys5qjpDgz3eOwbe_0w=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Filmey Box"
                },
                "viewCount": "305K views",
                "duration": "4:42",
                "published": "2 years ago",
                "description": "Dr. Strange vs Kaecilius and Zealots - First Fight - New York Sanctum - Full Battle Scene | Doctor Strange (2016) IMAX Movie Clip ..."
            },
            {
                "videoId": "HSzx-zryEgM",
                "thumbnail": "https://i.ytimg.com/vi/HSzx-zryEgM/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBi0T17N0LsqLtg2DU3dNBNK788Mg",
                "title": "Doctor Strange Official Trailer 2",
                "author": {
                    "profile": "https://yt3.ggpht.com/ugAmG9LeliJJoiyacIecdiq_ZgRNdmjCIohaN5x3QEOmWB9dNUsKuCU8ngLs3JUauHZ4-boVkA=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Marvel Entertainment"
                },
                "viewCount": "44M views",
                "duration": "2:22",
                "published": "7 years ago",
                "description": "See Marvel's \"Doctor Strange,\" in theaters November 4, 2016. ▻ Subscribe to Marvel: http://bit.ly/WeO3YJ Watch more from ..."
            },
            {
                "videoId": "_W0fJBAFxaU",
                "thumbnail": "https://i.ytimg.com/vi/_W0fJBAFxaU/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAjNDBZqcP5D4X2jNBqaXK4MmMO9Q",
                "title": "Marvel Studios' Doctor Strange (2016) - Time's Restoration | Movie Clip HD",
                "author": {
                    "profile": "https://yt3.ggpht.com/ytc/AIf8zZSAGY0ukxTB7L5uK4_JHNuIWUgF96hzZXPX8f5PBg=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Marvel Universe Entertainment"
                },
                "viewCount": "211K views",
                "duration": "3:58",
                "published": "11 months ago",
                "description": "Credits:- TM & ©Disney About movie: Doctor Strange is a 2016 American superhero film based on the Marvel Comics character of ..."
            },
            {
                "videoId": "fgTo0Hvzztg",
                "thumbnail": "https://i.ytimg.com/vi/fgTo0Hvzztg/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDkKM4mTZVUHdDwWC6Tb3vfHENj7A",
                "title": "DOCTOR STRANGE 3 MULTIVERSAL TEAM?! Crazy MCU Rumors!",
                "author": {
                    "profile": "https://yt3.ggpht.com/0I_KiAkKEGtlBwzQyhzB8TpBmUczomO6E2bsm0IWcSJ6ICASWCBIx_tLdO0vfF06I5jD-FcJpA=s68-c-k-c0x00ffffff-no-rj",
                    "name": " Superhero Cuts"
                },
                "viewCount": "492 views",
                "duration": "5:31",
                "published": "2 days ago",
                "description": "Brace yourselves for a magical journey into the unknown as we explore the highly anticipated Doctor Strange in the Multiverse of ..."
            },
            {
                "videoId": "Lt-U_t2pUHI",
                "thumbnail": "https://i.ytimg.com/vi/Lt-U_t2pUHI/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD4te7GGLe8xN0PKcKdavLufXkyPw",
                "title": "Marvel's Doctor Strange Teaser Trailer",
                "author": {
                    "profile": "https://yt3.ggpht.com/ugAmG9LeliJJoiyacIecdiq_ZgRNdmjCIohaN5x3QEOmWB9dNUsKuCU8ngLs3JUauHZ4-boVkA=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Marvel Entertainment"
                },
                "viewCount": "25M views",
                "duration": "2:03",
                "published": "7 years ago",
                "description": "Witness the power of the Sorcerer Supreme in the first teaser for Marvel's 'Doctor Strange,' in theaters November 4! ▻ Subscribe ..."
            },
            {
                "videoId": "Y8FkliL3MfQ",
                "thumbnail": "https://i.ytimg.com/vi/Y8FkliL3MfQ/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCjYPCvEz4PbeQ2akSrxHhUE9XigQ",
                "title": "Dr Strange Hospital Fight Scene English | Doctor Strange (2016) | #DoctorStrangeClips",
                "author": {
                    "profile": "https://yt3.ggpht.com/ugiXM8BLGxRFSEklF8bmAdtCr7F2iaRAaIOWoJj-q5lgwxXG4SJy5jkbN4rvgZ2lLN5cWjXhL0o=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Kaji Collections"
                },
                "viewCount": "130K views",
                "duration": "4:47",
                "published": "1 year ago",
                "description": "Scene - Stephen Strange First Mirror Dimension Fight Scene. #DoctorStrangeClips Movie - Doctor Strange (2016) I Do Not Own ..."
            },
            {
                "videoId": "tMRIOOvEeg4",
                "thumbnail": "https://i.ytimg.com/vi/tMRIOOvEeg4/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAlOoKgGNpCOnxhxkxsHtCQMMqQXg",
                "title": "\"OPEN YOUR EYE\" - Doctor Strange Meets the Ancient One - Doctor Strange (2016) Movie Clip",
                "author": {
                    "profile": "https://yt3.ggpht.com/ytc/AIf8zZQIQdo5_7jQaVoY7gVHi34qQU-Dj9PwjtLTzAHTFQ=s68-c-k-c0x00ffffff-no-rj",
                    "name": "BestScene"
                },
                "viewCount": "301K views",
                "duration": "3:47",
                "published": "2 years ago",
                "description": "Doctor Strange Meets the Ancient One Scene - Open your eye - \"Who are you in this vast multiverse?\" Scene - Doctor Strange ..."
            },
            {
                "videoId": "zVXtH6EwLT0",
                "thumbnail": "https://i.ytimg.com/vi/zVXtH6EwLT0/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDsFxFQhab_xsEC5X6GiCUQhijeaA",
                "title": "DOCTOR STRANGE Trailer 2 (2016)",
                "author": {
                    "profile": "https://yt3.ggpht.com/Bxn3B2O3i3IwSLlkthvWRrVEEZVuxQKCJKEtT8__G_30lt8a7Ipyr_ZwiwJwOw4pvi5OFse6fLQ=s68-c-k-c0x00ffffff-no-rj",
                    "name": "KinoCheck.com"
                },
                "viewCount": "258K views",
                "duration": "2:29",
                "published": "7 years ago",
                "description": "#DoctorStrange is a new movie by Scott Derrickson, starring Benedict Cumberbatch, Tilda Swinton and Chiwetel Ejiofor."
            },
            {
                "videoId": "21noYPJ-tr0",
                "thumbnail": "https://i.ytimg.com/vi/21noYPJ-tr0/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC6f4NeldNp9WPkwI5pDxmIYdZ3Hg",
                "title": "Dr. Strange at Mount Everest - \"Surrender\" Scene | Doctor Strange (2016) IMAX Movie Clip HD 4K",
                "author": {
                    "profile": "https://yt3.ggpht.com/DP_nMt7bdKwDo_NHUtWW698GUgtPfIxYMZ41y69ya6NPv8Z9juh0nQAy7Ys5qjpDgz3eOwbe_0w=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Filmey Box"
                },
                "viewCount": "256K views",
                "duration": "3:49",
                "published": "2 years ago",
                "description": "Dr. Strange at Mount Everest - \"Surrender\" Scene | Doctor Strange (2016) IMAX Movie Clip 4K Ultra HD Cast: Benedict ..."
            },
            {
                "videoId": "xU_MaugORAI",
                "thumbnail": "https://i.ytimg.com/vi/xU_MaugORAI/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBdhKIHIUG6xCpuj7wMXtpQmy-iVQ",
                "title": "Kaecilius' Defeat Scene | Doctor Strange (2016) IMAX Movie Clip HD 4K",
                "author": {
                    "profile": "https://yt3.ggpht.com/DP_nMt7bdKwDo_NHUtWW698GUgtPfIxYMZ41y69ya6NPv8Z9juh0nQAy7Ys5qjpDgz3eOwbe_0w=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Filmey Box"
                },
                "viewCount": "616K views",
                "duration": "3:10",
                "published": "1 year ago",
                "description": "Kaecilius' Defeat Scene | Doctor Strange (2016) IMAX Movie Clip 4K Ultra HD Cast: Benedict Cumberbatch, Chiwetel Ejiofor, ..."
            },
            {
                "videoId": "wwcSki7r9cQ",
                "thumbnail": "https://i.ytimg.com/vi/wwcSki7r9cQ/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCLyTEJvfgOwiIuLCCSMgGJFdammQ",
                "title": "Doctor Strange - Trailer World Premiere",
                "author": {
                    "profile": "https://yt3.ggpht.com/ytc/AIf8zZQGs6qU0e5FaWTDNa3_aWMkeNHiWGIwRCNcEV6wYY4=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Jimmy Kimmel Live"
                },
                "viewCount": "7.5M views",
                "duration": "1:57",
                "published": "7 years ago",
                "description": "This is the worldwide exclusive trailer debut for Marvel's “Doctor Strange.” SUBSCRIBE to get the latest #KIMMEL: ..."
            },
            {
                "videoId": "yknvwyHiz4Q",
                "thumbnail": "https://i.ytimg.com/vi/yknvwyHiz4Q/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDNDM0bglJuzIpsq9AqZ-vNWGY6FA",
                "title": "Peter Parker vs Dr. Stephen Strange in the movie Spider-Man: No Way Home (2021)",
                "author": {
                    "profile": "https://yt3.ggpht.com/K1WsR5ljbpGf2sVPIJzHRLeS566MMHKpIJWLtxaLCdobimHmTV9oHrKS9x46BQwzipRZjAOh=s68-c-k-c0x00ffffff-no-rj",
                    "name": "FIGHTING CINEMA"
                },
                "viewCount": "11M views",
                "duration": "4:09",
                "published": "1 year ago",
                "description": "Non-Profit Channel. Fair Use. My Copyright Disclaimer: Copyright Disclaimer Under Section 107 of the Copyright Act 1976, ..."
            },
            {
                "videoId": "aA21pLiSzQ0",
                "thumbnail": "https://i.ytimg.com/vi/aA21pLiSzQ0/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAj6p7dJ1olaUCBfgnyxs2SNaJJ5w",
                "title": "Dr. Strange Meets Pangborn Scene | Doctor Strange (2016) Movie Clip HD 4K",
                "author": {
                    "profile": "https://yt3.ggpht.com/DP_nMt7bdKwDo_NHUtWW698GUgtPfIxYMZ41y69ya6NPv8Z9juh0nQAy7Ys5qjpDgz3eOwbe_0w=s68-c-k-c0x00ffffff-no-rj",
                    "name": "Filmey Box"
                },
                "viewCount": "246K views",
                "duration": "3:01",
                "published": "1 year ago",
                "description": "Dr. Strange Meets Jonathan Pangborn Scene | Doctor Strange (2016) Movie Clip 4K Ultra HD [Open Matte] Cast: Benedict ..."
            },
            {
                "videoId": "3g92GquqV_Q",
                "thumbnail": "https://i.ytimg.com/vi/3g92GquqV_Q/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD4kpsC7GvakoAZC4tjFOOBj9Gy_Q",
                "title": "Doctor Strange (2016) | Official Trailer | Benedict Cumberbatch Superhero Movie",
                "author": {
                    "profile": "https://yt3.ggpht.com/8dmkFX1UcqiTQSTi2pbgNEHi-MPij0Ad6C0ENRbqm3wiZpBo8RYzXiQqyZNViC17JJEiEdTDH8o=s68-c-k-c0x00ffffff-no-rj",
                    "name": "MTV"
                },
                "viewCount": "7.8K views",
                "duration": "2:29",
                "published": "7 years ago",
                "description": "Benedict Cumberbatch introduces the newest trailer from his latest film, 'Doctor Strange'. Subscribe to MTV: http://goo.gl/NThuhC ..."
            }
        ],
        "createdAt": "2024-01-18T22:08:14.082Z",
        "updatedAt": "2024-01-18T22:08:14.082Z"
    }
  ```

### Get all
This endpoint returns all documents stored and managed by the aggregator service. 

- **Endpoint**: `http://127.0.0.1:5000/api/aggregators/all`
- **Method**: `GET`
- **Response Body**: 
  ```json
    [
        {
            ...
        },
        {
            ...
        },
        ...
    ]
  ```

### Get by id
This endpoint returns the aggregated document for the specified id.

- **Endpoint**: `http://127.0.0.1:5000/api/aggregators/:id`
- **Method**: `GET`
- **Params**:
  ```json
    id: some mongodb string id (i.e., "65a9a14e4ab0f91d584fc0dc")
  ```
- **Response Body**: 
  ```json
    {
        ...
    },
  ```

## Response optimization
To shorten the response time, caching and indexing are used. Caching middleware returns cached aggregated documents before the request reaches the aggregator service. Indexes on the document collections also speed up document retrieval.




