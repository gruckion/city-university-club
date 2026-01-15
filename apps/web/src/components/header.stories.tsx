import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "next-themes";
import Header from "./header";

const ThemeDecorator = (Story: React.ComponentType) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    disableTransitionOnChange
  >
    <Story />
  </ThemeProvider>
);

const meta = {
  title: "Components/Header",
  component: Header,
  decorators: [ThemeDecorator],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDashboard: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard",
      },
    },
  },
};

export const OnTodos: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/todos",
      },
    },
  },
};

export const WithContainer: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl">
      <Header />
      <div className="p-4">
        <p className="text-muted-foreground">Page content goes here...</p>
      </div>
    </div>
  ),
};
