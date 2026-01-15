import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "next-themes";
import { ModeToggle } from "./mode-toggle";

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
  title: "Components/ModeToggle",
  component: ModeToggle,
  decorators: [ThemeDecorator],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InHeader: Story = {
  render: () => (
    <div className="flex w-96 items-center justify-between border-b p-4">
      <span className="font-medium">Settings</span>
      <ModeToggle />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground text-sm">Theme</span>
      <ModeToggle />
    </div>
  ),
};
