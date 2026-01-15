import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image from "next/image";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "The size variant of the card",
    },
  },
  args: {
    size: "default",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content can include any elements.</p>
      </CardContent>
    </Card>
  ),
};

export const Small: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>A compact card variant</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content with reduced padding.</p>
      </CardContent>
    </Card>
  ),
  args: {
    size: "sm",
  },
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
        <CardDescription>This card has a footer section</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content area of the card.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button className="ml-auto" size="sm">
          Save
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>Has an action button in the header</CardDescription>
        <CardAction>
          <Button size="icon-sm" variant="outline">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>The action slot is positioned in the top-right corner.</p>
      </CardContent>
    </Card>
  ),
};

export const LoginForm: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to sign in</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="email@example.com" type="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="Enter password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Sign In</Button>
      </CardFooter>
    </Card>
  ),
};

export const SignupForm: Story = {
  render: (args) => (
    <Card {...args} className="w-[400px]">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="John" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Doe" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            placeholder="email@example.com"
            type="email"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            placeholder="Create a password"
            type="password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button className="w-full">Create Account</Button>
        <p className="text-center text-muted-foreground text-xs">
          Already have an account?{" "}
          <button className="text-foreground underline" type="button">
            Sign in
          </button>
        </p>
      </CardFooter>
    </Card>
  ),
};

export const NotificationCard: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          New Notification
        </CardTitle>
        <CardDescription>Just now</CardDescription>
      </CardHeader>
      <CardContent>
        <p>You have a new message from the system administrator.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
        <Button className="ml-auto" size="sm">
          View
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: (args) => (
    <Card {...args} className="w-[200px]">
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="font-bold text-2xl">$45,231.89</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-green-600 text-xs">+20.1% from last month</p>
      </CardContent>
    </Card>
  ),
  args: {
    size: "sm",
  },
};

export const ImageCard: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px] overflow-hidden">
      <Image
        alt="Placeholder"
        className="h-48 w-full object-cover"
        height={192}
        src="https://placehold.co/350x192/e2e8f0/64748b?text=Image"
        width={350}
      />
      <CardHeader>
        <CardTitle>Image Card</CardTitle>
        <CardDescription>Card with a header image</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Cards can include images at the top.</p>
      </CardContent>
    </Card>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card className="w-[300px]" size="default">
        <CardHeader>
          <CardTitle>Default Size</CardTitle>
          <CardDescription>Standard padding and spacing</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Regular card content.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>

      <Card className="w-[300px]" size="sm">
        <CardHeader>
          <CardTitle>Small Size</CardTitle>
          <CardDescription>Compact padding and spacing</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Smaller card content.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
