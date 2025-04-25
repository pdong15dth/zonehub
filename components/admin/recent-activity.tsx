import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg",
      initials: "JD",
    },
    action: "published a new game",
    target: "Stellar Odyssey",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg",
      initials: "JS",
    },
    action: "uploaded source code",
    target: "Enhanced UI Framework",
    time: "3 hours ago",
  },
  {
    id: 3,
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg",
      initials: "MJ",
    },
    action: "posted a news article",
    target: "PlayStation 6 Rumors Surface",
    time: "5 hours ago",
  },
  {
    id: 4,
    user: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg",
      initials: "SW",
    },
    action: "registered a new account",
    target: "",
    time: "1 day ago",
  },
  {
    id: 5,
    user: {
      name: "David Brown",
      avatar: "/placeholder.svg",
      initials: "DB",
    },
    action: "reported a comment",
    target: "in Cyberpunk 2077 DLC thread",
    time: "1 day ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name} {activity.action}{" "}
              {activity.target && <span className="font-semibold">{activity.target}</span>}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
