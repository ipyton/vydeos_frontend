export const sampleContacts = [
  {
    userId: "john_doe",
    name: "John Doe",
    type: "user",
    lastMessage: "Hey, how's the project going?",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    userId: "jane_smith",
    name: "Jane Smith",
    type: "user",
    lastMessage: "Can we meet tomorrow?",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    userId: "support_team",
    name: "Support Team",
    type: "group",
    lastMessage: "Your ticket has been resolved",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    userId: "alex_wong",
    name: "Alex Wong",
    type: "user",
    lastMessage: "Thanks for the help!",
    lastMessageTime: "3 days ago",
    unreadCount: 0,
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    userId: "project_team",
    name: "Project Team",
    type: "group",
    lastMessage: "Meeting at 3 PM",
    lastMessageTime: "Last week",
    unreadCount: 5,
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

export const sampleMessages = {
  john_doe: [
    {
      id: 1,
      sender: "john_doe",
      content: "Hey there!",
      timestamp: "2024-05-01T10:00:00Z",
      isRead: true
    },
    {
      id: 2,
      sender: "me",
      content: "Hi John! How are you?",
      timestamp: "2024-05-01T10:05:00Z",
      isRead: true
    },
    {
      id: 3,
      sender: "john_doe",
      content: "I'm good, thanks! How's the project going?",
      timestamp: "2024-05-01T10:30:00Z",
      isRead: false
    }
  ],
  jane_smith: [
    {
      id: 1,
      sender: "jane_smith",
      content: "Hello!",
      timestamp: "2024-05-02T09:00:00Z",
      isRead: true
    },
    {
      id: 2,
      sender: "me",
      content: "Hi Jane!",
      timestamp: "2024-05-02T09:05:00Z",
      isRead: true
    },
    {
      id: 3,
      sender: "jane_smith",
      content: "Can we meet tomorrow?",
      timestamp: "2024-05-02T09:10:00Z",
      isRead: true
    }
  ],
  support_team: [
    {
      id: 1,
      sender: "support_team",
      content: "Hello! How can we help you today?",
      timestamp: "2024-05-03T14:00:00Z",
      isRead: true
    },
    {
      id: 2,
      sender: "me",
      content: "I'm having trouble with the login page",
      timestamp: "2024-05-03T14:05:00Z",
      isRead: true
    },
    {
      id: 3,
      sender: "support_team",
      content: "Your ticket has been resolved",
      timestamp: "2024-05-03T15:00:00Z",
      isRead: true
    }
  ],
  alex_wong: [
    {
      id: 1,
      sender: "alex_wong",
      content: "Hey, I need some help with the API",
      timestamp: "2024-05-04T11:00:00Z",
      isRead: true
    },
    {
      id: 2,
      sender: "me",
      content: "Sure, what do you need?",
      timestamp: "2024-05-04T11:05:00Z",
      isRead: true
    },
    {
      id: 3,
      sender: "alex_wong",
      content: "Thanks for the help!",
      timestamp: "2024-05-04T12:00:00Z",
      isRead: true
    }
  ],
  project_team: [
    {
      id: 1,
      sender: "project_team",
      content: "Good morning team!",
      timestamp: "2024-05-05T09:00:00Z",
      isRead: true
    },
    {
      id: 2,
      sender: "me",
      content: "Morning!",
      timestamp: "2024-05-05T09:05:00Z",
      isRead: true
    },
    {
      id: 3,
      sender: "project_team",
      content: "Meeting at 3 PM",
      timestamp: "2024-05-05T09:10:00Z",
      isRead: false
    }
  ]
}; 