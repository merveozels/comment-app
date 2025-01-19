const data = [
  {
    "name": "Micheal Pierre",
    "time": "58 minutes ago",
    "comment": "I'm a bit unclear about how condensation forms in the water cycle. Can someone break it down?",
    "likes": 25,
    "photo": "/assets/img/micheal-avatar.jpg",
    "dislikes": 3,
    "id":crypto.randomUUID(),
    "replies": [
      {
        "name": "Chris Sprout",
        "time": "8 minutes ago",
        "comment": "Condensation happens when water vapor cools down and changes back into liquid droplets. It’s the step before precipitation. The example with the glass of ice water in the video was a great visual!",
        "likes": 2,
        "photo": "/assets/img/chris-avatar.jpg",
        "dislikes": 0,
        "id":crypto.randomUUID(),
      }
    ]
  },
  {
    "name": "Alex Hall",
    "time": "5 hours ago",
    "comment": "I really enjoyed today’s lesson on the water cycle! The animations made the processes so much easier to grasp.",
    "photo": "/assets/img/alex-avatar.jpg",
    "likes": 8,
    "dislikes": 2,
    "id":crypto.randomUUID(),
    "replies": []
  },
  {
    "name": "Meri Kauffman",
    "time": "1 day ago",
    "comment": "How do we measure the amount of water vapor in the air? Is it something we'll cover later?",
    "photo": "/assets/img/marry-avatar.jpg",
    "likes": 12,
    "dislikes": 0,
    "id":crypto.randomUUID(),
    "replies": [
      {
        "name": "Tamara Lowery",
        "time": "12 hours ago",
        "photo": "/assets/img/tamara-avatar.jpg",
        "comment": "Yes, I think we'll dive deeper into that in the next module on humidity. But the short answer is: we measure it using a tool called a hygrometer.",
        "likes": 8,
        "id":crypto.randomUUID(),
        "dislikes": 1
      },
      {
        "name": "David Garcia",
        "time": "2 hours ago",
        "comment": "Exactly! The next lesson will cover humidity, and I’m excited to see how it all connects back to the water cycle.",
        "photo": "/assets/img/david-avatar.jpg",
        "likes": 4,
        "id":crypto.randomUUID(),
        "dislikes": 0
      }
    ]
  },
  
]

export default data;