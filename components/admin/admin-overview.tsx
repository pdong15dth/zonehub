"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    users: 2400,
    games: 240,
    repos: 400,
  },
  {
    name: "Feb",
    users: 1398,
    games: 139,
    repos: 300,
  },
  {
    name: "Mar",
    users: 9800,
    games: 980,
    repos: 500,
  },
  {
    name: "Apr",
    users: 3908,
    games: 390,
    repos: 350,
  },
  {
    name: "May",
    users: 4800,
    games: 480,
    repos: 400,
  },
  {
    name: "Jun",
    users: 3800,
    games: 380,
    repos: 600,
  },
]

export function AdminOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="users" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="games" fill="#2563eb" radius={[4, 4, 0, 0]} />
        <Bar dataKey="repos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
